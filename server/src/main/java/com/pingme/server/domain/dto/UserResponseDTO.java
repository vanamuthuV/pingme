package com.pingme.server.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO implements com.pingme.server.types.Data {

    private String id;
    private String username;
    private String firstname;
    private String lastname;
    private String email;
    private String profile_picture;
    private String created_at;
    private String updated_at;
    private String status;
    private String about;

}
