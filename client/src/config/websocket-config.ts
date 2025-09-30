const WebscoketURI = import.meta.env.VITE_WEBSOCKET_URI;

class WebSocketConfig {
  // Private Variable
  #ws;

  constructor() {
    this.#ws = new WebSocket(WebscoketURI);
  }

  get socket() {
    return this.#ws;
  }

  sendMessage(message: string) {
    if (this.#ws.readyState === WebSocket.OPEN) {
      this.#ws.send(message);
    } else {
      console.warn("WebSocket is not open yet, message not sent:", message);
    }
  }
}

export { WebSocketConfig };
