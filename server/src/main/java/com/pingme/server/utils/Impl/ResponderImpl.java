package com.pingme.server.utils.Impl;

import com.pingme.server.types.Data;
import com.pingme.server.types.ResponderType;
import com.pingme.server.utils.Responder;
import org.springframework.stereotype.Component;

@Component
public class ResponderImpl implements Responder {

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
