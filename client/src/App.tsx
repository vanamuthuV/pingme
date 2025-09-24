import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ChatPage } from "./pages/chat";
import { LandingPage } from "./pages/landing";
import { useAuth } from "./hooks/use-auth";
import { useEffect, useState } from "react";
import axios from "./api/axios";

function App() {
  const { login } = useAuth();
  const [component, setComponent] = useState<"landing" | "chat">("landing");

  useEffect(() => {
    (async () => {
      const response = await axios.get("/verify");
      login(response?.data?.data);
      if (response?.data?.status)
        setComponent("chat")
    })();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={component === "chat" ? <ChatPage /> : <LandingPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
