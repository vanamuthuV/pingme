package com.pingme.server.exceptions;

public class ContextPrincipalEmptyException extends RuntimeException {
    public ContextPrincipalEmptyException(String message) {
        super(message);
    }
}
