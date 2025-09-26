package com.pingme.server.utils.Impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pingme.server.config.RedisConfig;
import com.pingme.server.types.RedisEnums;
import com.pingme.server.utils.RedisUtils;
import io.lettuce.core.api.async.RedisAsyncCommands;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class RedisUtilsImpl implements RedisUtils {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RedisConfig redisConfig;

    private RedisAsyncCommands<String, String> commands;

    public RedisUtilsImpl(RedisAsyncCommands<String, String> commands) {
        this.commands = commands;
    }

    @Override
    public boolean addMessageValue(String userId, String messageId) {

        try {
            commands.setnx(userId, objectMapper.writeValueAsString(new ArrayList<String>(){}));
            List<String> messageArray = objectMapper.readValue(commands.get(userId).get(), new TypeReference<List<String>>(){});
            messageArray.add(messageId);
            commands.set(userId, objectMapper.writeValueAsString(messageArray));
            return true;
        } catch (Exception e) {
            System.out.println("problem at adding message to redis " + this.getClass());
            return false;
        }

    }

    @Override
    public boolean addSubscriberValue(String userId, String subscriberId) {
        try {
            commands.setnx(userId, objectMapper.writeValueAsString(new HashSet<String>(){}));

            Set<String> subscribers = objectMapper.readValue(
                    commands.get(userId).get(),
                    new TypeReference<Set<String>>() {}
            );

            subscribers.add(subscriberId);

            commands.set(userId, objectMapper.writeValueAsString(subscribers));
            return true;

        } catch (Exception e){
            System.out.println("problem at adding subscriber to redis : " + this.getClass());
            return false;
        }
    }


    @Override
    public boolean deleteMessage(String userId, String[] messageIds) {
        try{
            List<String> messageArr = objectMapper.readValue(commands.get(userId).get(), new TypeReference<List<String>>() {});
            for(String s : messageIds) messageArr.remove(s);
            commands.set(userId, objectMapper.writeValueAsString(messageArr));
            return true;
        } catch (Exception e) {
            System.out.println("problem at removing message from redis " + this.getClass());
            return false;
        }
    }

    @Override
    public boolean deleteSubscriber(String user_id, Set<String> subscribers) {
        try{
            Set<String> subscriberRedisSet = objectMapper.readValue(commands.get(user_id).get(), new TypeReference<Set<String>>(){});
            for(String s  : subscribers) subscriberRedisSet.remove(s);
            commands.set(user_id, objectMapper.writeValueAsString(subscriberRedisSet));
            return true;
        } catch (Exception e) {
            System.out.println("error in removing subscribers from redis : " + this.getClass());
            return false;
        }
    }

    @Override
    public String getValue(String userId) {

        try{
            return commands.get(userId).get();
        } catch (Exception e) {
            System.out.println("problem at getting message from redis " + this.getClass());
            return "";
        }

    }

    @Override
    public boolean removeValue(String userId) {

        try {
            return commands.del(userId)
                    .toCompletableFuture()
                    .thenApply(deletedCount -> deletedCount > 0).get();

        } catch (Exception e) {
            System.out.println("cannot remove user from redis " + this.getClass());
            return false;
        }

    }


}
