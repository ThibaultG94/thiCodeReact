import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import useChatStore from "../../store/chatStore";
import {
  FiArchive,
  FiRefreshCw,
  FiMessageSquare,
  FiPlus,
} from "react-icons/fi";
import Button from "../ui/Button";

const ConversationList = () => {
  const navigate = useNavigate();
  const {
    conversations,
    isLoading,
    error,
    fetchConversations,
    createConversation,
    archiveConversation,
    restoreConversation,
  } = useChatStore();

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleNewConversation = async () => {
    try {
      const newConversation = await createConversation();
      navigate(`/chat/${newConversation.id}`);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  const handleArchiveRestore = async (e, conversationId, isArchived) => {
    e.preventDefault();
    try {
      if (isArchived) {
        await restoreConversation(conversationId);
      } else {
        await archiveConversation(conversationId);
      }
    } catch (error) {
      console.error("Error archiving/restoring conversation:", error);
    }
  };

  const activeConversations = conversations.filter(
    (c) => c.status === "active"
  );
  const archivedConversations = conversations.filter(
    (c) => c.status === "archived"
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-pulse">Chargement des conversations...</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">Erreur : {error}</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Button
          onClick={handleNewConversation}
          className="w-full"
          leftIcon={<FiPlus />}
        >
          Nouvelle conversation
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Active conversations */}
        <div className="p-4">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Conversations actives
          </h2>
          {activeConversations.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Aucune conversation active
            </p>
          ) : (
            <ul className="space-y-2">
              {activeConversations.map((conversation) => (
                <li key={conversation.id}>
                  <Link
                    to={`/chat/${conversation.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="flex items-center space-x-3">
                      <FiMessageSquare className="text-gray-400" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {conversation.title || "Nouvelle conversation"}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {conversation.message_count} messages
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) =>
                        handleArchiveRestore(e, conversation.id, false)
                      }
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      <FiArchive className="text-gray-400 hover:text-gray-600" />
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Archived conversations */}
        {archivedConversations.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Archives
            </h2>
            <ul className="space-y-2">
              {archivedConversations.map((conversation) => (
                <li key={conversation.id}>
                  <Link
                    to={`/chat/${conversation.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 opacity-75"
                  >
                    <div className="flex items-center space-x-3">
                      <FiMessageSquare className="text-gray-400" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {conversation.title || "Nouvelle conversation"}
                        </h3>
                        <p className="text-xs text-gray-500">
                          Archivée le{" "}
                          {new Date(
                            conversation.archived_at
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) =>
                        handleArchiveRestore(e, conversation.id, true)
                      }
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      <FiRefreshCw className="text-gray-400 hover:text-gray-600" />
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
