"use client";

import * as React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Send } from "lucide-react";

export function ChatInput() {
  const [message, setMessage] = React.useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // For demo purposes, we just clear the input.
    // Hook this up to your send handler as needed.
    setMessage("");
  }

  return (
    <footer className="border-t border-border bg-background pt-2">
      <form
        onSubmit={onSubmit}
        className="mx-auto flex w-4/6  items-center gap-2 px-4 py-3 md:px-6"
      >
        <label htmlFor="message" className="sr-only">
          Message
        </label>
        <Input
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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
