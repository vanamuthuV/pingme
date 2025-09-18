package com.pingme.server.utils.Impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pingme.server.config.RedisConfig;
import com.pingme.server.utils.RedisUtils;
import io.lettuce.core.api.async.RedisAsyncCommands;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;

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

    public boolean addMessage(String userId, String messageId) {

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

    public List<String> getMessages(String userId) {

        try{
            return objectMapper.readValue(commands.get(userId).get(), new TypeReference<List<String>>(){});
        } catch (Exception e) {
            System.out.println("problem at getting message from redis " + this.getClass());
            return List.of();
        }

    }

    @Override
    public boolean removeUser(String userId) {

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
