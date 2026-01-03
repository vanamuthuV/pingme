import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarRail,
} from "./ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useTheme } from "../context/theme-context";
import {
  MessagesSquare,
  ChevronUp,
  Sun,
  Moon,
  Monitor,
  Loader,
} from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import type { User as UserType } from "../types/user";
import { useAuth } from "../hooks/use-auth";
import { useChat } from "../hooks/use-chat";
import type { Chat } from "../types/chat";
import { useSelectedChat } from "../hooks/use-selected-chat";
import { CreateChat } from "./create-chat";

type AppSidebarProps = {
  className?: string;
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
};

export function AppSidebar({
  className
}: AppSidebarProps) {
  const { setTheme } = useTheme();
  const { session } = useAuth();
  const { chat, setChat } = useChat();
  const { selectedChat, setSelectedChat } = useSelectedChat();
  const [loading, setLoading] = useState<boolean>(true);
  const [messageLoading, setMessageLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/get-senders");
        if (response?.data?.status) {
          let chats: Chat[] = [];
          response?.data?.data?.users.map((user: UserType) =>
            chats.push({ user, lastmessage: "" })
          );
          setChat(chats);
        }

        const senders = response.data?.data?.users.map(
          (user: UserType) => user.id
        );

        const messagesResponse = await axios.post("/get-last-message", {
          senders,
        });

        const sendersLastMessages =
          messagesResponse?.data?.data?.lastMessages.map((element: any) => {
            if (element.senderId === session?.user.id) {
              return {
                message: element.message,
                senderId: element.recieverId, // other person in convo
              };
            } else {
              return {
                message: element.message,
                senderId: element.senderId,
              };
            }
          });

        // console.log(sendersLastMessages);

        if (messagesResponse?.data?.status) {
          setChat((prev) =>
            prev.map((prevChat) => {
              const foundMsg = sendersLastMessages.find(
                (message: any) =>
                  message.senderId.trim() === prevChat.user.id.trim()
              );

              return foundMsg
                ? { ...prevChat, lastmessage: foundMsg.message }
                : prevChat;
            })
          );
        }

        setMessageLoading(false);
      } catch (error) {
        setChat([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSelectedChat = (userId: string, user: UserType) => {
    setSelectedChat((prev) => {
      return {
        selectedchat: userId,
        chat: {
          ...prev.chat,
          user: user,
        },
      };
    });
  };

  return (
    <Sidebar className={className}>
      <SidebarHeader className="border-b flex">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-2 py-2">
            <MessagesSquare
              className="size-4 text-muted-foreground"
              aria-hidden
            />
            <span className="font-medium text-sm text-foreground">Chats</span>
          </div>
          {/* <Button className="h-6 rounded-sm border-0">
            <Plus className="size-3" aria-hidden />
            <span className="text-[10px]">New</span>
          </Button> */}
          <CreateChat />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Recent
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu className="gap-2">
              {loading ? (
                <Loader className="animate-spin" />
              ) : (
                chat.map((indchat) => (
                  <SidebarMenuItem
                    onClick={() =>
                      handleSelectedChat(indchat.user.id, indchat.user)
                    }
                    key={indchat.user.id}
                  >
                    <SidebarMenuButton
                      size="lg"
                      className={`gap-3 rounded-lg data-[state=open]:bg-accent/50 hover:bg-accent ${
                        selectedChat?.selectedchat === indchat.user.id &&
                        "bg-accent"
                      }`}
                      tooltip={indchat.user.username}
                    >
                      <div className="relative">
                        <Avatar className="size-8">
                          <AvatarImage
                            src={
                              indchat.user.profile_picture ||
                              "/placeholder.svg?height=40&width=40&query=chat-avatar"
                            }
                            alt={`${indchat.user.username} avatar`}
                          />
                          <AvatarFallback className="text-xs">
                            {indchat.user.firstname.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {indchat.user.status === "ONLINE" ? (
                          <span
                            aria-hidden
                            className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-background bg-emerald-500"
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-semibold text-xs text-foreground">
                          {indchat.user.firstname}
                        </div>
                        {messageLoading ? (
                          <Skeleton className="h-3 mt-1" />
                        ) : (
                          <div className="truncate text-[9px] text-muted-foreground">
                            {indchat.lastmessage}
                          </div>
                        )}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between h-auto p-2 hover:bg-accent"
            >
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarImage
                    src={session?.user.profile_picture}
                    alt="Your profile"
                  />
                  <AvatarFallback className="text-xs">
                    {session?.user?.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 text-left">
                  <div className="truncate text-sm font-semibold text-foreground">
                    {session?.user.firstname}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    Online
                  </div>
                </div>
              </div>
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            alignOffset={-8}
            className="w-56"
            side="top"
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {session?.user.username}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  Online
                </p>
              </div>
            </DropdownMenuLabel>
           
            <DropdownMenuItem
              onClick={() => setTheme("light")}
              className="cursor-pointer gap-2"
            >
              <Sun className="h-4 w-4" />
              <span>Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("dark")}
              className="cursor-pointer gap-2"
            >
              <Moon className="h-4 w-4" />
              <span>Dark</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("system")}
              className="cursor-pointer gap-2"
            >
              <Monitor className="h-4 w-4" />
              <span>System</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

export default AppSidebar;
