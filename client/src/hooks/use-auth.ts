import { useContext } from "react";
import { SessionContext } from "../context/session-context";

export function useAuth() {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useAuth should be within the provider");
  return context;
}
