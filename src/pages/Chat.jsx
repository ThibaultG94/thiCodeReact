import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import useChatStore from "../store/chatStore";
import Conversation from "../components/chat/Conversation";
import ConversationList from "../components/chat/ConversationList";
import ErrorMessage from "../components/ui/ErrorMessage";
import Button from "../components/ui/Button";
import { FiMenu, FiPlus } from "react-icons/fi";

const Chat = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { fetchConversations, conversations } = useChatStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Load user's conversations on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations();
      console.log("conversations:", conversations);
    } else {
      navigate("/", { state: { from: location.pathname } });
    }
  }, [isAuthenticated, fetchConversations, navigate]);

  // Create a new conversation
  const handleNewConversation = async () => {
    try {
      const newConversation = await useChatStore.getState().createConversation(
        'Bonjour, je suis ThiCodeAI. Comment puis-je vous aider ?'
      );
      navigate(`/chat/${newConversation.id}`);
      setMobileSidebarOpen(false);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  // Toggle mobile sidebar
  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <div className="flex h-full">
      {/* Mobile menu toggle */}
      <button
        className="fixed z-50 md:hidden top-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md"
        onClick={toggleMobileSidebar}
      >
        <FiMenu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile conversation sidebar */}
      <aside
        className={`${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed md:hidden top-0 left-0 w-64 h-full bg-white dark:bg-gray-800 z-40 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out overflow-y-auto`}
      >
        <ConversationList onSelect={() => setMobileSidebarOpen(false)} />
      </aside>

      {/* Main chat content */}
      <div className="flex-1 relative">
        {conversationId ? (
          <Conversation conversationId={conversationId} />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900">
            <div className="text-center max-w-md mx-auto p-6">
              <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Bienvenue dans votre espace de discussion
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Sélectionnez une conversation existante dans la barre latérale
                ou commencez-en une nouvelle.
              </p>
              <Button
                onClick={handleNewConversation}
                size="lg"
                leftIcon={<FiPlus />}
              >
                Nouvelle conversation
              </Button>
            </div>
          </div>
        )}
        
        {/* Error message */}
        <ErrorMessage />
      </div>
    </div>
  );
};

export default Chat;
