import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useConversationStore } from "../lib/store";
import { useAuth } from "../contexts/AuthContext";
import Conversation from "../components/chat/Conversation";
import Button from "../components/ui/Button";
import { FiMessageSquare, FiPlus, FiMenu } from "react-icons/fi";

const Chat = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { conversations, fetchConversations } = useConversationStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Load user's conversations on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations();
    } else {
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [isAuthenticated, fetchConversations, navigate]);

  // Create a new conversation
  const handleNewConversation = () => {
    navigate("/chat/new");
    setMobileSidebarOpen(false);
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
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Conversations
          </h2>
          <Button
            onClick={handleNewConversation}
            variant="ghost"
            size="sm"
            className="p-1"
            aria-label="Nouvelle conversation"
          >
            <FiPlus />
          </Button>
        </div>

        <div className="p-2">
          {conversations.length > 0 ? (
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => {
                    navigate(`/chat/${conversation.id}`);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center ${
                    conversation.id.toString() === conversationId
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  <FiMessageSquare className="mr-2 flex-shrink-0" />
                  <span className="truncate">
                    {conversation.title || "Nouvelle conversation"}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
              Aucune conversation
            </div>
          )}
        </div>
      </aside>

      {/* Main chat content */}
      <div className="flex-1">
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
      </div>
    </div>
  );
};

export default Chat;
