import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useConversationStore } from "../lib/store";
import Button from "../components/ui/Button";
import {
  FiMessageSquare,
  FiCode,
  FiSettings,
  FiChevronRight,
} from "react-icons/fi";

const Home = () => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { createConversation } = useConversationStore();

  // Handle message submission to start a new conversation
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    setIsSubmitting(true);

    try {
      // Create a new conversation with the initial message
      const conversationId = await createConversation(message, "mistral");

      if (conversationId) {
        navigate(`/chat/${conversationId}`);
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="flex flex-col h-full py-6 px-4">
          {/* Navigation links */}
          <nav className="space-y-6 mt-6">
            <a
              href={isAuthenticated ? "/chat" : "/login"}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              <FiMessageSquare className="h-5 w-5 mr-3 text-gray-500" />
              <span className="text-sm">Conversations</span>
            </a>

            <a
              href="/examples"
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              <FiCode className="h-5 w-5 mr-3 text-gray-500" />
              <span className="text-sm">Exemples de code</span>
            </a>

            <a
              href={isAuthenticated ? "/settings" : "/login"}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              <FiSettings className="h-5 w-5 mr-3 text-gray-500" />
              <span className="text-sm">Paramètres</span>
            </a>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-xl text-center">
          <h1 className="text-4xl font-medium text-gray-800 dark:text-gray-100 mb-2">
            Bienvenue {isAuthenticated ? user?.username : ""} sur ThiCodeAI
          </h1>
          <p className="text-base text-gray-500 dark:text-gray-400 mb-10">
            Votre assistant de développement web intelligent
          </p>

          {/* Message input */}
          <form onSubmit={handleSubmit} className="w-full">
            <div className="relative mb-4">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Comment puis-je vous aider aujourd'hui ?"
                className="w-full py-3 px-4 pr-20 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600"
              />

              <div className="absolute right-2 top-2">
                <Button
                  type="submit"
                  size="sm"
                  className="rounded-lg"
                  disabled={!message.trim() || isSubmitting}
                  isLoading={isSubmitting}
                  rightIcon={<FiChevronRight />}
                >
                  Envoyer
                </Button>
              </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              ThiCodeAI peut faire des erreurs. Assurez-vous de vérifier les
              réponses importantes.
            </p>
          </form>

          {/* Feature cards */}
          <div className="grid md:grid-cols-3 gap-4 mt-12">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">
                Génération de code
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Créez du code HTML, CSS et JavaScript de manière accessible et
                sémantique.
              </p>
            </div>

            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">
                Analyse de code
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Recevez des suggestions pour améliorer la qualité et les
                performances de votre code.
              </p>
            </div>

            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">
                Explications détaillées
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Comprenez les concepts et les choix techniques avec des
                explications claires.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
