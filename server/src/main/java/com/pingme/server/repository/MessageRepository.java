package com.pingme.server.repository;

import com.pingme.server.domain.entity.MessageEntity;
import com.pingme.server.domain.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<MessageEntity, String> {
    public List<MessageEntity> findByReceiver_IdAndIsSeenFalse(String id);

    @Query("SELECT DISTINCT m.sender FROM MessageEntity m WHERE m.receiver.id = :receiverId")
    public List<UserEntity> findDistinctSendersByReceiverID(@Param("receiverId") String receiverId);
}
