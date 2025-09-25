package com.pingme.server.types;

import com.pingme.server.domain.dto.UserResponseDTO;

import java.util.List;

public class UserResponseDTOList implements Data{

    private final List<UserResponseDTO> users;

    public UserResponseDTOList(List<UserResponseDTO> users){
        this.users = users;
    }

    public UserResponseDTO[] getUsers() {
        return users.toArray(new UserResponseDTO[0]);
    }

}
