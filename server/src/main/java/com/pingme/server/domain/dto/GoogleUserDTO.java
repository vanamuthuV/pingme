package com.pingme.server.domain.dto;

import lombok.Data;

@Data
public class GoogleUserDTO {

    private String email;
    private String name;
    private String given_name;
    private String family_name;
    private String picture;

}
