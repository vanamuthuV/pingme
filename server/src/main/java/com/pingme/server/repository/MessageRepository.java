package com.pingme.server.repository;

import com.pingme.server.domain.entity.MessageEntity;
import com.pingme.server.domain.entity.UserEntity;
import com.pingme.server.types.LastMessageProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<MessageEntity, String> {
    public List<MessageEntity> findByReceiver_IdAndIsSeenFalse(String id);

    @Query("SELECT DISTINCT m.sender FROM MessageEntity m WHERE m.receiver.id = :receiverId")
    public List<UserEntity> findDistinctSendersByReceiverID(@Param("receiverId") String receiverId);

    @Query(value = """
                SELECT message, sender_id, reciever_id
                FROM (
                    SELECT
                        message,
                        sender_id,
                        reciever_id,
                        ROW_NUMBER() OVER (
                            PARTITION BY LEAST(sender_id, reciever_id), GREATEST(sender_id, reciever_id)
                            ORDER BY created_at DESC
                        ) AS rn
                    FROM
                    messages
                    WHERE (sender_id = :receiverId OR reciever_id = :receiverId)
                    AND
                    (sender_id IN (:senders) OR reciever_id IN (:senders))
                ) t
                WHERE rn = 1
            """, nativeQuery = true)
    public List<LastMessageProjection> findChatsLastMessage(@Param("receiverId") String receiverId, @Param("senders") List<String> senders);
}
