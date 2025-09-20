package com.pingme.server.domain.dto;

import com.pingme.server.domain.entity.UserEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MessageResponseDTO {

    private String id;
    private UserResponseDTO sender;
    private UserResponseDTO receiver;
    private String message;
    private boolean isEdited;
    private boolean isDelivered;
    private boolean isSeen;
    private Instant createdAt;
    private Instant updatedAt;

}
