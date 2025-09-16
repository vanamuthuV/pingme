package com.pingme.server.domain.dto;

import lombok.Data;

import java.time.Instant;

@Data
public class SenderMessageDTO {
    private String recieverId;
    private String message;
    private Instant time = Instant.now();
}
