import * as React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { WebSocketConfig } from "../config/websocket-config";
import { useSelectedChat } from "../hooks/use-selected-chat";
import { useData } from "../hooks/use-data";
import { Uuid } from "../utils/uuid-generator";
import { useAuth } from "../hooks/use-auth";

export function ChatInput() {
  const ref = React.useRef<HTMLInputElement>(null);
  const { selectedChat } = useSelectedChat();
  const ws = new WebSocketConfig();

  const uuid = new Uuid();

  const { setChatHistory } = useData();
  const { session } = useAuth();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      ref.current &&
      ref.current.value !== null &&
      ref.current.value.trim() != ""
    ) {
      const id: string = uuid.GenerateUuid();
      const time = new Date().toISOString();

      const tempMessage = {
        uuid: id,
        id: "",
        message: ref.current.value,
        sender: session?.user.id,
        receiver: selectedChat.chat.user?.id,
        createdAt: time,
        updatedAt: time,
        seen: false,
        delivered: true,
        edited: false,
      };

      setChatHistory((prev: any) => {
        return [...prev, tempMessage];
      });

      ws.sendMessage(
        JSON.stringify({
          uuid: id,
          recieverId: selectedChat.selectedchat,
          message: ref.current.value,
          time: time,
        })
      );
      ref.current.value = "";
    } else {
      toast("Empty message cannot be sent");
    }
  }

  return (
    <footer className="border-t border-border bg-background flex-shrink-0">
      <form
        onSubmit={onSubmit}
        className="mx-auto flex w-full max-w-4xl items-center gap-2 px-4 py-3"
      >
        <label htmlFor="message" className="sr-only">
          Message
        </label>
        <Input
          id="message"
          ref={ref}
          placeholder="Type a message..."
          className="flex-1"
          autoComplete="off"
        />
        <Button type="submit" aria-label="Send message">
          <Send className="mr-1 h-4 w-4" />
          <span className="hidden sm:inline">Send</span>
        </Button>
      </form>
    </footer>
  );
}
