package com.pingme.server.service.Impl;

import com.pingme.server.domain.dto.MessageIntermediateDTO;
import com.pingme.server.domain.entity.MessageEntity;
import com.pingme.server.domain.entity.UserEntity;
import com.pingme.server.repository.MessageRepository;
import com.pingme.server.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
public class MessageServiceImpl implements MessageService {

    @Autowired
    private MessageRepository messageRepository;

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
}
