package com.pingme.server.sockets;

import com.pingme.server.config.WSContextTranferFromHttp;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;

@ServerEndpoint(value="/notification", configurator = WSContextTranferFromHttp.class)
public class Notificationsocket {

    @OnOpen
    public void onOpen(Session session) {

    }

    @OnMessage
    public void onMessage(String message, Session session) {

    }

    @OnClose
    public void onClose(Session session) {

    }


}
