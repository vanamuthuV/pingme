package com.pingme.server.domain.dto;

import lombok.Data;

@Data
public class SenderMessageDTO {
    private String uuid;
    private String recieverId;
    private String message;
    private String time;
}
