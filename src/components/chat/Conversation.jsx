import { useState, useRef, useEffect } from "react";
import { useConversationStore } from "../../lib/store";
import { useAuth } from "../../contexts/AuthContext";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import Button from "../ui/Button";
import { FiSend, FiTrash2, FiEdit2 } from "react-icons/fi";

const Conversation = ({ conversationId }) => {
  const [messageInput, setMessageInput] = useState("");
  const [aiModel, setAiModel] = useState("mistral"); // Default model
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);

  const { user } = useAuth();
  const {
    currentConversation,
    fetchConversation,
    sendMessageWithAnimation,
    isTyping,
    renameConversation,
    deleteConversation,
  } = useConversationStore();

  // Load conversation on mount or when ID changes
  useEffect(() => {
    if (conversationId) {
      fetchConversation(conversationId);
    }
  }, [conversationId, fetchConversation]);

  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentConversation?.messages, isTyping]);

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

    // Send message and clear input
    await sendMessageWithAnimation(conversationId, messageInput, aiModel);
    setMessageInput("");
  };

  // Handle rename conversation
  const handleRename = async () => {
    if (isRenaming && newTitle.trim()) {
      await renameConversation(conversationId, newTitle);
      setIsRenaming(false);
    } else {
      setNewTitle(currentConversation?.title || "");
      setIsRenaming(true);
    }
  };

  // Handle delete conversation
  const handleDelete = async () => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cette conversation ?")
    ) {
      await deleteConversation(conversationId);
      // Navigate to home or conversations list
      window.location.href = "/";
    }
  };

  // If no conversation is loaded yet
  if (!currentConversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse">Chargement de la conversation...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Conversation header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 flex items-center justify-between">
        <div className="flex-1">
          {isRenaming ? (
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
              className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
          ) : (
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {currentConversation.title || "Nouvelle conversation"}
            </h1>
          )}
        </div>

        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <span>Modèle: </span>
          <select
            value={aiModel}
            onChange={handleModelChange}
            className="ml-2 bg-transparent dark:bg-transparent border-none focus:ring-0 dark:text-gray-300"
          >
            <option value="mistral">Mistral</option>
            <option value="llama2">Llama 2</option>
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRename}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <FiEdit2 size={18} />
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentConversation.messages?.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

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
