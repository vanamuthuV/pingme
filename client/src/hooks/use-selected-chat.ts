import { useContext } from "react";
import { SelectedChatContext } from "../context/selected-chat-context";

const useSelectedChat = () => {
  const ctx = useContext(SelectedChatContext);
  if (!ctx)
    throw new Error("useSelectedChat hook is used outside the provider");
  return ctx;
};

export { useSelectedChat };
