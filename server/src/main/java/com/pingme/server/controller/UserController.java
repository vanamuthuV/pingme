package com.pingme.server.controller;

import com.pingme.server.domain.dto.UserResponseDTO;
import com.pingme.server.service.UserService;
import com.pingme.server.types.ResponderType;
import com.pingme.server.utils.Responder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private Responder responder;

    @GetMapping("/{email}")
    public ResponseEntity<ResponderType> getUser(@PathVariable String email) {
        if(email.isEmpty())
            return ResponseEntity.badRequest().body(responder.createResponse(false, "user not in the records", null));

        UserResponseDTO user = userService.getUser(email);

        return ResponseEntity.ok(responder.createResponse(true, "user record found", user));
    }

}
