package com.pingme.server.utils;

import java.util.List;
import java.util.Set;

public interface RedisUtils {

    public boolean addMessageValue(String userId, String messageId);
    public boolean deleteMessage(String userId, String[] messageIds);
    public String getValue(String userId);
    public boolean removeValue(String userId);
    public boolean deleteSubscriber(String user_id, Set<String> subscribers);
    public boolean addSubscriberValue(String userId, String subscriberId);
}
