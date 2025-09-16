package com.pingme.server.mappers.Impl;

import com.pingme.server.domain.dto.UserResponseDTO;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class UserToObject {

    public UserResponseDTO mapTo(Map map) {
        return UserResponseDTO.
                builder()
                .id(map.getOrDefault("id", "").toString())
                .username(map.getOrDefault("username", "").toString())
                .firstname(map.getOrDefault("firstName", "").toString())
                .lastname(map.getOrDefault("lastName", "").toString())
                .email(map.getOrDefault("email", "").toString())
                .profile_picture(map.getOrDefault("profile_picture", "").toString())
                .status(map.getOrDefault("status", "").toString())
                .build();
    }

    public Map<String, String> mapFrom(UserResponseDTO user) {
        Map<String, String> map = new HashMap<>();

        map.put("id", user.getId());
        map.put("username", user.getUsername());
        map.put("firstname", user.getFirstname());
        map.put("lastname", user.getLastname());
        map.put("email", user.getEmail());
        map.put("profile_picture", user.getProfile_picture());
        map.put("status", user.getStatus());

        return map;
    }

}
