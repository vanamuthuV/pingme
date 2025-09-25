package com.pingme.server.controller;

import com.pingme.server.domain.dto.UserResponseDTO;
import com.pingme.server.exceptions.ContextPrincipalEmptyException;
import com.pingme.server.service.Impl.MessageServiceImpl;
import com.pingme.server.service.MessageService;
import com.pingme.server.types.ResponderType;
import com.pingme.server.types.UserResponseDTOList;
import com.pingme.server.utils.Impl.ResponderImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@RestController
public class MessageController {

    private final MessageService messageService;
    private final ResponderImpl responder;

    public MessageController(MessageService messageService, ResponderImpl responder){
        this.messageService = messageService;
        this.responder = responder;
    }

    @GetMapping("/get-senders")
    public ResponseEntity<ResponderType> getDistinctSendersByReceiverId() throws ExecutionException, InterruptedException {

        UserResponseDTO user = (UserResponseDTO) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if(user == null) {
            System.out.println("cannot find data in principal " + this.getClass());
            throw new ContextPrincipalEmptyException("can not get user session");
        }

        CompletableFuture<List<UserResponseDTO>> senderPromise = messageService.getDistinctSendersByReceiverId(user.getId());
        List<UserResponseDTO> senders = senderPromise.get();

        UserResponseDTOList users = new UserResponseDTOList(senders);

        return ResponseEntity.ok(
                responder.createResponse(true, "senders fetch success", users)
        );

    }

}
