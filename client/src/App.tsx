import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ChatPage } from "./pages/chat";
import { LandingPage } from "./pages/landing";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
