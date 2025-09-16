package com.pingme.server.types;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@lombok.Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResponderType {

    private boolean status;
    private String token;
    private String message;
    private Data data;

}
