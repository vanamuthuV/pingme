package com.pingme.server.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageOnlyResponseDTO {

    private String id;
    private String sender;
    private String receiver;
    private String message;
    private boolean isEdited;
    private boolean isDelivered;
    private boolean isSeen;
    private Instant createdAt;
    private Instant updatedAt;

}
