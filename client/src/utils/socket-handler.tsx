import { useChat } from "../hooks/use-chat";
import { useData } from "../hooks/use-data";
import { useSelectedChat } from "../hooks/use-selected-chat";
import type { Message, RawMessage } from "../types/message";
import type { SocketPayload } from "../types/socket-payload";

export function useSocketHandler() {
  const { setChat } = useChat();
  const { setChatHistory } = useData();
  const { selectedChat, setSelectedChat } = useSelectedChat();

  const payloadParser = (payload: string): SocketPayload => {
    return JSON.parse(payload);
  };

  const processSocketMessage = (payload: string) => {
    const parsedPayload: SocketPayload = payloadParser(payload);

    console.log(parsedPayload.type);

    switch (parsedPayload.type) {
      case "status": {
        setChat((prev) =>
          prev.map((chat) => {
            if (chat.user.id.trim() === parsedPayload.payload?.user_id.trim()) {
              return {
                ...chat,
                user: {
                  ...chat.user,
                  status: parsedPayload.payload?.status,
                },
              };
            }
            return chat;
          })
        );

        setSelectedChat((prev: any) => {
          if (
            selectedChat.selectedchat.trim() ===
            parsedPayload.payload?.user_id.trim()
          ) {
            return {
              ...prev,
              chat: {
                ...prev.chat,
                user: {
                  ...prev.chat.user,
                  status: parsedPayload.payload.status,
                },
              },
            };
          } else {
            return prev;
          }
        });

        break;
      }
      case "message": {
        console.log(parsedPayload.payload);

        setChatHistory((prev: any) => {
          return [...prev, parsedPayload.payload];
        });

        break;
      }
      default: {
        console.log("different case field encountered");
      }
    }
  };

  return { processSocketMessage };
}
