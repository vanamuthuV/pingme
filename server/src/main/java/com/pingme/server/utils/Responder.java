package com.pingme.server.utils;

import com.pingme.server.types.Data;
import com.pingme.server.types.ResponderType;

public interface Responder {

    public ResponderType createResponse(boolean status, String message, Data data);
    public ResponderType createResponse(boolean status, String token, String message, Data data);

}
