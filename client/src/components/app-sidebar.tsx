// "use client";
// import {
//   Sidebar,
//   SidebarHeader,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupLabel,
//   SidebarGroupContent,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarMenuButton,
//   SidebarFooter,
//   SidebarRail,
// } from "./ui/sidebar";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuSub,
//   DropdownMenuSubContent,
//   DropdownMenuSubTrigger,
//   DropdownMenuTrigger,
// } from "./ui/dropdown-menu";
// import { Button } from "./ui/button";
// import { ThemeToggle } from "./theme-toggle";
// import {
//   MessagesSquare,
//   ChevronUp,
//   Settings,
//   User,
//   Palette,
// } from "lucide-react";

// export type Chat = {
//   id: string | number;
//   name: string;
//   avatarUrl: string;
//   lastMessage?: string;
//   isOnline?: boolean;
// };

// export type CurrentUser = {
//   name: string;
//   avatarUrl: string;
//   status?: string;
// };

// const DEFAULT_CHATS: Chat[] = [
//   {
//     id: "1",
//     name: "Sarah Connor",
//     avatarUrl: "https://i.pravatar.cc/64?img=47",
//     lastMessage: "See you at 2pm!",
//     isOnline: true,
//   },
//   {
//     id: "2",
//     name: "Tony Stark",
//     avatarUrl: "https://i.pravatar.cc/64?img=12",
//     lastMessage: "Draft looks great.",
//     isOnline: false,
//   },
//   {
//     id: "3",
//     name: "Bruce Wayne",
//     avatarUrl: "https://i.pravatar.cc/64?img=5",
//     lastMessage: "Let's finalize tonight.",
//     isOnline: true,
//   },
// ];

// const DEFAULT_USER: CurrentUser = {
//   name: "You",
//   avatarUrl: "https://i.pravatar.cc/64?img=1",
//   status: "Available",
// };

// type AppSidebarProps = {
//   chats?: Chat[];
//   currentUser?: CurrentUser;
//   className?: string;
//   onSettingsClick?: () => void;
//   onProfileClick?: () => void;
// };

// export function AppSidebar({
//   chats = DEFAULT_CHATS,
//   currentUser = DEFAULT_USER,
//   className,
//   onSettingsClick,
//   onProfileClick,
// }: AppSidebarProps) {
//   return (
//     <Sidebar className={className}>
//       <SidebarHeader className="border-b">
//         <div className="flex items-center gap-2 px-2 py-2">
//           <MessagesSquare
//             className="size-4 text-muted-foreground"
//             aria-hidden
//           />
//           <span className="font-medium text-sm text-foreground">Chats</span>
//         </div>
//       </SidebarHeader>

//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
//             Recent
//           </SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu className="gap-2">
//               {chats.map((chat) => (
//                 <SidebarMenuItem key={chat.id}>
//                   <SidebarMenuButton
//                     size="lg"
//                     className="gap-3 rounded-lg data-[state=open]:bg-accent/50 hover:bg-accent"
//                     tooltip={chat.name}
//                   >
//                     <div className="relative">
//                       <Avatar className="size-10">
//                         <AvatarImage
//                           src={
//                             chat.avatarUrl ||
//                             "/placeholder.svg?height=40&width=40&query=chat-avatar"
//                           }
//                           alt={`${chat.name} avatar`}
//                         />
//                         <AvatarFallback className="text-xs">
//                           {chat.name.slice(0, 2).toUpperCase()}
//                         </AvatarFallback>
//                       </Avatar>
//                       {chat.isOnline ? (
//                         <span
//                           aria-hidden
//                           className="absolute bottom-0 right-0 size-2 rounded-full border-2 border-background bg-emerald-500"
//                         />
//                       ) : null}
//                     </div>
//                     <div className="min-w-0 flex-1">
//                       <div className="truncate font-semibold text-sm text-foreground">
//                         {chat.name}
//                       </div>
//                       {chat.lastMessage ? (
//                         <div className="truncate text-xs text-muted-foreground">
//                           {chat.lastMessage}
//                         </div>
//                       ) : null}
//                     </div>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>

