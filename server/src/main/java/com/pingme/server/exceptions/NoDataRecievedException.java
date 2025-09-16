package com.pingme.server.exceptions;

public class NoDataRecievedException extends RuntimeException {
    public NoDataRecievedException(String message) {
        super(message);
    }
}
