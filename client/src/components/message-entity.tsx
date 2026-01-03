import {
  Copy,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import type React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { useState } from "react";
import axios from "../api/axios";
import { toast } from "sonner";

export const copyToClipboard = async (text: string) => {
  try {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      return true;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);

    return true;
  } catch (err) {
    console.error("Copy failed:", err);
    return false;
  }
};

const MessageEntity = ({
  id,
  message,
  createdAt,
  // updatedAt,
  delivered,
  // seen,
  edited,
  isMine,
  profile,
}: {
  id: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  delivered: boolean;
  seen: boolean;
  edited: boolean;
  isMine: boolean;
  profile: string;
}): React.ReactNode => {

  const [hover, setHover] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [deleted, setDeleted] = useState(edited);
  // console.log("Edited " + edited + " " + id + " " + deleted);

  const deleteMessage = async () => {
    const { data } = await axios.delete(`/message/${id}`);

    if (data.status) setDeleted(true);

    toast(data?.message);
  };

  return (
    <div
      className={`flex flex-col w-full ${
        isMine ? "items-end" : "items-start"
      } max-w-[95%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[65%]`}
    >
      <div
        className={`flex gap-2 w-full items-center justify-center ${
          isMine ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div className="flex-shrink-0 self-start mt-6">
          <img
            src={profile}
            alt="Profile"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-border shadow-sm"
          />
        </div>

        <div
          className={`flex flex-col ${
            isMine ? "items-end" : "items-start"
          } flex-1 min-w-0`}
        >
          <div
            className={`group relative w-auto px-1 sm:px-2 py-0.5 shadow-sm transition-all duration-200 hover:shadow-md ${
              isMine
                ? "bg-primary text-primary-foreground text-right rounded-tr-sm rounded hover:bg-primary/90"
                : "bg-secondary text-secondary-foreground rounded text-left hover:bg-secondary/80 border border-border"
            }
              ${
                deleted &&
                "bg-muted/40 text-muted-foreground italic opacity-80 line-through cursor-not-allowed decoration-muted-foreground/40 border-l-4 border-muted pl-3"
              }    
            `}
          >
            <div
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => {
                if (!dropdownOpen) {
                  setHover(false);
                }
              }}
              className="relative w-auto z-10 break-words text-xs sm:text-sm leading-relaxed flex items-center gap-2 justify-center"
            >
              <span>{deleted ? "message deleted" : message}</span>

              {!deleted &&
                (hover || dropdownOpen ? (
                  <div className="flex flex-1 w-full justify-end">
                    <DropdownMenu
                      open={dropdownOpen}
                      onOpenChange={(open) => {
                        setDropdownOpen(open);
                        if (!open) {
                          setHover(false);
                        }
                      }}
                    >
                      <DropdownMenuTrigger asChild>
                        <button className="focus:outline-none">
                          <MoreHorizontal className="h-2 w-2 sm:h-3 sm:w-3 cursor-pointer" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-40 sm:w-48"
                        side="top"
                      >
                        <DropdownMenuItem
                          onClick={async () => {
                            const success = await copyToClipboard(message);
                            if (success) toast("Copied to clipboard");
                            else toast("Copy failed");
                          }}
                          className="cursor-pointer text-xs sm:text-sm"
                        >
                          <Copy className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          Copy
                        </DropdownMenuItem>
                        {isMine && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={deleteMessage}
                              className="cursor-pointer text-destructive focus:text-destructive text-xs sm:text-sm"
                            >
                              <Trash2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                              Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <span className="flex items-center w-3 flex-shrink-0"></span>
                ))}
            </div>
          </div>

          <div
            className={`flex items-center gap-1 sm:gap-2 text-[10px] sm:text-[6px] text-muted-foreground mt-1 px-1 flex-row`}
          >
            <span className="font-medium whitespace-nowrap">
              <span className="hidden sm:inline">
                {new Date(createdAt).toLocaleDateString([], {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}{" "}
              </span>
              {new Date(createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {isMine && !delivered && (
              <span className="text-muted-foreground/70 italic whitespace-nowrap">
                sending...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { MessageEntity };