//       <SidebarFooter className="border-t">
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button
//               variant="ghost"
//               className="w-full justify-between h-auto p-2 hover:bg-accent"
//             >
//               <div className="flex items-center gap-3">
//                 <Avatar className="size-10">
//                   <AvatarImage
//                     src={
//                       currentUser.avatarUrl ||
//                       "/placeholder.svg?height=40&width=40&query=current-user-avatar"
//                     }
//                     alt="Your profile"
//                   />
//                   <AvatarFallback className="text-xs">
//                     {currentUser.name.slice(0, 2).toUpperCase()}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div className="min-w-0 flex-1 text-left">
//                   <div className="truncate text-sm font-semibold text-foreground">
//                     {currentUser.name}
//                   </div>
//                   <div className="truncate text-xs text-muted-foreground">
//                     Online
//                   </div>
//                 </div>
//               </div>
//               <ChevronUp className="h-4 w-4 text-muted-foreground" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent
//             align="end"
//             alignOffset={-8}
//             className="w-56"
//             side="top"
//           >
//             <DropdownMenuLabel className="font-normal">
//               <div className="flex flex-col space-y-1">
//                 <p className="text-sm font-medium leading-none">
//                   {currentUser.name}
//                 </p>
//                 <p className="text-xs leading-none text-muted-foreground">
//                   Online
//                 </p>
//               </div>
//             </DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem
//               onClick={onProfileClick}
//               className="cursor-pointer gap-2"
//             >
//               <User className="h-4 w-4" />
//               <span>Profile</span>
//             </DropdownMenuItem>
//             <DropdownMenuItem
//               onClick={onSettingsClick}
//               className="cursor-pointer gap-2"
//             >
//               <Settings className="h-4 w-4" />
//               <span>Settings</span>
//             </DropdownMenuItem>
//             <DropdownMenuSub>
//               <DropdownMenuSubTrigger className="cursor-pointer gap-2">
//                 <Palette className="h-4 w-4" />
//                 <span>Theme</span>
//               </DropdownMenuSubTrigger>
//               <DropdownMenuSubContent>
//                 <div className="p-1">
//                   <ThemeToggle />
//                 </div>
//               </DropdownMenuSubContent>
//             </DropdownMenuSub>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </SidebarFooter>

//       {/* Rail keeps a slim clickable area and tooltips when collapsed */}
//       <SidebarRail />
//     </Sidebar>
//   );
// }

// export default AppSidebar;

"use client";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useTheme } from "../context/theme-context";
import {
  MessagesSquare,
  ChevronUp,
  Settings,
  User,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";

export type Chat = {
  id: string | number;
  name: string;
  avatarUrl: string;
  lastMessage?: string;
  isOnline?: boolean;
};

export type CurrentUser = {
  name: string;
  avatarUrl: string;
  status?: string;
};

const DEFAULT_CHATS: Chat[] = [
  {
    id: "1",
    name: "Sarah Connor",
    avatarUrl: "https://i.pravatar.cc/64?img=47",
    lastMessage: "See you at 2pm!",
    isOnline: true,
  },
  {
    id: "2",
    name: "Tony Stark",
    avatarUrl: "https://i.pravatar.cc/64?img=12",
    lastMessage: "Draft looks great.",
    isOnline: false,
  },
  {
    id: "3",
    name: "Bruce Wayne",
    avatarUrl: "https://i.pravatar.cc/64?img=5",
    lastMessage: "Let's finalize tonight.",
    isOnline: true,
  },
];

const DEFAULT_USER: CurrentUser = {
  name: "You",
  avatarUrl: "https://i.pravatar.cc/64?img=1",
  status: "Available",
};

type AppSidebarProps = {
  chats?: Chat[];
  currentUser?: CurrentUser;
  className?: string;
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
};

export function AppSidebar({
  chats = DEFAULT_CHATS,
  currentUser = DEFAULT_USER,
  className,
  onSettingsClick,
  onProfileClick,
}: AppSidebarProps) {
  const { setTheme } = useTheme();

  return (
    <Sidebar className={className}>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-2">
          <MessagesSquare
            className="size-4 text-muted-foreground"
            aria-hidden
          />
          <span className="font-medium text-sm text-foreground">Chats</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Recent
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {chats.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton
                    size="lg"
                    className="gap-3 rounded-lg data-[state=open]:bg-accent/50 hover:bg-accent"
                    tooltip={chat.name}
                  >
                    <div className="relative">
                      <Avatar className="size-10">
                        <AvatarImage
                          src={
                            chat.avatarUrl ||
                            "/placeholder.svg?height=40&width=40&query=chat-avatar"
                          }
                          alt={`${chat.name} avatar`}
                        />
                        <AvatarFallback className="text-xs">
                          {chat.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {chat.isOnline ? (
                        <span
                          aria-hidden
                          className="absolute bottom-0 right-0 size-2 rounded-full border-2 border-background bg-emerald-500"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold text-sm text-foreground">
                        {chat.name}
                      </div>
                      {chat.lastMessage ? (
                        <div className="truncate text-xs text-muted-foreground">
                          {chat.lastMessage}
                        </div>
                      ) : null}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
                    src={
                      currentUser.avatarUrl ||
                      "/placeholder.svg?height=40&width=40&query=current-user-avatar"
                    }
                    alt="Your profile"
                  />
                  <AvatarFallback className="text-xs">
                    {currentUser.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 text-left">
                  <div className="truncate text-sm font-semibold text-foreground">
                    {currentUser.name}
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
                  {currentUser.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  Online
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onProfileClick}
              className="cursor-pointer gap-2"
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onSettingsClick}
              className="cursor-pointer gap-2"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
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

      {/* Rail keeps a slim clickable area and tooltips when collapsed */}
      <SidebarRail />
    </Sidebar>
  );
}

export default AppSidebar;