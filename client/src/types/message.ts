import type { User } from "./user";

type Message = {
  id: string;
  message: string;
  createdAt: string;
  delivered: boolean;
  edited: boolean;
  receiver: User;
  seen: boolean;
  sender: User;
  updatedAt: string;
};

type RawMessage = {
  id: string;
  message: string;
  createdAt: string;
  delivered: boolean;
  edited: boolean;
  receiver: string;
  seen: boolean;
  sender: string;
  updatedAt: string;
};

export { type Message, type RawMessage };
