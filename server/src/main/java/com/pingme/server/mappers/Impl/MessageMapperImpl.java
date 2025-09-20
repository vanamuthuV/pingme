package com.pingme.server.mappers.Impl;

import com.pingme.server.domain.dto.MessageResponseDTO;
import com.pingme.server.domain.entity.MessageEntity;
import com.pingme.server.mappers.Mapper;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class MessageMapperImpl implements Mapper<MessageEntity, MessageResponseDTO> {

    private ModelMapper modelMapper;

    public MessageMapperImpl(ModelMapper modelMapper){
        this.modelMapper = modelMapper;
    }

    @Override
    public MessageEntity mapTo(MessageResponseDTO messageResponseDTO) {
        return modelMapper.map(messageResponseDTO, MessageEntity.class);
    }

    @Override
    public MessageResponseDTO mapFrom(MessageEntity messageEntity) {
        return modelMapper.map(messageEntity, MessageResponseDTO.class);
    }
}
