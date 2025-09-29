import { useEffect } from "react";
import { useSelectedChat } from "../hooks/use-selected-chat";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import axios from "../api/axios";

export function ChatPanel() {
  const { selectedChat, setSelectedChat } = useSelectedChat();

  useEffect(() => {
    (async () => {
      const response = await axios.get(
        `/get-message?sender=${selectedChat.selectedchat}&page=0&size=20`
      );

      console.log(response?.data);
    })();
  }, []);

  const handleCloseChat = () => {
    setSelectedChat((prev) => {
      return {
        ...prev,
        selectedchat: "",
      };
    });
  };

  return (
    <section className="flex-1 h-full bg-background">
      <header className="flex h-14 items-center justify-between bg-background border-b border-border">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={selectedChat?.chat?.user?.profile_picture}
              alt="User profile photo"
            />
            <AvatarFallback aria-hidden>
              {selectedChat?.chat?.user?.firstname}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium leading-none">
              {selectedChat?.chat?.user?.firstname}
            </span>
            <span className="text-xs pt-1 text-muted-foreground leading-none">
              {selectedChat?.chat?.user?.status.toLocaleLowerCase()}
            </span>
          </div>
        </div>

        <Button
          onClick={handleCloseChat}
          variant="ghost"
          size="icon"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Button>
      </header>
    </section>
  );
}
