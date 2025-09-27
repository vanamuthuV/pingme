import { WebSocketConfig } from "../config/websocket-config";
import { useSocketHandler } from "../utils/socket-handler";

const HandleWebSocketConnection = () => {
  const ws = new WebSocketConfig();
  const { processSocketMessage } = useSocketHandler();

  ws.socket.onopen = () => console.log("client connected");

  ws.socket.onmessage = (event) => processSocketMessage(event.data);

  ws.socket.onclose = () => console.log("client disconnected");

  ws.socket.onerror = (err) => console.log("erro " + err);

  return null;
};

export { HandleWebSocketConnection };
