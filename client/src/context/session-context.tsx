import { createContext, useState } from "react";
import { type Session } from "../types/session";
import type { User } from "../types/user";
import type { SessionContextType } from "../types/session-context";

export const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  const login = (userData: User) => setSession({ user: userData });
  const logout = () => setSession(null);

  return (
    <SessionContext.Provider value={{ session, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
}
