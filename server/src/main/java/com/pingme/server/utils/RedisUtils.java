package com.pingme.server.utils;

import java.util.List;

public interface RedisUtils {

    public boolean addMessage(String userId, String messageId);
    public boolean deleteMessage(String userId, String[] messageIds);
    public List<String> getMessages(String userId);
    public boolean removeUser(String userId);

}
