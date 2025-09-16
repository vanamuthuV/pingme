package com.pingme.server.service;

import com.pingme.server.domain.dto.MessageIntermediateDTO;
import com.pingme.server.domain.entity.MessageEntity;

public interface MessageService {

    public void saveMessage(MessageIntermediateDTO payload);

}
