package com.pingme.server.controller;

import com.pingme.server.service.Impl.OauthServiceImpl;
import com.pingme.server.types.ResponderType;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {

    private final OauthServiceImpl oauthService;

    public AuthController(OauthServiceImpl oauthService) { this.oauthService = oauthService; }

    @GetMapping("/oauth/callback")
    public ResponseEntity<ResponderType> getAuthorizationCode(
            @RequestParam("code") String code,
            HttpServletResponse response
    ) {
        ResponderType result = oauthService.authenticate(code);

        // Setting up the response header for the client application
        Cookie cookie = new Cookie("token", result.getToken());
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 24);

        response.addCookie(cookie);

        return ResponseEntity.ok(result);
    }

}
