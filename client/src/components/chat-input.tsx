// import * as React from "react";
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { Send } from "lucide-react";
// import { toast } from "sonner";
// import { WebSocketConfig } from "../config/websocket-config";
// import { useSelectedChat } from "../hooks/use-selected-chat";

// export function ChatInput() {
//   const ref = React.useRef<HTMLInputElement>(null);
//   const { selectedChat } = useSelectedChat();
//   const ws = new WebSocketConfig();

//   function onSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();

//     if (
//       ref.current &&
//       ref.current.value !== null &&
//       ref.current.value.trim() != ""
//     ) {
//       ws.sendMessage(
//         JSON.stringify({
//           recieverId: selectedChat.selectedchat,
//           message: ref.current.value,
//         })
//       );
//       ref.current.value = "";
//     } else {
//       toast("Empty message cannot be sent");
//     }
//   }

//   return (
//     <footer className="border-t border-border bg-background flex-shrink-0">
//       <form
//         onSubmit={onSubmit}
//         className="mx-auto flex w-full max-w-4xl items-center gap-2 px-4 py-3"
//       >
//         <label htmlFor="message" className="sr-only">
//           Message
//         </label>
//         <Input
//           id="message"
//           ref={ref}
//           placeholder="Type a message..."
//           className="flex-1"
//           autoComplete="off"
//         />
//         <Button type="submit" aria-label="Send message">
//           <Send className="mr-1 h-4 w-4" />
//           <span className="hidden sm:inline">Send</span>
//         </Button>
//       </form>
//     </footer>
//   );
// }


import * as React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { WebSocketConfig } from "../config/websocket-config";
import { useSelectedChat } from "../hooks/use-selected-chat";

export function ChatInput() {
  const ref = React.useRef<HTMLInputElement>(null);
  const { selectedChat } = useSelectedChat();
  const ws = new WebSocketConfig();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      ref.current &&
      ref.current.value !== null &&
      ref.current.value.trim() != ""
    ) {
      ws.sendMessage(
        JSON.stringify({
          recieverId: selectedChat.selectedchat,
          message: ref.current.value,
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