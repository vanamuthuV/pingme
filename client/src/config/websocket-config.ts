class WebSocketConfig {
  static instance: WebSocketConfig;
  socket: WebSocket;

  private constructor() {
    this.socket = new WebSocket(import.meta.env.VITE_WEBSOCKET_URI);
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new WebSocketConfig();
    }
    return this.instance;
  }

  sendMessage(data: string) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(data);
    } else {
      console.warn("WS not ready, chill mf");
    }
  }
}

export { WebSocketConfig };
