import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { Button } from "./components/ui/button";
import { Plus } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger className="mr-1" />
          <h1 className="text-sm font-medium text-foreground text-balance">
            Inbox
          </h1>
          <div className="ml-auto">
            <Button size="sm" className="gap-2">
              <Plus className="size-4" aria-hidden />
              New Chat
            </Button>
          </div>
        </header>

        <main className="p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
