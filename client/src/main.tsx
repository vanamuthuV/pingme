// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./context/theme-context.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import { SessionProvider } from "./context/session-context.tsx";
import { ChatProvider } from "./context/chat-context.tsx";
import { HandleWebSocketConnection } from "./init/socket-connector.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <ThemeProvider defaultTheme="dark">
    <SessionProvider>
      <ChatProvider>
        <App />
        <Toaster />
        <HandleWebSocketConnection />
      </ChatProvider>
    </SessionProvider>
  </ThemeProvider>
);
