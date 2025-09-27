package com.pingme.server.controller;

import com.pingme.server.domain.dto.UserResponseDTO;
import com.pingme.server.service.Impl.OauthServiceImpl;
import com.pingme.server.types.ResponderType;
import com.pingme.server.utils.Impl.ResponderImpl;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class AuthController {

    private final OauthServiceImpl oauthService;
    private final ResponderImpl responder;

    public AuthController(OauthServiceImpl oauthService, ResponderImpl responder) {
        this.oauthService = oauthService; this.responder = responder;
    }

    @GetMapping("/oauth/callback")
    public void getAuthorizationCode(
            @RequestParam("code") String code,
            HttpServletResponse response
    ) throws IOException {
        ResponderType result = oauthService.authenticate(code);

        // Setting up the response header for the client application
        Cookie cookie = new Cookie("token", result.getToken());
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 24);

        response.addCookie(cookie);
        response.sendRedirect("http://localhost:5173/");

    }

    @GetMapping("/verify")
    public ResponseEntity<ResponderType> verifyRequest() {
        UserResponseDTO user = (UserResponseDTO) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(
                responder.createResponse(true, "session fetched", user)
        );
    }

}
