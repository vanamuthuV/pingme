"use client";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ChatPage } from "./pages/chat";
import { LandingPage } from "./pages/landing";
import { useAuth } from "./hooks/use-auth";
import { useEffect, useState } from "react";
import axios from "./api/axios";
import { Loader } from "lucide-react";

function App() {
  const { login } = useAuth();
  const [component, setComponent] = useState<"landing" | "chat">("landing");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/verify");
        login(response?.data?.data);
        if (response?.data?.status) {
          setComponent("chat");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [login]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader className="animate-spin h-12 w-12" />
      </div>
    );
  }

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
