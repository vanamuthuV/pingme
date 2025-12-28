import {
  Plus,
  Loader2,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import axios from "../api/axios";
import { useSelectedChat } from "../hooks/use-selected-chat";
import { Alert, AlertDescription } from "./ui/alert";
import type { User } from "../types/user";

const capitalize = (str: string) => str?.charAt(0).toUpperCase() + str.slice(1);

type SearchState = "idle" | "searching" | "found" | "error";

export function CreateChat() {
  const [email, setEmail] = useState("");
  const [searchState, setSearchState] = useState<SearchState>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const { setSelectedChat } = useSelectedChat();

  const handleSearchUser = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setMessage("Please enter a valid email address");
      setSearchState("error");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setMessage("Please enter a valid email format");
      setSearchState("error");
      return;
    }

    setSearchState("searching");
    setMessage(null);
    setFoundUser(null);

    try {
      const response = await axios.get(`/user/${trimmedEmail}`);

      if (response.data.status && response.data.data) {
        setFoundUser(response.data.data);
        setSearchState("found");
        setMessage("User found! You can now start a chat.");
      } else {
        setSearchState("error");
        setMessage(response.data.message || "User not found in records");
      }
    } catch (err: any) {
      setSearchState("error");
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again.";
      setMessage(errorMessage);
      console.error("Error searching user:", err);
    }
  };

  const handleStartChat = () => {
    if (foundUser && foundUser.id) {
      setSelectedChat((prev) => {
        return {
          selectedchat: foundUser.id,
          chat: {
            ...prev.chat,
            user: foundUser,
          },
        };
      });
      // Close dialog and reset state
      setOpen(false);
      resetDialog();
    }
  };

  const resetDialog = () => {
    setEmail("");
    setSearchState("idle");
    setMessage(null);
    setFoundUser(null);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetDialog();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="h-8 rounded-md border-0 text-xs sm:h-9 sm:text-sm">
          <Plus className="size-3 sm:size-4" aria-hidden="true" />
          <span>New Chat</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold sm:text-lg">
            Create New Chat
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground sm:text-sm">
            Enter the recipient&apos;s email to find and connect with them
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchState !== "searching") {
                  handleSearchUser();
                }
              }}
              disabled={searchState === "searching"}
              className="text-sm"
            />
          </div>

          {/* Status Messages */}
          {message && (
            <Alert
              variant={searchState === "error" ? "destructive" : "default"}
              className="py-3"
            >
              {searchState === "error" && <AlertCircle className="size-4" />}
              {searchState === "found" && (
                <CheckCircle2 className="size-4 text-green-600" />
              )}
              <AlertDescription className="text-xs sm:text-sm">
                {capitalize(message)}
              </AlertDescription>
            </Alert>
          )}

          {/* Found User Card */}
          {foundUser && searchState === "found" && (
            <div className="flex items-center gap-3 rounded-lg border bg-muted/50 p-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary sm:size-12">
                <MessageCircle className="size-5 sm:size-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate sm:text-base">
                  {foundUser.firstname || foundUser.email}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {foundUser.email}
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row sm:gap-0">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="w-full text-xs sm:w-auto sm:text-sm bg-transparent"
              type="button"
            >
              Cancel
            </Button>
          </DialogClose>

          {searchState === "found" && foundUser ? (
            <Button
              onClick={handleStartChat}
              className="w-full gap-2 text-xs sm:w-auto sm:text-sm"
              type="button"
            >
              <MessageCircle className="size-4" />
              Start Chat
            </Button>
          ) : (
            <Button
              onClick={handleSearchUser}
              disabled={searchState === "searching" || !email.trim()}
              className="w-full gap-2 text-xs sm:w-auto sm:text-sm"
              type="button"
            >
              {searchState === "searching" ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Searching...
                </>
              ) : (
                "Connect"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
