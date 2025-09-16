package com.pingme.server.exceptions;

import com.pingme.server.types.ResponderType;
import com.pingme.server.utils.Responder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @Autowired
    private Responder responder;

    @ExceptionHandler({UserNotFoundException.class})
    public ResponseEntity<ResponderType> globalHandler(UserNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(responder.createResponse(false, null, ex.getMessage(), null));
    }

}
