import type { NullableChat } from "./chat";
import type { SelectedChatType } from "./selected-chat";

type SelectedChatContextType = {
  selectedChat: SelectedChatType;
  setSelectedChat: React.Dispatch<
    React.SetStateAction<
      | SelectedChatType
      | {
          selectedchat: string;
          chat: NullableChat;
        }
    >
  >;
};

export { type SelectedChatContextType };
