import { useEffect, useRef } from "react";
import { WebSocketConfig } from "../config/websocket-config";
import { useSocketHandler } from "../utils/socket-handler";

const HandleWebSocketConnection = () => {
  const wsRef = useRef<WebSocketConfig | null>(null);
  const { processSocketMessage } = useSocketHandler();

  useEffect(() => {
    if (wsRef.current) return;

    wsRef.current = WebSocketConfig.getInstance();

    const socket = wsRef.current.socket;

    socket.onopen = () => { };

    socket.onmessage = (event) => processSocketMessage(event.data);

    socket.onclose = () => {}

    socket.onerror = () => console.error("WebSocket error");

    return () => {
      // socket.close();
      // wsRef.current = null;
    };
  }, []);

  return null;

};

export { HandleWebSocketConnection };
