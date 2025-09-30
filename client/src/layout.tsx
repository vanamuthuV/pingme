import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { Button } from "./components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./components/ui/avatar";
import { useSelectedChat } from "./hooks/use-selected-chat";
import { X } from "lucide-react";

export default function Layout({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { selectedChat, setSelectedChat } = useSelectedChat();
  console.log(selectedChat);

  const handleCloseChat = () => {
    setSelectedChat((prev) => {
      return {
        ...prev,
        selectedchat: "",
      };
    });
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex py-2.5 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger className="mr-1" />
          {selectedChat.selectedchat && (
            <div className="flex items-center gap-3">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={selectedChat?.chat?.user?.profile_picture}
                  alt="User profile photo"
                />
                <AvatarFallback aria-hidden>
                  {selectedChat?.chat?.user?.firstname}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-xs font-medium leading-none">
                  {selectedChat?.chat?.user?.firstname}
                </span>
                <span className="text-[9px] pt-1 text-muted-foreground leading-none">
                  {selectedChat?.chat?.user?.status.toLocaleLowerCase()}
                </span>
              </div>
            </div>
          )}

          <div className="ml-auto">
            {selectedChat.selectedchat ? (
              <Button
                onClick={handleCloseChat}
                variant="ghost"
                size="icon"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            ) : (
              <div className="flex justify-end">
                <div className="relative ml-auto bg-sidebar px-4 py-1 rounded-xs shadow-2xl overflow-hidden group hover:scale-105 transition-transform duration-300">
                  {/* Shimmer effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>

                  {/* Subtle glow animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-blue-400/10 opacity-0 animate-pulse-glow"></div>

                  {/* Floating sparkles */}
                  <div className="absolute top-0 right-1 w-1 h-1 bg-white/60 rounded-full animate-sparkle-1"></div>
                  <div className="absolute bottom-0 left-1 w-0.5 h-0.5 bg-white/40 rounded-full animate-sparkle-2"></div>
                  <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-white/50 rounded-full animate-sparkle-3"></div>

                  <span className="relative text-muted-foreground text-xs font-medium">
                    Ping Me
                  </span>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className={`py-1 px-10  ${className} `}>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
