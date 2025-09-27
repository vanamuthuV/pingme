import type { Chat } from "./chat";

type ChatContextType = {
  chat: Chat[];
  setChat: React.Dispatch<React.SetStateAction<Chat[]>>;
};

export { type ChatContextType };
