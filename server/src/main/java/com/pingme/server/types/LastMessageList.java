package com.pingme.server.types;

import java.util.List;

public class LastMessageList implements Data{

    private List<LastMessageProjection> lastMessage;

    public LastMessageList(List<LastMessageProjection> lastMessage) {
        this.lastMessage = lastMessage;
    }

    public LastMessageProjection[] getLastMessages() {
        return lastMessage.toArray(new LastMessageProjection[0]);
    }
}
