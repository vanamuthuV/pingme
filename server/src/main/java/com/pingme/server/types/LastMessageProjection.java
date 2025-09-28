package com.pingme.server.types;

public interface LastMessageProjection extends Data {
    String getSenderId();
    String getRecieverId();
    String getMessage();
}
