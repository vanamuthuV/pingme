package com.pingme.server.types;

import lombok.Data;

import java.util.List;

@Data
public class LastMessageRequest {

    private List<String> senders;

}
