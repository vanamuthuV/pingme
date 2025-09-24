package com.pingme.server.exceptions;

import com.pingme.server.types.ResponderType;
import com.pingme.server.utils.Impl.ResponderImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @Autowired
    private ResponderImpl responder;

    // User not found → 404
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ResponderType> handleUserNotFound(UserNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(responder.createResponse(false, ex.getMessage(), null));
    }

    // JWT unauthorized → 401
    @ExceptionHandler(JwtUnauthorizedException.class)
    public ResponseEntity<ResponderType> handleJwtUnauthorized(JwtUnauthorizedException ex) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(responder.createResponse(false, ex.getMessage(), null));
    }

    // Input data is null → 400
    @ExceptionHandler(InputDataNullException.class)
    public ResponseEntity<ResponderType> handleInputDataNull(InputDataNullException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(responder.createResponse(false, ex.getMessage(), null));
    }

    // No data received → 400
    @ExceptionHandler(NoDataRecievedException.class)
    public ResponseEntity<ResponderType> handleNoDataReceived(NoDataRecievedException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(responder.createResponse(false, ex.getMessage(), null));
    }
}
