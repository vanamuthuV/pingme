import { createContext, useState } from "react";
import type { RawMessage } from "../types/message";
import type { ChatDataContextType } from "../types/context-data-context";

const ChatDataContext = createContext<ChatDataContextType | null>(null);

const ChatDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [chatHistory, setChatHistory] = useState<RawMessage[] | undefined>([]);

  return (
    <ChatDataContext.Provider value={{ chatHistory, setChatHistory }}>
      {children}
    </ChatDataContext.Provider>
  );
};

export { ChatDataContext, ChatDataProvider };
