package com.pingme.server.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.lettuce.core.RedisClient;
import io.lettuce.core.RedisFuture;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.api.async.RedisAsyncCommands;
import io.lettuce.core.api.async.RedisListAsyncCommands;
import io.lettuce.core.api.sync.RedisListCommands;
import io.lettuce.core.internal.LettuceFactories;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

// Using Lettuce as the driver
@Configuration
public class RedisConfig {

    @Value("${spring.data.redis.uri}")
    private String uri;

    private RedisAsyncCommands<String, String> createRedisClient() {
        final  RedisClient client = RedisClient.create(uri);
        final RedisAsyncCommands<String, String> commands = client.connect().async();
        return commands;
    }

    @Bean
    public RedisAsyncCommands<String, String> getRedisCommandlet(){
        return createRedisClient();
    }

}
