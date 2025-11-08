// "use client";

// import type React from "react";

// import { useEffect, useRef, useState } from "react";
// import axios from "../api/axios";
// import { useSelectedChat } from "../hooks/use-selected-chat";
// import type { RawMessage } from "../types/message";
// import { useAuth } from "../hooks/use-auth";
// import { Loader2 } from "lucide-react";

// async function fetchMessages({
//   sender_id,
//   page,
//   size,
// }: {
//   sender_id: string;
//   page: number;
//   size: number;
// }) {
//   const { data } = await axios.get(
//     `/get-message?sender=${sender_id}&page=${page}&size=${size}`
//   );

//   return { content: data?.content, hasMore: !data?.last };
// }

// const ChatWindow = () => {
//   const { session } = useAuth();
//   const { selectedChat } = useSelectedChat();
//   const containerRef = useRef<HTMLDivElement | null>(null);

//   const batchSize = 10;

//   const [chatHistory, setChatHistory] = useState<RawMessage[]>([]);
//   const [hasMore, setHasMore] = useState<boolean>(true);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [initialLoad, setInitialLoad] = useState<boolean>(true);

//   const isFetchingRef = useRef<boolean>(false);
//   const firstMessageIdRef = useRef<string | null>(null);

//   useEffect(() => {
//     (async () => {
//       setIsLoading(true);
//       try {
//         const { content, hasMore } = await fetchMessages({
//           sender_id: selectedChat.selectedchat,
//           page: 0,
//           size: batchSize,
//         });
//         setHasMore(hasMore);
//         setChatHistory(content.reverse());

//         setTimeout(() => {
//           if (containerRef.current) {
//             containerRef.current.scrollTop =
//               containerRef.current.scrollHeight;
//           }
//         }, 100);
//       } catch (error) {
//         console.error("Failed to fetch messages:", error);
//       } finally {
//         setIsLoading(false);
//         setInitialLoad(false);
//       }
//     })();
//   }, [selectedChat.selectedchat]);

//   const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
//     const container = e.currentTarget;
//     const scrollPos = container.scrollTop;

//     if (scrollPos < 200 && hasMore && !isLoading && !isFetchingRef.current) {
//       isFetchingRef.current = true;
//       setIsLoading(true);

//       if (chatHistory.length > 0) {
//         firstMessageIdRef.current = chatHistory[0].id || null;
//       }

//       const page = Math.floor(chatHistory.length / batchSize);

//       try {
//         const { content, hasMore: more } = await fetchMessages({
//           sender_id: selectedChat.selectedchat,
//           page,
//           size: batchSize,
//         });

//         if (content.length > 0) {
//           const prevScrollHeight = container.scrollHeight;
//           const prevScrollTop = container.scrollTop;

//           setChatHistory((prev) => [...content.reverse(), ...prev]);

//           requestAnimationFrame(() => {
//             if (containerRef.current) {
//               const newScrollHeight = containerRef.current.scrollHeight;
//               const heightDifference = newScrollHeight - prevScrollHeight;
//               // Maintain position by adding the height difference
//               containerRef.current.scrollTop =
//                 prevScrollTop + heightDifference;
//             }
//           });
//         }

//         setHasMore(more);
//       } catch (error) {
//         console.error("Failed to fetch more messages:", error);
//       } finally {
//         setIsLoading(false);
//         isFetchingRef.current = false;
//       }
//     }
//   };

//   if (initialLoad) {
//     return (
//       <div className="flex-1 flex items-center justify-center">
//         <div className="flex flex-col items-center gap-3">
//           <Loader2 className="w-8 h-8 animate-spin text-primary" />
//           <p className="text-sm text-muted-foreground">Loading messages...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       ref={containerRef}
//       className="flex-1 p-4 overflow-y-auto"
//       onScroll={handleScroll}
//     >
//       {isLoading && (
//         <div className="flex justify-center py-4">
//           <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-4 py-2 rounded-full">
//             <Loader2 className="w-4 h-4 animate-spin" />
//             <span>Loading more messages...</span>
//           </div>
//         </div>
//       )}

//       {!hasMore && chatHistory.length > 0 && (
//         <div className="flex justify-center py-4">
//           <div className="text-xs text-muted-foreground bg-secondary/30 px-3 py-1.5 rounded-full">
//             No more messages
//           </div>
//         </div>
//       )}

//       <div className="w-full space-y-3">
//         {chatHistory.map((message, i) => {
//           const isMine = session?.user.id === message.sender;

//           return (
//             <div
//               key={message.id || i}
//               className={`flex w-full ${
//                 isMine ? "justify-end" : "justify-start"
//               }`}
//             >
//               <div
//                 className={`flex flex-col w-full ${
//                   isMine ? "items-end" : "items-start"
//                 } max-w-[85%] md:max-w-[75%]`}
//               >
//                 <div
//                   className={`flex gap-2 w-full ${
//                     isMine ? "flex-row-reverse" : "flex-row"
//                   }`}
//                 >
//                   {/* Profile Picture */}
//                   <div className="flex-shrink-0">
//                     <img
//                       src={
//                         isMine
//                           ? session?.user.profile_picture
//                           : selectedChat.chat.user?.profile_picture
//                       }
//                       alt="Profile"
//                       className="w-8 h-8 rounded-full object-cover border-2 border-border shadow-sm"
//                     />
//                   </div>

