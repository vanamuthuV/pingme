import { MessageCircle } from "lucide-react";

function App() {
  return (
    <div className="min-h-full flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <MessageCircle className="w-12 h-12 text-white" />
        </div>

        <h1 className="text-2xl font-semibold text-white">Ping Me</h1>

        <p className="text-white text-sm leading-relaxed max-w-md">
          Send and receive messages even if your peer is not online.
          <br />
          Stay connected anytime, anywhere.
        </p>
      </div>
    </div>
  );
}

export default App;
