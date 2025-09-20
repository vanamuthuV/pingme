package com.pingme.server.sockets;

import com.pingme.server.config.WSContextTranferFromHttp;
import com.pingme.server.domain.dto.UserResponseDTO;
import com.pingme.server.sockets.utils.SocketClientHandler;
import com.pingme.server.types.SocketType;
import com.pingme.server.utils.Impl.SpringContextBeanGetterImpl;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;

@ServerEndpoint(value="/notification", configurator = WSContextTranferFromHttp.class)
public class Notificationsocket {

    private SocketClientHandler clients;

    public SocketClientHandler getClientHandler() {
        if(clients == null)
            clients = SpringContextBeanGetterImpl.getBean(SocketClientHandler.class);
        return clients;
    }

    @OnOpen
    public void onOpen(Session session) {
        System.out.println("client (notify) connected : " + session.getId());
        UserResponseDTO user = (UserResponseDTO) session.getUserProperties().get("user");
        getClientHandler().addClient(SocketType.NOTIFICATION, user.getId(), session);
    }

    @OnMessage
    public void onMessage(String message, Session session) {



    }

    @OnClose
    public void onClose(Session session) {
        System.out.println("client (notify) disconnected : " + session.getId());
        UserResponseDTO user = (UserResponseDTO) session.getUserProperties().get("user");
        getClientHandler().removeClient(SocketType.NOTIFICATION, user.getId());
    }


}
