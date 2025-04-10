import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useConversationStore } from "../lib/store";
import { useAuth } from "../contexts/AuthContext";
import Conversation from "../components/chat/Conversation";
import Button from "../components/ui/Button";
import {
  FiPlus,
  FiMessageSquare,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const Chat = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { conversations, fetchConversations } = useConversationStore();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);

  // Load user's conversations on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations();
    } else {
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [isAuthenticated, fetchConversations, navigate]);

  // Handle window resize for responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Navigate to a conversation
  const handleConversationClick = (id) => {
    navigate(`/chat/${id}`);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  // Create a new conversation
  const handleNewConversation = () => {
    navigate("/chat/new");
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-full">
      {/* Sidebar toggle button (mobile) */}
      <button
        className="md:hidden fixed top-4 left-4 z-20 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md"
        onClick={toggleSidebar}
      >
        {sidebarOpen ? <FiChevronLeft /> : <FiChevronRight />}
      </button>

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:relative z-10 w-64 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out`}
      >
        {/* New conversation button */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Button
            onClick={handleNewConversation}
            className="w-full justify-center"
            leftIcon={<FiPlus />}
          >
            Nouvelle conversation
          </Button>
        </div>

        {/* Conversations list */}
        <div className="h-full overflow-y-auto pb-20">
          <h2 className="px-4 pt-4 pb-2 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Conversations
          </h2>
          <div className="space-y-1 px-3">
            {conversations.length > 0 ? (
              conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => handleConversationClick(conversation.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center ${
                    conversation.id.toString() === conversationId
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  <FiMessageSquare className="mr-2 flex-shrink-0" />
                  <span className="truncate">
                    {conversation.title || "Nouvelle conversation"}
                  </span>
                </button>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Aucune conversation
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {conversationId ? (
          <Conversation conversationId={conversationId} />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900">
            <div className="text-center max-w-md mx-auto p-6">
              <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Bienvenue sur ThiCodeAI
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Sélectionnez une conversation existante ou créez-en une nouvelle
                pour commencer.
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
      </div>
    </div>
  );
};

export default Chat;
