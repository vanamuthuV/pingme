import { useContext } from "react";
import { ChatContext } from "../context/chat-context";

const useChat = () => {
  const context = useContext(ChatContext);
  if (context == null)
    throw new Error("ensure useChat is used inside ChatProvider");
  return context;
};

export { useChat };
