import React, { createContext, useState } from "react";
import { type SelectedChatType } from "../types/selected-chat";
import { type SelectedChatContextType } from "../types/selected-chat-context";
import type { NullableChat } from "../types/chat";

const SelectedChatContext = createContext<SelectedChatContextType | null>(null);

const SelectedChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedChat, setSelectedChat] = useState<
    SelectedChatType | { selectedchat: string; chat: NullableChat }
  >({ selectedchat: "", chat: { chats: [], user: null } });

  return (
    <SelectedChatContext.Provider value={{ selectedChat, setSelectedChat }}>
      {children}
    </SelectedChatContext.Provider>
  );
};

export { SelectedChatProvider, SelectedChatContext };
