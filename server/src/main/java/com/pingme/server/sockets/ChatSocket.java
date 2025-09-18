package com.pingme.server.sockets;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pingme.server.config.WSContextTranferFromHttp;
import com.pingme.server.domain.dto.MessageIntermediateDTO;
import com.pingme.server.domain.dto.SenderMessageDTO;
import com.pingme.server.domain.dto.UserResponseDTO;
import com.pingme.server.service.MessageService;
import com.pingme.server.sockets.utils.SocketClientHandler;
import com.pingme.server.types.SocketType;
import com.pingme.server.utils.Impl.SpringContextBeanGetterImpl;
import com.pingme.server.utils.RedisUtils;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@Component
@ServerEndpoint(value = "/chat", configurator = WSContextTranferFromHttp.class)
public class ChatSocket {

    private static final SocketClientHandler clients = new SocketClientHandler();
    private static final ObjectMapper mapper = new ObjectMapper();
    private MessageService messageService;
    private RedisUtils redisUtils;

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

    @OnOpen
    public void onOpen(Session session) {

        UserResponseDTO user = (UserResponseDTO) session.getUserProperties().get("user");

        clients.addClient(SocketType.CHAT, user.getId().trim(), session);
        System.out.println("From chatsocket" + user);
        System.out.println("Clinet ID : " + session.getId());
    }

    @OnMessage
    public void messageRelay(String payload, Session session) throws IOException, ExecutionException, InterruptedException {

        SenderMessageDTO message = mapper.readValue(payload, SenderMessageDTO.class);
        UserResponseDTO senderDetails = (UserResponseDTO) session.getUserProperties().get("user");

        CompletableFuture<String> messageId = getMessageService().saveMessage(
                MessageIntermediateDTO
                        .builder()
                        .senderId(senderDetails.getId())
                        .recieverId(message.getRecieverId())
                        .message(message.getMessage())
                        .time(message.getTime())
                        .build()
        );

        if(clients.isClientConnected(SocketType.CHAT, message.getRecieverId())) {
            Session recieverSession = clients.getSession(SocketType.CHAT, message.getRecieverId());
            Map<String, String> map = new HashMap<>();
            map.put("from", senderDetails.getId());
            map.put("to", message.getRecieverId());
            map.put("message", message.getMessage());
            map.put("time", message.getTime().toString());

            recieverSession.getBasicRemote().sendText(mapper.writeValueAsString(map));

            session.getBasicRemote().sendText("sent message to : " + message.getRecieverId());
        } else {
            getRedisUtils().addMessage(message.getRecieverId(), messageId.get());
        }

        System.out.println(getRedisUtils().getMessages(message.getRecieverId()));

    }

    @OnClose
    public void onClose(Session session) {
        UserResponseDTO user = (UserResponseDTO) session.getUserProperties().get("user");
        clients.removeClient(SocketType.CHAT, user.getId());

        System.out.println("client with ID " + session.getId() + " left the chat");
    }

}
