package com.pingme.server.domain.dto;

import lombok.Data;

@Data
public class GoogleAccessTokenDTO {

    private String access_token;

    private int expires_in;

    private String scope;

    private String id_token;

}
