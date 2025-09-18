package com.pingme.server.service.Impl;

import com.pingme.server.domain.dto.GoogleAccessTokenDTO;
import com.pingme.server.domain.dto.GoogleUserDTO;
import com.pingme.server.domain.entity.UserEntity;
import com.pingme.server.mappers.Impl.UserMapperImpl;
import com.pingme.server.repository.AuthRepository;
import com.pingme.server.service.OauthService;
import com.pingme.server.types.ResponderType;
import com.pingme.server.types.Status;
import com.pingme.server.utils.Impl.JwtUtilsImpl;
import com.pingme.server.utils.Impl.ResponderImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

@Service
public class OauthServiceImpl implements OauthService {

    @Value("${google.oauth2.client-id}")
    private String clientId;

    @Value("${google.oauth2.client-secret}")
    private String clientSecret;

    @Value("${google.oauth2.redirect_uri}")
    private String redirectUri;

    @Autowired
    private AuthRepository authRepository;

    @Autowired
    private JwtUtilsImpl jwtUtils;

    @Autowired
    private UserMapperImpl userMapper;

    @Autowired
    private ResponderImpl responder;

    @Override
    public ResponderType authenticate(String code) {

        try{
            GoogleAccessTokenDTO accessObject = getOauthAccessToken(code);

            ResponseEntity<GoogleUserDTO> userResponse =
                    getOauthUserDetails(accessObject.getAccess_token());

            GoogleUserDTO user = userResponse.getBody();

            Optional<UserEntity> isuser = authRepository.findByEmail(user.getEmail());

            if(!isuser.isEmpty()) {
                System.out.println("Already there");
                String token = jwtUtils.generateToken(userMapper.mapFrom(isuser.get()));
                isuser.get().setAccess_token(token);
                UserEntity savedUser = authRepository.save(isuser.get());
                return responder.createResponse(true, token, "login success", userMapper.mapFrom(savedUser));
            }

            UserEntity savedUser = createUser(user);
            String token = jwtUtils.generateToken(userMapper.mapFrom(savedUser));
            System.out.println("The token " + token);
            savedUser.setAccess_token(token);
            savedUser = authRepository.save(savedUser);

            return responder.createResponse(
                    true,
                    token,
                    "user created and logged in",
                    userMapper.mapFrom(savedUser)
            );
        } catch (Exception e) {
            System.out.println(e);
            return null;
        }

    }

    @Override
    public GoogleAccessTokenDTO getOauthAccessToken(String code) {

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders httpHeaders = new HttpHeaders();

        httpHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("code", code);
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret);
        params.add("redirect_uri", redirectUri);
        params.add("grant_type", "authorization_code");
        params.add("scope", "https://www.googleapis.com/auth/userinfo.profile");
        params.add("scope", "https://www.googleapis.com/auth/userinfo.email");

        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(params, httpHeaders);
        String url = "https://oauth2.googleapis.com/token";

        GoogleAccessTokenDTO response = restTemplate.postForObject(url, requestEntity, GoogleAccessTokenDTO.class);

        return response;

    }

    @Override
    public ResponseEntity<GoogleUserDTO> getOauthUserDetails(String accessToken) {
        System.out.println("The accessToken " + accessToken);
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setBearerAuth(accessToken);

        HttpEntity<String> requestEntity = new HttpEntity<>(httpHeaders);

        String url = "https://www.googleapis.com/oauth2/v2/userinfo";
        ResponseEntity<GoogleUserDTO> response = restTemplate.exchange(url, HttpMethod.GET, requestEntity, GoogleUserDTO.class);

        return response;

    }

    @Override
    public UserEntity createUser(GoogleUserDTO googleuser) {
         UserEntity user = UserEntity.
                 builder().
                 email(googleuser.getEmail()).
                 username(googleuser.getName().toLowerCase() + System.currentTimeMillis()).
                 firstname(googleuser.getGiven_name()).
                 lastname(googleuser.getFamily_name()).
                 profile_picture(googleuser.getPicture()).
                 status(Status.ONLINE).
                 build();

         UserEntity savedUser = authRepository.save(user);

        return savedUser;

    }

}
