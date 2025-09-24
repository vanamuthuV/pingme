package com.pingme.server.exceptions;

import org.springframework.security.core.AuthenticationException;

public class JwtUnauthorizedException extends AuthenticationException {
    public JwtUnauthorizedException(String message) {
        super(message);
    }
}
