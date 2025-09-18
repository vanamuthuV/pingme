package com.pingme.server.service;

import com.pingme.server.domain.dto.MessageIntermediateDTO;
import com.pingme.server.domain.entity.MessageEntity;

import java.util.concurrent.CompletableFuture;

public interface MessageService {

    public CompletableFuture<String> saveMessage(MessageIntermediateDTO payload);

}
