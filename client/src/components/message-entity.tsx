import {
  Check,
  CheckCheck,
  Copy,
  MoreHorizontal,
  Pencil,
  Reply,
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

const MessageEntity = ({
  id,
  message,
  createdAt,
  updatedAt,
  delivered,
  seen,
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
            }`}
          >
            <div
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => {
                // Only hide if dropdown is not open
                if (!dropdownOpen) {
                  setHover(false);
                }
              }}
              className="relative w-auto z-10 break-words text-xs sm:text-sm leading-relaxed flex items-center gap-2 justify-center"
            >
              <span>{message}</span>

              {isMine &&
                (hover || dropdownOpen ? (
                  <div className="flex flex-1 w-full justify-end">
                    <DropdownMenu
                      open={dropdownOpen}
                      onOpenChange={(open) => {
                        setDropdownOpen(open);
                        // When dropdown closes, also hide the hover state
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
                          //   onClick={handleCopy}
                          className="cursor-pointer text-xs sm:text-sm"
                        >
                          <Copy className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          Copy
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      
                        <DropdownMenuItem
                          //   onClick={handleDelete}
                          className="cursor-pointer text-destructive focus:text-destructive text-xs sm:text-sm"
                        >
                          <Trash2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <span className="flex items-center flex-shrink-0">
                    {seen ? (
                      <CheckCheck className="h-3 w-3 text-blue-500" />
                    ) : delivered ? (
                      <CheckCheck className="h-3 w-3" />
                    ) : (
                      <Check className="h-3 w-3" />
                    )}
                  </span>
                ))}
            </div>
          </div>

          <div
            className={`flex items-center gap-1 sm:gap-2 text-[10px] sm:text-[6px] text-muted-foreground mt-1 px-1 ${
              isMine ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Timestamp */}
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

            {edited && (
              <span className="text-muted-foreground/70 italic whitespace-nowrap">
                (edited)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { MessageEntity };
