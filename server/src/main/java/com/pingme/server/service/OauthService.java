package com.pingme.server.service;

import com.pingme.server.domain.dto.GoogleAccessTokenDTO;
import com.pingme.server.domain.dto.GoogleUserDTO;
import com.pingme.server.domain.entity.UserEntity;
import com.pingme.server.types.ResponderType;
import org.springframework.http.ResponseEntity;

public interface OauthService {

    public ResponderType authenticate(String code);

    public GoogleAccessTokenDTO getOauthAccessToken(String code);

    public ResponseEntity<GoogleUserDTO> getOauthUserDetails(String accessToken);

    public UserEntity createUser(GoogleUserDTO user);
}
