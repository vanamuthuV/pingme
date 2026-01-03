"use client";

import type React from "react";
import { useEffect, useRef, useState, useCallback } from "react";
import axios from "../api/axios";
import { useSelectedChat } from "../hooks/use-selected-chat";
import { useAuth } from "../hooks/use-auth";
import { Loader2 } from "lucide-react";
import { MessageEntity } from "./message-entity";
import { useData } from "../hooks/use-data";

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

  const batchSize = 15;

  const { chatHistory, setChatHistory } = useData();

  // const [chatHistory, setChatHistory] = useState<RawMessage[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);

  const isFetchingRef = useRef<boolean>(false);
  const currentPageRef = useRef<number>(0);
  const lastScrollTopRef = useRef<number>(0);

  useEffect(() => {
    const loadInitialMessages = async () => {
      setInitialLoad(true);
      setIsLoadingMore(false);
      setChatHistory([]);
      currentPageRef.current = 0;
      isFetchingRef.current = false;
      setHasMore(true);

      try {
        const { content, hasMore } = await fetchMessages({
          sender_id: selectedChat.selectedchat,
          page: 0,
          size: batchSize,
        });

        setHasMore(hasMore);
        setChatHistory(content.reverse());
        currentPageRef.current = 1;

        setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
            lastScrollTopRef.current = containerRef.current.scrollTop;
          }
        }, 100);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setInitialLoad(false);
      }
    };

    loadInitialMessages();
  }, [selectedChat.selectedchat]);

  const loadMoreMessages = useCallback(async () => {
    if (isFetchingRef.current || !hasMore || initialLoad) {
      return;
    }

    isFetchingRef.current = true;
    setIsLoadingMore(true);

    const container = containerRef.current;
    if (!container) {
      isFetchingRef.current = false;
      setIsLoadingMore(false);
      return;
    }

    const prevScrollHeight = container.scrollHeight;
    const prevScrollTop = container.scrollTop;

    try {
      // console.log("🔄 Loading page:", currentPageRef.current);

      const { content, hasMore: more } = await fetchMessages({
        sender_id: selectedChat.selectedchat,
        page: currentPageRef.current,
        size: batchSize,
      });

      // console.log("✅ Loaded messages:", content.length, "hasMore:", more);

      if (content.length > 0) {
        setChatHistory((prev) => [...content.reverse(), ...prev!]);
        currentPageRef.current += 1;
        setHasMore(more);

        setTimeout(() => {
          if (containerRef.current) {
            const newScrollHeight = containerRef.current.scrollHeight;
            const scrollDiff = newScrollHeight - prevScrollHeight;

            // Maintain relative position
            containerRef.current.scrollTop = prevScrollTop + scrollDiff;
            lastScrollTopRef.current = containerRef.current.scrollTop;

            // console.log("📍 Scroll restored:", {
            //   prevHeight: prevScrollHeight,
            //   newHeight: newScrollHeight,
            //   diff: scrollDiff,
            //   newScrollTop: containerRef.current.scrollTop,
            // });
          }
        }, 50);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("❌ Error loading more messages:", error);
    } finally {
      setTimeout(() => {
        setIsLoadingMore(false);
        isFetchingRef.current = false;
      }, 100);
    }
  }, [hasMore, initialLoad, selectedChat.selectedchat]);

  // Scroll handler
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const container = e.currentTarget;
      const currentScrollTop = container.scrollTop;

      // Only log on significant scroll changes
      if (Math.abs(currentScrollTop - lastScrollTopRef.current) > 50) {
        // console.log("📜 Scroll:", {
        //   scrollTop: Math.round(currentScrollTop),
        //   scrollHeight: container.scrollHeight,
        //   clientHeight: container.clientHeight,
        //   distanceFromTop: Math.round(currentScrollTop),
        //   canLoadMore: hasMore,
        //   isLoading: isFetchingRef.current,
        // });
        lastScrollTopRef.current = currentScrollTop;
      }

      // Trigger load when within 200px of top (increased threshold)
      if (
        currentScrollTop < 200 &&
        hasMore &&
        !isFetchingRef.current &&
        !initialLoad
      ) {
        // console.log("🎯 Triggering load more!");
        loadMoreMessages();
      }
    },
    [hasMore, initialLoad, loadMoreMessages]
  );

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
      {/* Loading indicator at the top */}
      {isLoadingMore && (
        <div className="flex justify-center py-4 sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/80 px-4 py-2 rounded-full shadow-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading more messages...</span>
          </div>
        </div>
      )}

      {/* End of messages indicator */}
      {!hasMore && chatHistory!.length > 0 && !isLoadingMore && (
        <div className="flex justify-center py-4 bg-background/50">
          <div className="text-xs text-muted-foreground bg-secondary/30 px-3 py-1.5 rounded-full">
            Beginning of conversation
          </div>
        </div>
      )}

      {/* Messages container */}
      <div className="flex flex-col w-full min-h-0">
        {chatHistory!.map((message, i) => {
          const isMine = session?.user.id === message.sender;

          return (
            <div
              key={message.id || `msg-${i}`}
              className={`flex w-full ${
                isMine ? "justify-end" : "justify-start"
              }`}
            >
              <MessageEntity
                createdAt={message.createdAt}
                delivered={message.delivered}
                edited={message.edited}
                id={message.id}
                isMine={isMine}
                message={message.message}
                profile={
                  isMine
                    ? (session?.user.profile_picture as string)
                    : (selectedChat.chat.user?.profile_picture as string)
                }
                seen={message.seen}
                updatedAt={message.updatedAt}
              />
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {chatHistory!.length === 0 && (
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
