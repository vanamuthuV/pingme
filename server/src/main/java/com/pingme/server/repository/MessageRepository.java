package com.pingme.server.repository;

import com.pingme.server.domain.entity.MessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<MessageEntity, String> {
    public List<MessageEntity> findByReceiver_IdAndIsSeenFalse(String id);
}
