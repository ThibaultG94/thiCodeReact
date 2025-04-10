import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { userApi } from "../lib/api";
import Button from "../components/ui/Button";
import {
  FiSave,
  FiMoon,
  FiSun,
  FiMonitor,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";

const Settings = () => {
  const [preferences, setPreferences] = useState({
    defaultModel: "mistral",
    displayMode: "system",
    language: "fr",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ type: "", message: "" });

  const { user, isAuthenticated, logout } = useAuth();
  const { darkMode, setTheme, useSystemTheme } = useTheme();
  const navigate = useNavigate();

  // Fetch user preferences on mount
  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/settings" } });
      return;
    }

    const fetchPreferences = async () => {
      try {
        const response = await userApi.getPreferences();
        if (response.data && response.data.preferences) {
          setPreferences({
            ...preferences,
            ...response.data.preferences,
          });
        }
      } catch (error) {
        console.error("Error fetching preferences:", error);
        setNotification({
          type: "error",
          message: "Impossible de charger vos préférences.",
        });
      }
    };

    fetchPreferences();
  }, [isAuthenticated, navigate]);

  // Handle theme changes
  useEffect(() => {
    // Update the theme based on the displayMode preference
    if (preferences.displayMode === "dark") {
      setTheme(true);
    } else if (preferences.displayMode === "light") {
      setTheme(false);
    } else {
      useSystemTheme();
    }
  }, [preferences.displayMode, setTheme, useSystemTheme]);

  const handleDisplayModeChange = (mode) => {
    setPreferences({
      ...preferences,
      displayMode: mode,
    });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setPreferences({
      ...preferences,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setNotification({ type: "", message: "" });

    try {
      await userApi.updatePreferences(preferences);
      setNotification({
        type: "success",
        message: "Vos préférences ont été mises à jour avec succès.",
      });
    } catch (error) {
      console.error("Error updating preferences:", error);
      setNotification({
        type: "error",
        message:
          "Une erreur s'est produite lors de la mise à jour de vos préférences.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      await logout();
      navigate("/");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 min-h-full">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Paramètres
      </h1>

      {notification.message && (
        <div
          className={`mb-6 px-4 py-3 rounded-md flex items-start ${
            notification.type === "error"
              ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
              : "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
          }`}
        >
          {notification.type === "error" ? (
            <FiAlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          ) : (
            <FiCheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {user && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Informations du compte
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Nom d'utilisateur
              </p>
              <p className="text-gray-900 dark:text-gray-100">
                {user.username}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Email
              </p>
              <p className="text-gray-900 dark:text-gray-100">{user.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Date d'inscription
              </p>
              <p className="text-gray-900 dark:text-gray-100">
                {new Date(user.date_joined).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6"
      >
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Préférences d'interface
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Thème d'affichage
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => handleDisplayModeChange("light")}
                className={`flex flex-col items-center px-4 py-3 rounded-md ${
                  preferences.displayMode === "light"
                    ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800"
                    : "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                }`}
              >
                <FiSun className="h-6 w-6 mb-1" />
                <span>Clair</span>
              </button>

              <button
                type="button"
                onClick={() => handleDisplayModeChange("dark")}
                className={`flex flex-col items-center px-4 py-3 rounded-md ${
                  preferences.displayMode === "dark"
                    ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800"
                    : "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                }`}
              >
                <FiMoon className="h-6 w-6 mb-1" />
                <span>Sombre</span>
              </button>

              <button
                type="button"
                onClick={() => handleDisplayModeChange("system")}
                className={`flex flex-col items-center px-4 py-3 rounded-md ${
                  preferences.displayMode === "system"
                    ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800"
                    : "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                }`}
              >
                <FiMonitor className="h-6 w-6 mb-1" />
                <span>Système</span>
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="defaultModel"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Modèle IA par défaut
            </label>
            <select
              id="defaultModel"
              name="defaultModel"
              value={preferences.defaultModel}
              onChange={handleSelectChange}
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <Button
            type="submit"
            className="w-full md:w-auto"
            isLoading={isLoading}
            leftIcon={<FiSave />}
          >
            Enregistrer les préférences
          </Button>
        </div>
      </form>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Actions du compte
        </h2>

        <div className="space-y-4">
          <div>
            <Button
              variant="secondary"
              className="w-full md:w-auto"
              onClick={handleLogout}
            >
              Se déconnecter
            </Button>
          </div>

          <div>
            <Button
              variant="danger"
              className="w-full md:w-auto"
              onClick={() =>
                window.confirm(
                  "Cette action est irréversible. Êtes-vous certain de vouloir supprimer votre compte ?"
                )
              }
            >
              Supprimer mon compte
            </Button>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Cette action est irréversible et supprimera toutes vos données.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
