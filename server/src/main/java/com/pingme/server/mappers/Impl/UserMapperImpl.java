package com.pingme.server.mappers.Impl;

import com.pingme.server.domain.dto.UserResponseDTO;
import com.pingme.server.domain.entity.UserEntity;
import com.pingme.server.mappers.Mapper;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserMapperImpl implements Mapper<UserEntity, UserResponseDTO> {

    private final ModelMapper modelMapper;

    public UserMapperImpl(ModelMapper modelMapper) { this.modelMapper = modelMapper; }

    @Override
    public UserEntity mapTo(UserResponseDTO user) {
        return modelMapper.map(user, UserEntity.class);
    }

    @Override
    public UserResponseDTO mapFrom(UserEntity user) {
        return modelMapper.map(user, UserResponseDTO.class);
    }

}
