package com.pingme.server.sockets.utils;

import com.pingme.server.types.SocketType;
import jakarta.websocket.Session;
import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Component
public class SocketClientHandler {

    private final static ConcurrentMap<String, Session> chatClients = new ConcurrentHashMap<>();
    private final static ConcurrentMap<String, Session> notificationClients = new ConcurrentHashMap<>();

    public void addClient(SocketType type, String userId, Session session) {
        switch (type) {
            case CHAT -> chatClients.put(userId, session);
            case NOTIFICATION -> notificationClients.put(userId, session);
        }

    }

    public void removeClient(SocketType type, String userId) {
        switch (type) {
            case CHAT -> chatClients.remove(userId);
            case NOTIFICATION -> notificationClients.remove(userId);
        }

    }

    public Session getSession(SocketType type, String userId) {
        switch (type) {
            case CHAT -> {
                return chatClients.getOrDefault(userId, null);
            }
            case NOTIFICATION -> {
                return notificationClients.getOrDefault(userId, null);
            }

        }
        return null;
    }

    public Integer numberOfchatClients(SocketType type) {
        switch (type) {
            case CHAT -> {
                return chatClients.size();
            }

            case NOTIFICATION -> {
                return notificationClients.size();
            }
        }

        return null;
    }

    public Boolean isClientConnected(SocketType type, String userId) {
        switch (type) {
            case CHAT -> {
                return chatClients.containsKey(userId);
            }

            case NOTIFICATION -> {
                return notificationClients.containsKey(userId);
            }
        }
        return null;
    }

    public ConcurrentMap<String, Session> getAllchatClients(SocketType type) {
        switch (type) {
            case CHAT -> {
                return chatClients;
            }

            case NOTIFICATION -> {
                return notificationClients;
            }
        }
        return null;
    }

}
