import React, { createContext, useState } from "react";
import type { Chat } from "../types/chat";
import type { ChatContextType } from "../types/chat-context";

const ChatContext = createContext<ChatContextType | null>(null);

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [chat, setChat] = useState<Chat[]>([]);

  return (
    <ChatContext.Provider value={{ chat, setChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export { ChatProvider, ChatContext };
