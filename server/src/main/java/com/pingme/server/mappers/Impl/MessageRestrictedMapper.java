package com.pingme.server.mappers.Impl;

import com.pingme.server.domain.dto.MessageOnlyResponseDTO;
import com.pingme.server.domain.dto.MessageResponseDTO;
import com.pingme.server.domain.entity.MessageEntity;
import com.pingme.server.mappers.Mapper;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;

public class MessageRestrictedMapper implements Mapper<MessageOnlyResponseDTO, MessageEntity> {

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public MessageOnlyResponseDTO mapTo(MessageEntity messageEntity) {
        return modelMapper.map(messageEntity, MessageOnlyResponseDTO.class);
    }

    @Override
    public MessageEntity mapFrom(MessageOnlyResponseDTO messageOnlyResponseDTO) {
        return modelMapper.map(messageOnlyResponseDTO, MessageEntity.class);
    }
}
