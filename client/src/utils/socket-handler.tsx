import { useChat } from "../hooks/use-chat";
import { useData } from "../hooks/use-data";
import { useSelectedChat } from "../hooks/use-selected-chat";
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

    // console.log(parsedPayload.type);

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
        const incoming = parsedPayload.payload;

        // console.log(incoming);

        setChatHistory((prev: any) => {
          // uuid missing → just append
          if (!incoming.uuid) {
            // console.log("got uuid");
            return [...prev, incoming];
          }

          const index = prev.findIndex(
            (msg: any) => msg.uuid === incoming.uuid
          );

          if (index !== -1) {
            // console.log("gotacha bro");
            return prev.map((msg: any, i: any) =>
              i === index
                ? {
                    ...msg,
                    id: incoming.id ?? msg.id,
                    delivered: incoming.delivered ?? msg.delivered,
                  }
                : msg
            );
          } else {
            incoming.edited = false;  
          }

          return [...prev, incoming];
        });

        break;
      }

      default: {
        // console.log("different case field encountered");
      }
    }
  };

  return { processSocketMessage };
}
