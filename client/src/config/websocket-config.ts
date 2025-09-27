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
}

export { WebSocketConfig };
