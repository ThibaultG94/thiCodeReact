import { Outlet, Link, useLocation } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import {
  FiHome,
  FiMessageSquare,
  FiSettings,
  FiLogIn,
  FiLogOut,
  FiUserPlus,
  FiMoon,
  FiSun,
} from "react-icons/fi";

const Layout = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();

  // Check whether the current path corresponds to a route
  const isActive = (path) => {
    return (
      location.pathname === path ||
      (path !== "/" && location.pathname.startsWith(path))
    );
  };

  // For some pages, we want to hide the header (for example, in the chat page)
  const shouldShowHeader = !location.pathname.startsWith("/chat/");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {shouldShowHeader && (
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              {/* Logo and main navigation */}
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                  <Link
                    to="/"
                    className="text-xl font-bold text-indigo-600 dark:text-indigo-400"
                  >
                    ThiCodeAI
                  </Link>
                </div>
                <nav className="hidden sm:ml-6 sm:flex sm:space-x-4">
                  <Link
                    to="/"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive("/")
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                    }`}
                  >
                    Accueil
                  </Link>
                  <Link
                    to="/chat"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive("/chat")
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                    }`}
                  >
                    Chat
                  </Link>
                </nav>
              </div>

              {/* User actions */}
              <div className="flex items-center">
                {/* Toggle dark/light theme */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 focus:outline-none"
                  aria-label={
                    darkMode
                      ? "Passer au thème clair"
                      : "Passer au thème sombre"
                  }
                >
                  {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
                </button>

                {/* Navigation authentication */}
                <div className="hidden sm:ml-4 sm:flex sm:items-center">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/settings"
                        className={`ml-3 px-3 py-2 rounded-md text-sm font-medium ${
                          isActive("/settings")
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                        }`}
                      >
                        <FiSettings className="inline mr-1" /> Paramètres
                      </Link>
                      <button
                        onClick={logout}
                        className="ml-3 px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                      >
                        <FiLogOut className="inline mr-1" /> Déconnexion
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className={`ml-3 px-3 py-2 rounded-md text-sm font-medium ${
                          isActive("/login")
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                        }`}
                      >
                        <FiLogIn className="inline mr-1" /> Connexion
                      </Link>
                      <Link
                        to="/register"
                        className={`ml-3 px-3 py-2 rounded-md text-sm font-medium ${
                          isActive("/register")
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                        }`}
                      >
                        <FiUserPlus className="inline mr-1" /> Inscription
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Mobile menu (displayed on mobile only) */}
      {shouldShowHeader && (
        <nav className="sm:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="px-2 py-3 space-y-1">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/")
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              }`}
            >
              <FiHome className="inline mr-2" /> Accueil
            </Link>
            <Link
              to="/chat"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/chat")
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              }`}
            >
              <FiMessageSquare className="inline mr-2" /> Chat
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/settings"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive("/settings")
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                  }`}
                >
                  <FiSettings className="inline mr-2" /> Paramètres
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                >
                  <FiLogOut className="inline mr-2" /> Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive("/login")
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                  }`}
                >
                  <FiLogIn className="inline mr-2" /> Connexion
                </Link>
                <Link
                  to="/register"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive("/register")
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                  }`}
                >
                  <FiUserPlus className="inline mr-2" /> Inscription
                </Link>
              </>
            )}
          </div>
        </nav>
      )}

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer - displayed only on certain pages */}
      {shouldShowHeader && (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex justify-center md:justify-start">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  &copy; {new Date().getFullYear()} ThiCodeAI - Tous droits
                  réservés
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="flex space-x-6 justify-center md:justify-end">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    Mentions légales
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    Confidentialité
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
