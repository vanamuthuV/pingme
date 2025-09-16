package com.pingme.server.sockets;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pingme.server.config.WSContextTranferFromHttp;
import com.pingme.server.domain.dto.MessageIntermediateDTO;
import com.pingme.server.domain.dto.SenderMessageDTO;
import com.pingme.server.domain.dto.UserResponseDTO;
import com.pingme.server.service.Impl.MessageServiceImpl;
import com.pingme.server.service.MessageService;
import com.pingme.server.sockets.utils.SocketClientHandler;
import com.pingme.server.utils.SpringContextBeanGetter;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
@ServerEndpoint(value = "/chat", configurator = WSContextTranferFromHttp.class)
public class ChatSocket {

    private static final SocketClientHandler clients = new SocketClientHandler();
    private static final ObjectMapper mapper = new ObjectMapper();
    private MessageService messageService;

    public MessageService getMessageService() {
        if(messageService == null)
            messageService = SpringContextBeanGetter.getBean(MessageService.class);
        return messageService;
    }

    @OnOpen
    public void onOpen(Session session) {

        UserResponseDTO user = (UserResponseDTO) session.getUserProperties().get("user");

        clients.addClient(user.getId().trim(), session);
        System.out.println("From chatsocket" + user);
        System.out.println("Clinet ID : " + session.getId());
    }

    @OnMessage
    public void messageRelay(String payload, Session session) throws IOException {

        SenderMessageDTO message = mapper.readValue(payload, SenderMessageDTO.class);
        UserResponseDTO senderDetails = (UserResponseDTO) session.getUserProperties().get("user");


        if(clients.isClientConnected(message.getRecieverId())) {
            Session recieverSession = clients.getSession(message.getRecieverId());
            Map<String, String> map = new HashMap<>();
            map.put("from", senderDetails.getId());
            map.put("to", message.getRecieverId());
            map.put("message", message.getMessage());
            map.put("time", message.getTime().toString());

            recieverSession.getBasicRemote().sendText(mapper.writeValueAsString(map));

            session.getBasicRemote().sendText("sent message to : " + message.getRecieverId());
        }

        getMessageService().saveMessage(
                MessageIntermediateDTO
                        .builder()
                        .senderId(senderDetails.getId())
                        .recieverId(message.getRecieverId())
                        .message(message.getMessage())
                        .time(message.getTime())
                        .build()
        );

    }

    @OnClose
    public void onClose(Session session) {
        UserResponseDTO user = (UserResponseDTO) session.getUserProperties().get("user");
        clients.removeClient(user.getId());

        System.out.println("client with ID " + session.getId() + " left the chat");
    }

}
