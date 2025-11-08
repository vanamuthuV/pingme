import Layout from "../layout";
import { useSelectedChat } from "../hooks/use-selected-chat";
import ChatDefault from "../components/chat-default";
import { ChatWindow } from "../components/chat-window";

export function ChatPage() {
  const { selectedChat } = useSelectedChat();

  return (
    <Layout>
      {selectedChat.selectedchat.trim() ? <ChatWindow /> : <ChatDefault />}
    </Layout>
  );
}
