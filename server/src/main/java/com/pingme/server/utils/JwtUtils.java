package com.pingme.server.utils;

import com.pingme.server.domain.dto.UserResponseDTO;
import io.jsonwebtoken.Claims;

public interface JwtUtils {

    public String generateToken(UserResponseDTO userResponseDTO);
    public Claims extractUser(String token);
    public UserResponseDTO validateToken(String token);
    public void init();

}
