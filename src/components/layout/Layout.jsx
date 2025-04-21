import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import {
  FiHome,
  FiMessageSquare,
  FiCode,
  FiSettings,
  FiLogIn,
  FiLogOut,
  FiUserPlus,
  FiMoon,
  FiSun,
  FiMenu,
  FiX,
} from "react-icons/fi";

const Layout = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);

  // Check whether the current path corresponds to a route
  const isActive = (path) => {
    return (
      location.pathname === path ||
      (path !== "/" && location.pathname.startsWith(path))
    );
  };

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  // Adjust sidebar to window resizing
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      try {
        await logout();
        navigate("/");
      } catch (error) {
        console.error("Erreur de déconnexion:", error);
        alert(
          "Une erreur est survenue lors de la déconnexion. Veuillez réessayer."
        );
      }
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Toggle button for mobile sidebar */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg text-gray-700 dark:text-gray-300"
        aria-label={sidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
      >
        {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Overlay when sidebar is open on mobile */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Unified sidebar - contains everything that was in the header and sidebar */}
      <aside
        className={`fixed md:relative z-40 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo and title at top */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500">
              ThiCodeAI
            </span>
          </Link>
        </div>

        {/* Main sidebar content */}
        <div className="flex flex-col h-[calc(100%-10rem)] p-4 overflow-y-auto">
          {/* Main navigation */}
          <nav className="space-y-1 mb-6">
            <Link
              to="/"
              className={`flex items-center px-3 py-2 rounded-md text-sm ${
                isActive("/")
                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <FiHome className="mr-3 flex-shrink-0" />
              <span>Accueil</span>
            </Link>

            <Link
              to="/chat"
              className={`flex items-center px-3 py-2 rounded-md text-sm ${
                isActive("/chat")
                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <FiMessageSquare className="mr-3 flex-shrink-0" />
              <span>Conversations</span>
            </Link>

            <Link
              to="/examples"
              className={`flex items-center px-3 py-2 rounded-md text-sm ${
                isActive("/examples")
                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <FiCode className="mr-3 flex-shrink-0" />
              <span>Exemples de code</span>
            </Link>
          </nav>

          {/* Recent conversations if logged in */}
          {isAuthenticated && (
            <div className="mb-6">
              <h3 className="px-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Conversations récentes
              </h3>
              <div className="space-y-1">
                {/* Here we would use a mapping of recent conversations */}
                {user?.conversations?.slice(0, 5).map((conversation) => (
                  <Link
                    key={conversation.id}
                    to={`/chat/${conversation.id}`}
                    className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md truncate"
                  >
                    <span className="truncate">
                      {conversation.title || "Nouvelle conversation"}
                    </span>
                  </Link>
                ))}
              </div>

              <Link
                to="/chat"
                className="flex items-center px-3 py-2 mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
              >
                Voir toutes les conversations
              </Link>
            </div>
          )}
        </div>

        {/* Actions at the bottom of the sidebar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          {/* Dark/Light theme */}
          <button
            onClick={toggleDarkMode}
            className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md mb-2"
          >
            {darkMode ? (
              <>
                <FiSun className="mr-3 flex-shrink-0" />
                <span>Mode clair</span>
              </>
            ) : (
              <>
                <FiMoon className="mr-3 flex-shrink-0" />
                <span>Mode sombre</span>
              </>
            )}
          </button>

          {/* Authentication */}
          {isAuthenticated ? (
            <>
              <Link
                to="/settings"
                className={`flex items-center w-full px-3 py-2 rounded-md text-sm ${
                  isActive("/settings")
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <FiSettings className="mr-3 flex-shrink-0" />
                <span>Paramètres</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 mt-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <FiLogOut className="mr-3 flex-shrink-0" />
                <span>Déconnexion</span>
              </button>

              {/* User info */}
              {user && (
                <div className="flex items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      {user.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                  </div>
                  <div className="ml-3 overflow-hidden">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                      {user.username || "Utilisateur"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email || ""}
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center w-full px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiLogIn className="mr-3 flex-shrink-0" />
                <span>Connexion</span>
              </Link>

              <Link
                to="/register"
                className="flex items-center w-full px-3 py-2 mt-2 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiUserPlus className="mr-3 flex-shrink-0" />
                <span>Inscription</span>
              </Link>
            </>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen md:ml-0">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
