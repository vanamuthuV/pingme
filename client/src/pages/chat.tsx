import { ChatPanel } from "../components/chat-window";
import Layout from "../layout";
import { ChatInput } from "../components/chat-input";
import { useSelectedChat } from "../hooks/use-selected-chat";
import ChatDefault from "../components/chat-default";

export function ChatPage() {
  const { selectedChat } = useSelectedChat();

  return (
    <Layout className="min-h-[calc(100vh-55px)]">
      {selectedChat.selectedchat.trim() ? (
        <div className="min-h-full flex flex-col">
          <ChatPanel />
          <ChatInput />
        </div>
      ) : (
        <ChatDefault />
      )}
    </Layout>
  );
}
