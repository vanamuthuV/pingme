import { useEffect, useRef, useState } from "react";
import axios from "../api/axios";
import { useSelectedChat } from "../hooks/use-selected-chat";
import { type RawMessage } from "../types/message";
import { useAuth } from "../hooks/use-auth";

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
  const conatainerRef = useRef<HTMLDivElement | null>(null);

  const itemHeight = 50;
  const viewPortHeight = conatainerRef.current?.clientHeight;
  const batchSize = 10;

  const [scrollTop, setScrollTop] = useState<number>(0);
  const [chatHistory, setChatHistory] = useState<RawMessage[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const { content, hasMore } = await fetchMessages({
        sender_id: selectedChat.selectedchat,
        page: 0,
        size: batchSize,
      });
      setHasMore(hasMore);
      setChatHistory(content);
    })();
  }, []);

  const totalHeight = chatHistory.length * itemHeight;
  const startIndex = Math.floor(scrollTop / itemHeight);
  const visibleCount = Math.ceil(viewPortHeight! / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount, chatHistory.length);
  const visibleMessages = chatHistory.slice(startIndex, endIndex);

  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const scrollPos = e.currentTarget.scrollTop;
    setScrollTop(scrollPos);

    if (scrollPos === 0 && hasMore) {
      const page = Math.max(
        0,
        chatHistory.length % batchSize === 0
          ? chatHistory.length / batchSize
          : Math.floor(chatHistory.length / batchSize) + 1
      );

      if (page >= 0) {
        const { content, hasMore } = await fetchMessages({
          sender_id: selectedChat.selectedchat,
          page,
          size: batchSize,
        });

        setChatHistory((prev) => prev + content);
        setHasMore(hasMore);

        if (conatainerRef.current) {
          conatainerRef.current.scrollTop = batchSize * itemHeight;
        }
      }
    }
  };

  return (
    <div
      ref={conatainerRef}
      className="flex-1 h-full p-4 overflow-y-scroll"
      onScroll={handleScroll}
    >
      <div className="w-full flex flex-col items-center justify-center">
        {visibleMessages.map((message, i) => {
          const isMine = selectedChat.selectedchat === message.sender;

          return (
            <div
              key={i}
              className={`flex w-4/6 mb-3 animate-fade-in ${
                isMine ? "justify-end" : "justify-start"
              }`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div
                className={`flex flex-col w-full ${
                  isMine ? "items-end" : "items-start"
                } max-w-[75%]`}
              >
                <div
                  className={`flex gap-2 w-4/6 ${
                    isMine ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Profile Picture */}
                  <div className="flex-shrink-0">
                    <img
                      src={
                        isMine
                          ? session?.user.profile_picture
                          : selectedChat.chat.user?.profile_picture
                      }
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-border"
                    />
                  </div>

                  {/* Message Content */}
                  <div
                    className={`flex flex-col ${
                      isMine ? "items-end" : "items-start"
                    } max-w-[85%]`}
                  >
                    <div
                      className={`group relative px-3 py-1.5 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md ${
                        isMine
                          ? "bg-primary text-primary-foreground rounded-br-sm hover:bg-primary/90"
                          : "bg-secondary text-secondary-foreground rounded-bl-sm hover:bg-secondary/80 border border-border"
                      }`}
                    >
                      {/* Message content */}
                      <div className="relative z-10 break-words">
                        {message.message}
                      </div>

                      {/* Subtle hover glow for sent messages */}
                      {isMine && (
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      )}
                    </div>

                    {/* Timestamp and Edit Status */}
                    <div
                      className={`flex items-center gap-1 text-xs text-muted-foreground mt-1 px-1 ${
                        isMine ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <span>
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {message.edited && (
                        <span className="text-muted-foreground/70">
                          (edited)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { ChatWindow };
