package com.pingme.server.service;

import com.pingme.server.domain.dto.MessageIntermediateDTO;
import com.pingme.server.domain.dto.MessageResponseDTO;
import com.pingme.server.domain.dto.UserResponseDTO;
import com.pingme.server.domain.entity.MessageEntity;
import com.pingme.server.types.LastMessageProjection;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface MessageService {

    public CompletableFuture<String> saveMessage(MessageIntermediateDTO payload);
    public CompletableFuture<MessageResponseDTO[]> getUnseenMessageByRecieverId(String id);
    public CompletableFuture<MessageResponseDTO[]> getAllMessages(List<String> messageIds);
    public CompletableFuture<List<UserResponseDTO>> getDistinctSendersByReceiverId(String id);
    public CompletableFuture<List<LastMessageProjection>> getLastMessages(String receiverId, List<String> sender);

 }
