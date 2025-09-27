import type { Message } from "./message";

type Status = {
  status: string;
  user_id: string;
};

type SocketPayload =
  | { type: "status"; payload: Status }
  | { type: "message"; payload: Message };

export { type SocketPayload };
