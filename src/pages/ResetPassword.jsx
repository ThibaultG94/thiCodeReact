import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { FiAlertCircle, FiArrowLeft, FiCheck } from "react-icons/fi";
import Button from "../components/ui/Button";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);
  const [tokenChecking, setTokenChecking] = useState(true);

  const { token } = useParams();
  const navigate = useNavigate();

  // Check token validity on loading
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(
          `/api/accounts/verify-reset-token/${token}/`
        );
        const data = await response.json();

        setTokenValid(data.valid);
      } catch (error) {
        setTokenValid(false);
      } finally {
        setTokenChecking(false);
      }
    };

    if (token) {
      verifyToken();
    } else {
      setTokenValid(false);
      setTokenChecking(false);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/accounts/reset-password/confirm/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        const data = await response.json();
        setError(
          data.error || "Une erreur s'est produite. Veuillez réessayer."
        );
      }
    } catch (error) {
      setError(
        "Impossible de communiquer avec le serveur. Veuillez réessayer plus tard."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Display during token verification
  if (tokenChecking) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 sm:px-6 text-center">
        <div className="animate-pulse">
          <p className="text-gray-600 dark:text-gray-400">
            Vérification du lien...
          </p>
        </div>
      </div>
    );
  }

  // Display if token is invalid
  if (!tokenValid) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 sm:px-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-6 rounded-md">
          <div className="flex">
            <FiAlertCircle className="h-6 w-6 text-red-500 mr-3" />
            <div>
              <h3 className="text-lg font-medium">Lien invalide ou expiré</h3>
              <p className="mt-2">
                Ce lien de réinitialisation n'est plus valide ou a expiré.
                Veuillez faire une nouvelle demande de réinitialisation.
              </p>
              <div className="mt-4">
                <Link
                  to="/forgot-password"
                  className="text-red-700 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 cursor-pointer font-medium"
                >
                  Nouvelle demande de réinitialisation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4 sm:px-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Définir un nouveau mot de passe
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Choisissez un nouveau mot de passe pour votre compte
        </p>
      </div>

      {success ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 p-6 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium">
                Mot de passe modifié avec succès !
              </h3>
              <p className="mt-2">
                Votre mot de passe a été réinitialisé. Vous allez être redirigé
                vers la page de connexion...
              </p>
            </div>
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

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Nouveau mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Au moins 8 caractères"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              8 caractères minimum, incluant au moins une lettre et un chiffre
            </p>
          </div>

          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Répétez votre mot de passe"
            />
          </div>

          <div className="flex items-center justify-between">
            <Link
              to="/login"
              className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 cursor-pointer text-sm"
            >
              <FiArrowLeft className="inline mr-1" /> Retour à la connexion
            </Link>
            <Button
              type="submit"
              className="cursor-pointer bg-indigo-600 text-white hover:bg-indigo-700"
              isLoading={isSubmitting}
            >
              Réinitialiser le mot de passe
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
