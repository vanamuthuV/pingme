import type { RawMessage } from "./message";
import type { User } from "./user";

type Chat = {
  user: User;
  lastmessage: string;
};

type NullableChat = {
  user: User | null;
  chats: RawMessage[] | [];
};

export { type Chat, type NullableChat };
