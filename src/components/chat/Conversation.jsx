import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import useChatStore from "../../store/chatStore";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import Button from "../ui/Button";
import ErrorMessage from "../ui/ErrorMessage";
import { FiSend, FiTrash2, FiEdit2, FiMoreVertical, FiArchive, FiRefreshCw } from "react-icons/fi";

const Conversation = ({ conversationId }) => {
  const [messageInput, setMessageInput] = useState("");
  const [aiModel, setAiModel] = useState("mistral"); // Default model
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);

  const { user } = useAuth();
  const {
    conversations,
    messages,
    isLoading,
    isTyping,
    error,
    sendMessage,
    archiveConversation,
    restoreConversation,
    updateMetadata
  } = useChatStore();
  
  const currentConversation = conversations.find(c => c.id === parseInt(conversationId));

  // Load conversation messages on mount or when ID changes
  useEffect(() => {
    if (conversationId) {
      const conversation = conversations.find(c => c.id === parseInt(conversationId));
      if (conversation) {
        // Charger les messages de la conversation
        useChatStore.getState().fetchMessages(conversationId);
      }
    }
  }, [conversationId, conversations]);

  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when conversation loads
  useEffect(() => {
    messageInputRef.current?.focus();
  }, [currentConversation]);

  // Handle model change
  const handleModelChange = (e) => {
    setAiModel(e.target.value);
    // Optionally save the model preference to localStorage
    localStorage.setItem("selectedModel", e.target.value);
  };

  // Handle message submission
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageInput.trim() || !conversationId) return;

    try {
      // Send message and clear input
      await sendMessage(conversationId, messageInput, aiModel);
      setMessageInput("");
    } catch (error) {
      // Error is handled by the store and displayed by ErrorMessage
      console.error('Error sending message:', error);
    }
  };

  // Handle rename conversation
  const handleRename = async () => {
    if (isRenaming && newTitle.trim()) {
      try {
        await updateMetadata(conversationId, { title: newTitle });
        setIsRenaming(false);
        setMenuOpen(false);
      } catch (error) {
        console.error('Error renaming conversation:', error);
      }
    } else {
      setNewTitle(currentConversation?.title || "");
      setIsRenaming(true);
    }
  };

  // Handle archive/restore conversation
  const handleArchiveRestore = async () => {
    try {
      if (currentConversation?.status === 'archived') {
        await restoreConversation(conversationId);
      } else {
        await archiveConversation(conversationId);
      }
    } catch (error) {
      console.error('Error archiving/restoring conversation:', error);
    }
  };

  // Toggle dropdown menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (isRenaming) {
      setIsRenaming(false);
    }
  };

  // Show loading or error state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse">Chargement de la conversation...</div>
      </div>
    );
  }

  if (!currentConversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">Conversation non trouvée</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Conversation header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 flex items-center justify-between">
        <div className="flex-1 truncate">
          {isRenaming ? (
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
              className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
          ) : (
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">
              {currentConversation.title || "Nouvelle conversation"}
            </h1>
          )}
        </div>

        <div className="flex items-center ml-4">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mr-4">
            <span className="hidden sm:inline">Modèle:</span>
            <select
              value={aiModel}
              onChange={handleModelChange}
              className="ml-2 bg-transparent dark:bg-transparent border-none focus:ring-0 dark:text-gray-300"
            >
              <option value="mistral">Mistral</option>
              <option value="llama2">Llama 2</option>
            </select>
          </div>

          <div className="relative">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              aria-label="Menu de conversation"
            >
              <FiMoreVertical size={20} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                <button
                  onClick={handleRename}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiEdit2 size={16} className="mr-2" />
                  Renommer
                </button>
                <button
                  onClick={handleArchiveRestore}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {currentConversation?.status === 'archived' ? (
                    <>
                      <FiRefreshCw size={16} className="mr-2" />
                      Restaurer
                    </>
                  ) : (
                    <>
                      <FiArchive size={16} className="mr-2" />
                      Archiver
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Commencez la conversation en envoyant un message ci-dessous.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}

        {isTyping && (
          <div className="py-2">
            <TypingIndicator />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <textarea
            ref={messageInputRef}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            placeholder="Tapez votre message ici..."
            className="flex-1 resize-none border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            rows="2"
          />
          <Button
            type="submit"
            className="ml-4"
            disabled={!messageInput.trim() || isTyping}
            rightIcon={<FiSend />}
          >
            Envoyer
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Conversation;
