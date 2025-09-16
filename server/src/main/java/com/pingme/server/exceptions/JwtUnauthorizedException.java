package com.pingme.server.exceptions;

public class JwtUnauthorizedException extends RuntimeException {
    public JwtUnauthorizedException(String message) {
        super(message);
    }
}
