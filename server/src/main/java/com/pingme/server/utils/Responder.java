package com.pingme.server.utils;

import com.pingme.server.types.Data;
import com.pingme.server.types.ResponderType;
import org.springframework.stereotype.Component;

@Component
public class Responder {

    public ResponderType createResponse(boolean status, String token, String message, Data data) {

        return ResponderType.
                builder().
                status(status).
                token(token).
                message(message).
                data(data).
                build();

    }

}
