package com.pingme.server.service;

import com.pingme.server.domain.dto.UserResponseDTO;

public interface UserService {

    public UserResponseDTO getUser(String email);

}
