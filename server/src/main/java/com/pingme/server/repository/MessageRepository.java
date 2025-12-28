package com.pingme.server.repository;

import com.pingme.server.domain.dto.MessageOnlyResponseDTO;
import com.pingme.server.domain.entity.MessageEntity;
import com.pingme.server.domain.entity.UserEntity;
import com.pingme.server.types.LastMessageProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<MessageEntity, String> {
    public List<MessageEntity> findByReceiver_IdAndIsSeenFalse(String id);

    @Query("""
        SELECT DISTINCT m.receiver
        FROM MessageEntity m
        WHERE m.sender.id = :receiverId
        
        UNION
        
        SELECT DISTINCT m.sender
        FROM MessageEntity m
        WHERE m.receiver.id = :receiverId
    """)
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

    @Query("""
    SELECT new com.pingme.server.domain.dto.MessageOnlyResponseDTO(
        m.id,
        m.sender.id,
        m.receiver.id,
        m.message,
        m.isEdited,
        m.isDelivered,
        m.isSeen,
        m.createdAt,
        m.updatedAt
    )
    FROM MessageEntity m
    WHERE (m.sender.id = :sender AND m.receiver.id = :receiver)
       OR (m.sender.id = :receiver AND m.receiver.id = :sender)
    ORDER BY m.createdAt DESC
""")
    Page<MessageOnlyResponseDTO> getChatBetweenUsers(
            @Param("receiver") String receiver,
            @Param("sender") String sender,
            Pageable pageable
    );


}
