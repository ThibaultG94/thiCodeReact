import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useConversationStore } from "../lib/store";
import Button from "../components/ui/Button";
import { FiArrowRight, FiLogIn, FiUserPlus } from "react-icons/fi";

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

  // Display a different interface for logged-in and unlogged-in users
  if (isAuthenticated) {
    // Version for online users
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-xl text-center">
          <h1 className="text-3xl md:text-4xl font-medium text-gray-800 dark:text-gray-100 mb-2">
            Bienvenue sur ThiCodeAI
            {user?.username ? `, ${user.username}` : ""}
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
                  rightIcon={<FiArrowRight />}
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
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">
                Génération de code
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Créez du code HTML, CSS et JavaScript de manière accessible et
                sémantique.
              </p>
            </div>

            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">
                Analyse de code
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Recevez des suggestions pour améliorer la qualité et les
                performances de votre code.
              </p>
            </div>

            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
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
    );
  } else {
    // Version for offline visitors
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-2xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            ThiCodeAI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            L'assistant IA intelligent pour les développeurs web
          </p>

          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-0.5 rounded-lg mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                Rejoignez-nous pour accéder à toutes les fonctionnalités
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Créez des codes accessibles, obtenez des analyses détaillées et
                recevez des explications claires sur les concepts de
                développement web.
              </p>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
                <Button
                  onClick={() => navigate("/login")}
                  size="lg"
                  leftIcon={<FiLogIn />}
                >
                  Connexion
                </Button>
                <Button
                  onClick={() => navigate("/register")}
                  variant="secondary"
                  size="lg"
                  leftIcon={<FiUserPlus />}
                >
                  Inscription
                </Button>
              </div>
            </div>
          </div>

          {/* Feature showcase for non-authenticated users */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-5 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
              <h3 className="font-medium text-lg mb-2 text-gray-900 dark:text-gray-100">
                Génération de code
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Créez du code HTML, CSS et JavaScript de manière accessible et
                sémantique.
              </p>
            </div>

            <div className="p-5 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
              <h3 className="font-medium text-lg mb-2 text-gray-900 dark:text-gray-100">
                Analyse de code
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Recevez des suggestions pour améliorer la qualité et les
                performances de votre code.
              </p>
            </div>

            <div className="p-5 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
              <h3 className="font-medium text-lg mb-2 text-gray-900 dark:text-gray-100">
                Explications détaillées
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Comprenez les concepts et les choix techniques avec des
                explications claires.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Home;
