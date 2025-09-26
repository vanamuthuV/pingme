package com.pingme.server.utils;

import com.fasterxml.jackson.core.JsonProcessingException;

import java.util.Set;

public interface StatusSubscribers {

    public void addSubscriber(String user_id, String subscriber_id);
    public Set<String> getSubscribers(String user_id) throws JsonProcessingException;
    public void deleteSubscriberUser (String user_id);
    public void deleteSubscriber(String user_id, Set<String> subscribers);

}
