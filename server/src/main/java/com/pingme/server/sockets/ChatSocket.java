package com.pingme.server.sockets;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.pingme.server.config.WSContextTranferFromHttp;
import com.pingme.server.domain.dto.*;
import com.pingme.server.service.MessageService;
import com.pingme.server.sockets.utils.SocketClientHandler;
import com.pingme.server.types.RedisEnums;
import com.pingme.server.types.SocketType;
import com.pingme.server.utils.Impl.SpringContextBeanGetterImpl;
import com.pingme.server.utils.RedisUtils;
import com.pingme.server.utils.StatusSubscribers;
import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@Component
@ServerEndpoint(value = "/chat", configurator = WSContextTranferFromHttp.class)
public class ChatSocket {

    private static final SocketClientHandler clients = new SocketClientHandler();
    private static ObjectMapper mapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    private MessageService messageService;
    private RedisUtils redisUtils;
    private ObjectMapper objectMapper;
    private StatusSubscribers statusSubscribers;

    public MessageService getMessageService() {
        if(messageService == null)
            messageService = SpringContextBeanGetterImpl.getBean(MessageService.class);
        return messageService;
    }

    public RedisUtils getRedisUtils() {
        if(redisUtils == null)
            redisUtils = SpringContextBeanGetterImpl.getBean(RedisUtils.class);
        return redisUtils;
    }

    public ObjectMapper getObjectMapper() {
        if(objectMapper == null)
            objectMapper = SpringContextBeanGetterImpl.getBean(ObjectMapper.class);
        return objectMapper;
    }

    public StatusSubscribers getStatusSubscribers() {
        if(statusSubscribers == null)
            statusSubscribers = SpringContextBeanGetterImpl.getBean(StatusSubscribers.class);
        return statusSubscribers;
    }

    @OnOpen
    public void onOpen(Session session) throws EncodeException, IOException, ExecutionException, InterruptedException {

        UserResponseDTO user = (UserResponseDTO) session.getUserProperties().get("user");

        String redisMessages = getRedisUtils().getValue(RedisEnums.MESSAGE.name() + user.getId().trim());
        List<String> list = new ArrayList<>();

        System.out.println("Redis MEssage" + redisMessages);

        if(redisMessages != null && !redisMessages.trim().isEmpty())
            list = getObjectMapper().readValue(redisMessages, new TypeReference<List<String>>(){});

        if(list.isEmpty()) {
            System.out.println("From Database");
            MessageResponseDTO[] messages = getMessageService()
                    .getUnseenMessageByRecieverId(user.getId())
                    .get();

            for(MessageResponseDTO message : messages)
                getRedisUtils().addMessageValue(RedisEnums.MESSAGE.name() + user.getId(), message.getId());

            session
                    .getAsyncRemote()
                    .sendText(mapper.writeValueAsString(
                            Map.of("type", "message", "payload", messages)
                    ));
        } else {
            System.out.println("From redis");
            List<String> messagesIds = getObjectMapper().readValue(getRedisUtils().getValue(RedisEnums.MESSAGE.name() + user.getId()), new TypeReference<List<String>>(){});
            MessageResponseDTO[] messages = getMessageService().getAllMessages(messagesIds).get();

            session
                    .getAsyncRemote()
                    .sendText(mapper.writeValueAsString(
                            Map.of("type", "message", "payload", messages)
                    ));
        }

        Set<String> subscribers = getStatusSubscribers().getSubscribers(RedisEnums.CHAT_SUBS.name() + user.getId().trim());

        System.out.println(subscribers + "the subscriber");

        for(String s : subscribers)
            if(clients.isClientConnected(SocketType.CHAT, s))
                clients.getSession(SocketType.CHAT, s).getAsyncRemote().sendText(
                        getObjectMapper().writeValueAsString(Map.of(
                            "type" ,"status", "payload", Map.of(
                                    "status", "ONLINE", "user_id", user.getId()
                                )
                        ))
                );

        clients.addClient(SocketType.CHAT, user.getId().trim(), session);
        System.out.println("From chatsocket" + user);
        System.out.println("Client ID : " + session.getId());
    }

    @OnMessage
    public void messageRelay(String payload, Session session) throws IOException, ExecutionException, InterruptedException {

        SenderMessageDTO message = mapper.readValue(payload, SenderMessageDTO.class);
        UserResponseDTO senderDetails = (UserResponseDTO) session.getUserProperties().get("user");

        CompletableFuture<MessageOnlyResponseDTO> savedMessage = getMessageService().saveMessage(
                MessageIntermediateDTO
                        .builder()
                        .senderId(senderDetails.getId())
                        .recieverId(message.getRecieverId())
                        .message(message.getMessage())
                        .time(Instant.parse(message.getTime()))
                        .build()
        );

        Map<String, Object> messagePayload = new HashMap<>();

        messagePayload.put("type", "message");

        Map<String, String> map = new HashMap<>();
        map.put("sender", senderDetails.getId());
        map.put("receiver", message.getRecieverId());
        map.put("message", savedMessage.get().getMessage());
        map.put("id", savedMessage.get().getId());
        map.put("createdAt", savedMessage.get().getCreatedAt().toString());
        map.put("updatedAt", savedMessage.get().getUpdatedAt().toString());
        map.put("seen", String.valueOf(savedMessage.get().isSeen()));
        map.put("delivered", String.valueOf(savedMessage.get().isDelivered()));
        map.put("edited", String.valueOf(savedMessage.get().isEdited()));

        messagePayload.put("payload", map);

        if(clients.isClientConnected(SocketType.CHAT, message.getRecieverId())) {
            Session recieverSession = clients.getSession(SocketType.CHAT, message.getRecieverId());
            recieverSession.getBasicRemote().sendText(mapper.writeValueAsString(messagePayload));
            map.put("delivered", "true");
            messagePayload.put("payload", map);
        } else {
            getRedisUtils().addMessageValue(RedisEnums.MESSAGE.name() + message.getRecieverId(), savedMessage.get().getId());
        }

        session.getBasicRemote().sendText(mapper.writeValueAsString(messagePayload));

    }

    @OnClose
    public void onClose(Session session) throws IOException {
        UserResponseDTO user = (UserResponseDTO) session.getUserProperties().get("user");
        clients.removeClient(SocketType.CHAT, user.getId());

        Set<String> subscribers = getStatusSubscribers().getSubscribers(RedisEnums.CHAT_SUBS.name() + user.getId().trim());

        System.out.println(subscribers + "the subscriber");

        for(String s : subscribers)
            if(clients.isClientConnected(SocketType.CHAT, s))
                clients.getSession(SocketType.CHAT, s).getAsyncRemote().sendText(
                        getObjectMapper().writeValueAsString(Map.of(
                                "type" ,"status", "payload",  Map.of(
                                        "status", "OFFLINE", "user_id", user.getId()
                                )))
                );

        System.out.println("client with ID " + session.getId() + " left the chat");
    }

}