//                   {/* Message Content */}
//                   <div
//                     className={`flex flex-col ${
//                       isMine ? "items-end" : "items-start"
//                     } flex-1 min-w-0`}
//                   >
//                     <div
//                       className={`group relative px-4 py-2 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
//                         isMine
//                           ? "bg-primary text-primary-foreground rounded-br-sm hover:bg-primary/90"
//                           : "bg-secondary text-secondary-foreground rounded-bl-sm hover:bg-secondary/80 border border-border"
//                       }`}
//                     >
//                       {/* Message content */}
//                       <div className="relative z-10 break-words text-sm leading-relaxed">
//                         {message.message}
//                       </div>

//                       {/* Subtle hover glow for sent messages */}
//                       {isMine && (
//                         <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                       )}
//                     </div>

//                     {/* Timestamp and Edit Status */}
//                     <div
//                       className={`flex items-center gap-1.5 text-xs text-muted-foreground mt-1 px-1 ${
//                         isMine ? "flex-row-reverse" : "flex-row"
//                       }`}
//                     >
//                       <span className="font-medium">
//                         {new Date(message.createdAt).toLocaleDateString([], {
//                           year: "numeric",
//                           month: "short",
//                           day: "numeric",
//                         })}{" "}
//                         {new Date(message.createdAt).toLocaleTimeString([], {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}
//                       </span>
//                       {message.edited && (
//                         <span className="text-muted-foreground/70 italic">
//                           (edited)
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {chatHistory.length === 0 && !isLoading && (
//         <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-4">
//           <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={1.5}
//               stroke="currentColor"
//               className="w-8 h-8 text-muted-foreground"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
//               />
//             </svg>
//           </div>
//           <div>
//             <h3 className="text-lg font-semibold text-foreground">
//               No messages yet
//             </h3>
//             <p className="text-sm text-muted-foreground mt-1">
//               Start the conversation by sending a message
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export { ChatWindow };

"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import axios from "../api/axios";
import { useSelectedChat } from "../hooks/use-selected-chat";
import type { RawMessage } from "../types/message";
import { useAuth } from "../hooks/use-auth";
import { Loader2 } from "lucide-react";
import { MessageEntity } from "./message-entity";

async function fetchMessages({
  sender_id,
  page,
  size,
}: {
  sender_id: string;
  page: number;
  size: number;
}) {
  const { data } = await axios.get(
    `/get-message?sender=${sender_id}&page=${page}&size=${size}`
  );

  return { content: data?.content, hasMore: !data?.last };
}

const ChatWindow = () => {
  const { session } = useAuth();
  const { selectedChat } = useSelectedChat();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const batchSize = 18;

  const [chatHistory, setChatHistory] = useState<RawMessage[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);

  const isFetchingRef = useRef<boolean>(false);
  const firstMessageIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      console.log("Chat container ready:", containerRef.current.scrollHeight);
      containerRef.current.addEventListener("scroll", () =>
        console.log("native scroll triggered")
      );
    }

    (async () => {
      setIsLoading(true);
      try {
        const { content, hasMore } = await fetchMessages({
          sender_id: selectedChat.selectedchat,
          page: 0,
          size: batchSize,
        });
        setHasMore(hasMore);
        setChatHistory(content.reverse());

        setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
          }
        }, 100);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setIsLoading(false);
        setInitialLoad(false);
      }
    })();
  }, [selectedChat.selectedchat]);

  const handleScroll = async (e: any) => {
    const container = e.currentTarget;
    console.log(
      "scrollTop:",
      container.scrollTop,
      "scrollHeight:",
      container.scrollHeight,
      "clientHeight:",
      container.clientHeight
    );

    if (container.scrollTop < 150 && hasMore && !isFetchingRef.current) {
      isFetchingRef.current = true;
      const prevScrollHeight = container.scrollHeight;

      try {
        const page = Math.floor(chatHistory.length / batchSize);
        const { content, hasMore: more } = await fetchMessages({
          sender_id: selectedChat.selectedchat,
          page,
          size: batchSize,
        });

        if (content.length > 0) {
          setChatHistory((prev) => [...content.reverse(), ...prev]);

          requestAnimationFrame(() => {
            if (containerRef.current) {
              const newScrollHeight = containerRef.current.scrollHeight;
              containerRef.current.scrollTop =
                newScrollHeight - prevScrollHeight;
            }
          });
        }
        setHasMore(more);
      } catch (error) {
        console.error(error);
      } finally {
        isFetchingRef.current = false;
      }
    }
  };

  if (initialLoad) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-4xl mx-auto overflow-y-auto overflow-x-hidden h-[80vh] flex flex-col"
      onScroll={handleScroll}
    >
      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-4 py-2 rounded-full">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading more messages...</span>
          </div>
        </div>
      )}

      {!hasMore && chatHistory.length > 0 && (
        <div className="flex justify-center py-4">
          <div className="text-xs text-muted-foreground bg-secondary/30 px-3 py-1.5 rounded-full">
            No more messages
          </div>
        </div>
      )}

      <div className="flex flex-col w-full overflow-x-hidden">
        {chatHistory.map((message, i) => {
          const isMine = session?.user.id === message.sender;

          console.log(isMine)

          return (
            <div
              key={message.id || i}
              className={`flex w-full ${
                isMine ? "justify-end" : "justify-start"
              }`}
            >
              <MessageEntity
                createdAt={message.createdAt}
                delivered={message.delivered}
                edited={message.edited}
                id={message.id}
                isMine={session?.user.id === message.sender}
                message={message.message}
                profile={
                  isMine
                    ? (session?.user.profile_picture as string)
                    : (selectedChat.chat.user?.profile_picture as string)
                }
                seen={message.seen}
                updatedAt={message.updatedAt}
                key={message.id}
              />
            </div>
          );
        })}
      </div>

      {chatHistory.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-4">
          <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 text-muted-foreground"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              No messages yet
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Start the conversation by sending a message
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export { ChatWindow };
