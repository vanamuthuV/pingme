import type { Session } from "./session";
import type { User } from "./user";

export type SessionContextType = {
  session: Session | null;
  login: (user: User) => void;
  logout: () => void;
};
