import { useState } from "react";
import { Link } from "react-router";
import { FiAlertCircle, FiArrowLeft, FiMail } from "react-icons/fi";
import Button from "../components/ui/Button";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setError("");

    try {
      // Call the API to request a reset email
      const response = await fetch(
        "http://localhost:8000/api/accounts/api/reset-password/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        setSuccess(true);
      } else {
        const data = await response.json();
        setError(
          data.error || "Une erreur s'est produite. Veuillez réessayer."
        );
      }
    } catch (error) {
      console.error("Error sending reset password email:", error);
      setError(
        "Impossible de communiquer avec le serveur. Veuillez réessayer plus tard."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 sm:px-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Réinitialisation du mot de passe
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Recevez un email pour réinitialiser votre mot de passe
        </p>
      </div>

      {success ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 p-4 rounded-md mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiMail className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-3">
              <p>
                Si un compte existe avec l'adresse {email}, vous recevrez un
                email contenant les instructions pour réinitialiser votre mot de
                passe.
              </p>
              <p className="mt-2">
                Veuillez vérifier votre boîte de réception et vos spams.
              </p>
            </div>
          </div>
          <div className="mt-4 text-center">
            <Link
              to="/login"
              className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 cursor-pointer inline-flex items-center"
            >
              <FiArrowLeft className="mr-2" /> Retour à la connexion
            </Link>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-md mb-6">
              <div className="flex">
                <FiAlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                <span>{error}</span>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Adresse email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="votre.email@exemple.com"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Entrez l'adresse email associée à votre compte
            </p>
          </div>

          <div className="flex items-center justify-between">
            <Link
              to="/login"
              className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 cursor-pointer text-sm"
            >
              Retour à la connexion
            </Link>
            <Button
              type="submit"
              className="cursor-pointer bg-indigo-600 text-white hover:bg-indigo-700"
              isLoading={isSubmitting}
            >
              Envoyer le lien
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
