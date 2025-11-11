import { useContext } from "react";
import { ChatDataContext } from "../context/chat-data-context";
import type { ChatDataContextType } from "../types/context-data-context";

const useData = () : ChatDataContextType => {
  const context = useContext(ChatDataContext);

  if (context) {
    throw new Error("useData is not under ChatDataProvider survillance");
  }

  return context!;
};

export { useData };
