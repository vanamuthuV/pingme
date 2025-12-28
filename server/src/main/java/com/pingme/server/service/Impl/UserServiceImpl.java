package com.pingme.server.service.Impl;

import com.pingme.server.domain.dto.UserResponseDTO;
import com.pingme.server.domain.entity.UserEntity;
import com.pingme.server.exceptions.UserNotFoundException;
import com.pingme.server.mappers.Impl.UserMapperImpl;
import com.pingme.server.mappers.Mapper;
import com.pingme.server.repository.AuthRepository;
import com.pingme.server.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private AuthRepository authRepository;

    @Autowired
    private UserMapperImpl userMapper;

    @Override
    public UserResponseDTO getUser(String email) {
        UserEntity user = authRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("user not in there records"));
        return userMapper.mapFrom(user);
    }

}
