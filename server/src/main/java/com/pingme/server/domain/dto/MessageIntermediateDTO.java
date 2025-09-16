package com.pingme.server.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MessageIntermediateDTO {

    private String senderId;
    private String recieverId;
    private String message;
    private Instant time;

}
