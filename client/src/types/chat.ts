import type { Message } from "./message";
import type { User } from "./user";

type Chat = {
  user: User;
  lastmessage: string;
};

type NullableChat = {
  user: User | null;
  chats: Message[] | [];
};

export { type Chat, type NullableChat };
