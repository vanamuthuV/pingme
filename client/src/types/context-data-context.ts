import type { RawMessage } from "./message";

type ChatDataContextType = {
  chatHistory: RawMessage[] | undefined;
  setChatHistory: React.Dispatch<
    React.SetStateAction<RawMessage[] | undefined>
  >;
};

export { type ChatDataContextType };
