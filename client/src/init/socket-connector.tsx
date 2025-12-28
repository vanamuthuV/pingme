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

    socket.onopen = () => console.log("client connected");

    socket.onmessage = (event) => processSocketMessage(event.data);

    socket.onclose = (e) =>
      console.log("client disconnected", e.code, e.reason);

    socket.onerror = () => console.error("WebSocket error");

    return () => {
      // socket.close();
      // wsRef.current = null;
    };
  }, []);

};

export { HandleWebSocketConnection };
