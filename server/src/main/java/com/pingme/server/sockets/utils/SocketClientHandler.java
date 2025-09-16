package com.pingme.server.sockets.utils;

import jakarta.websocket.Session;
import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Component
public class SocketClientHandler {

    private final static ConcurrentMap<String, Session> clients = new ConcurrentHashMap<>();

    public void addClient(String userId, Session session) {
        clients.put(userId, session);
    }

    public void removeClient(String userId) {
        clients.remove(userId);
    }

    public Session getSession(String userId) {
        return clients.getOrDefault(userId, null);
    }

    public Integer numberOfClients() {
        return clients.size();
    }

    public Boolean isClientConnected(String userId) {
        return clients.containsKey(userId);
    }

    public ConcurrentMap<String, Session> getAllClients() {
        return clients;
    }

}
