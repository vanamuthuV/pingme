package com.pingme.server.service.Impl;

import com.pingme.server.domain.dto.MessageIntermediateDTO;
import com.pingme.server.domain.dto.MessageResponseDTO;
import com.pingme.server.domain.dto.UserResponseDTO;
import com.pingme.server.domain.entity.MessageEntity;
import com.pingme.server.domain.entity.UserEntity;
import com.pingme.server.mappers.Impl.MessageMapperImpl;
import com.pingme.server.mappers.Impl.UserMapperImpl;
import com.pingme.server.repository.MessageRepository;
import com.pingme.server.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class MessageServiceImpl implements MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private MessageMapperImpl messageMapper;

    @Autowired
    private UserMapperImpl userMapper;

    @Async
    @Override
    public CompletableFuture<String> saveMessage(MessageIntermediateDTO payload) {

        MessageEntity message = MessageEntity
                .builder()
                .sender(UserEntity.builder().id(payload.getSenderId()).build())
                .receiver(UserEntity.builder().id(payload.getRecieverId()).build())
                .message(payload.getMessage())
                .createdAt(payload.getTime())
                .build();

        MessageEntity savedMessage = messageRepository.save(message);

        return CompletableFuture.completedFuture(savedMessage.getId());

    }

    @Async
    @Override
    public CompletableFuture<MessageResponseDTO[]> getUnseenMessageByRecieverId(String userId) {
        List<MessageEntity> messageList = messageRepository.findByReceiver_IdAndIsSeenFalse(userId);

        List<MessageResponseDTO> messageDtos = new ArrayList<>();

        for( MessageEntity message : messageList)
            messageDtos.add(messageMapper.mapFrom(message));

        return CompletableFuture.completedFuture(messageDtos.toArray(new MessageResponseDTO[0]));

    }

    @Async
    @Override
    public CompletableFuture<MessageResponseDTO[]> getAllMessages(List<String> messageIds) {

        List<MessageEntity> messages = messageRepository.findAllById(messageIds);
        List<MessageResponseDTO> messagesDTOs = new ArrayList<>();

        for(MessageEntity message : messages)
            messagesDTOs.add(messageMapper.mapFrom(message));

        return CompletableFuture.completedFuture(messagesDTOs.toArray(new MessageResponseDTO[0]));

    }

    @Async
    @Override
    public CompletableFuture<List<UserResponseDTO>> getDistinctSendersByReceiverId(String id) {

        List<UserEntity> senders = messageRepository.findDistinctSendersByReceiverID(id);
        List<UserResponseDTO> sendersDTO = new ArrayList<>();

        for(UserEntity user : senders)
            sendersDTO.add(userMapper.mapFrom(user));

        return CompletableFuture.completedFuture(sendersDTO);

    }


}
