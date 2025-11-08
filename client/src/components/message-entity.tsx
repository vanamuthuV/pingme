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
import { Button } from "../components/ui/button";

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

    console.log(isMine)

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
          {/* Three-dot menu - connected to message bubble (only for my messages) */}
          {isMine && (
            <div className="flex w-full justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4 cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-40 sm:w-48"
                  side="top"
                >
                  <DropdownMenuItem
                    //   onClick={handleReply}
                    className="cursor-pointer text-xs sm:text-sm"
                  >
                    <Reply className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Reply
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    //   onClick={handleCopy}
                    className="cursor-pointer text-xs sm:text-sm"
                  >
                    <Copy className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Copy
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    //   onClick={handleEdit}
                    className="cursor-pointer text-xs sm:text-sm"
                  >
                    <Pencil className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Edit
                  </DropdownMenuItem>
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
          )}

          <div
            className={`group relative w-auto px-1 sm:px-4 py-0.5 shadow-sm transition-all duration-200 hover:shadow-md ${
              isMine
                ? "bg-primary text-primary-foreground text-right rounded-tr-sm rounded hover:bg-primary/90"
                : "bg-secondary text-secondary-foreground rounded text-left hover:bg-secondary/80 border border-border"
            }`}
          >
            <div className="relative z-10 break-words text-xs sm:text-sm leading-relaxed">
              {message}
            </div>

          </div>

          {/* Timestamp and Status */}
          <div
            className={`flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground mt-1 px-1 ${
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

            {/* Edited indicator */}
            {edited && (
              <span className="text-muted-foreground/70 italic whitespace-nowrap">
                (edited)
              </span>
            )}

            {/* Read receipts for sent messages */}
            {isMine && (
              <span className="flex items-center flex-shrink-0">
                {seen ? (
                  <CheckCheck className="h-3 w-3 text-blue-500" />
                ) : delivered ? (
                  <CheckCheck className="h-3 w-3" />
                ) : (
                  <Check className="h-3 w-3" />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { MessageEntity };
