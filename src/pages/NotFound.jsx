import { Link } from "react-router";
import { FiHome, FiArrowLeft } from "react-icons/fi";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Page non trouvée
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiHome className="mr-2" />
            Retour à l'accueil
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiArrowLeft className="mr-2" />
            Page précédente
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
