import type { Message } from "./message";
import type { User } from "./user";

type Chat = {
  user: User;
  chats: Message[];
};

export { type Chat };
