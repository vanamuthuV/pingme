import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { Button } from "./components/ui/button";
import { Plus } from "lucide-react";

export default function Layout({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex py-2.5 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger className="mr-1" />
          <h1 className="text-sm font-medium text-foreground text-balance">
            Inbox
          </h1>
          <div className="ml-auto">
            <Button className="h-7">
              <Plus className="size-3" aria-hidden />
              <span className="text-xs">New Chat</span>
            </Button>
          </div>
        </header>

        <main className={`py-1 px-10  ${className} `}>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
