package com.pingme.server.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.pingme.server.domain.dto.MessageOnlyResponseDTO;
import com.pingme.server.domain.dto.MessageResponseDTO;
import com.pingme.server.domain.dto.UserResponseDTO;
import com.pingme.server.domain.entity.MessageEntity;
import com.pingme.server.exceptions.ContextPrincipalEmptyException;
import com.pingme.server.exceptions.DataNotFoundException;
import com.pingme.server.mappers.Impl.MessageMapperImpl;
import com.pingme.server.service.Impl.MessageServiceImpl;
import com.pingme.server.service.MessageService;
import com.pingme.server.sockets.utils.SocketClientHandler;
import com.pingme.server.types.*;
import com.pingme.server.utils.Impl.ResponderImpl;
import com.pingme.server.utils.Impl.StatusSubscribersImpl;
import com.pingme.server.utils.Responder;
import com.pingme.server.utils.StatusSubscribers;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.net.Socket;
import java.util.HashMap;
import java.util.List;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@RestController
public class MessageController {

    private final MessageService messageService;
    private final Responder responder;
    private final StatusSubscribers statusSubscribers;
    private final SocketClientHandler socketClientHandler;
    private final MessageMapperImpl messageMapper;

    public MessageController(
            MessageService messageService,
            ResponderImpl responder,
            StatusSubscribers statusSubscribers,
            SocketClientHandler socketClientHandler,
            MessageMapperImpl messageMapper
    ){
        this.messageService = messageService;
        this.responder = responder;
        this.statusSubscribers = statusSubscribers;
        this.socketClientHandler = socketClientHandler;
        this.messageMapper = messageMapper;
    }

    @GetMapping("/get-senders")
    public ResponseEntity<ResponderType> getDistinctSendersByReceiverId() throws ExecutionException, InterruptedException, JsonProcessingException {

        UserResponseDTO user = (UserResponseDTO) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if(user == null) {
            System.out.println("cannot find data in principal " + this.getClass());
            throw new ContextPrincipalEmptyException("can not get user session");
        }

        CompletableFuture<List<UserResponseDTO>> senderPromise = messageService.getDistinctSendersByReceiverId(user.getId());
        List<UserResponseDTO> senders = senderPromise.get();

        if(statusSubscribers.getSubscribers(RedisEnums.CHAT_SUBS.name() + user.getId().trim()).isEmpty())
            for(UserResponseDTO usr : senders)
                statusSubscribers.addSubscriber(RedisEnums.CHAT_SUBS.name() + user.getId().trim(), usr.getId().trim());

        Set<String> clients = socketClientHandler.getConnectedClients(SocketType.CHAT);

        for(UserResponseDTO usr : senders)
            if(clients.contains(usr.getId().trim()))
                usr.setStatus("ONLINE");
            else usr.setStatus("OFFLINE");

        UserResponseDTOList users = new UserResponseDTOList(senders);

        return ResponseEntity.ok(
                responder.createResponse(true, "senders fetch success", users)
        );
    }

    @PostMapping("/get-last-message")
    public ResponseEntity<ResponderType> getLastMessages(@RequestBody LastMessageRequest body) throws ExecutionException, InterruptedException {

        UserResponseDTO user = (UserResponseDTO) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        List<String> senders = body.getSenders();

        List<LastMessageProjection> lastMessages = messageService.getLastMessages(user.getId(), senders).get();

        return ResponseEntity.ok(
                responder.createResponse(true, "last message fetch success", new LastMessageList(lastMessages))
        );
    }

    @GetMapping("/get-message")
    public ResponseEntity<Page<MessageOnlyResponseDTO>> getMessage(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam String sender
    ) throws ExecutionException, InterruptedException {

        UserResponseDTO currentUser = (UserResponseDTO) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Page<MessageOnlyResponseDTO> messages = messageService.getMessagesBetweenUser(page, size, currentUser.getId(), sender).get();

        return ResponseEntity.ok(messages);
    }

    @DeleteMapping("/message/{id}")
    public ResponseEntity<ResponderType> deleteMessage(@PathVariable String id) throws ExecutionException, InterruptedException {

        if(id.isEmpty())
            throw new DataNotFoundException("message id is empty");

        Boolean isDeleted = messageService.deleteMessage(id).get();

        return ResponseEntity.ok(responder.createResponse(isDeleted, isDeleted ? "deletion success" : "deletion failed", null));
    }

}
