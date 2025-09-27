package com.pingme.server.utils.Impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pingme.server.types.RedisEnums;
import com.pingme.server.utils.StatusSubscribers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class StatusSubscribersImpl implements StatusSubscribers {

    @Autowired
    private RedisUtilsImpl redisUtils;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public void addSubscriber(String user_id, String subscriber_id) {
        redisUtils.addSubscriberValue(user_id.trim(), subscriber_id.trim());
    }

    @Override
    public Set<String> getSubscribers(String user_id) throws JsonProcessingException {

        Set<String> subscribers = new HashSet<>();

        String subscribersString = redisUtils.getValue(user_id);

        if(subscribersString != null && !subscribersString.trim().isEmpty())
            subscribers = objectMapper.readValue(subscribersString, new TypeReference<Set<String>>() {});

        return subscribers;
    }

    @Override
    public void deleteSubscriberUser(String user_id) {
        redisUtils.removeValue(user_id);
    }

    @Override
    public void deleteSubscriber(String user_id, Set<String> subscribers) {
        redisUtils.deleteSubscriber(user_id, subscribers);
    }
}
