import React from "react";
import { FiBookOpen, FiCode, FiExternalLink } from "react-icons/fi";

const Documentation = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Documentation
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Tout ce que vous devez savoir pour utiliser ThiCodeAI efficacement
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <FiBookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Guide de démarrage
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Apprenez les bases de ThiCodeAI et comment l'utiliser pour vos
            projets de développement web.
          </p>
          <p className="text-gray-500 dark:text-gray-500 italic text-sm">
            Contenu en cours de développement
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <FiCode className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Références API
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Documentation technique détaillée sur les fonctionnalités et les API
            de ThiCodeAI.
          </p>
          <p className="text-gray-500 dark:text-gray-500 italic text-sm">
            Contenu en cours de développement
          </p>
        </div>
      </div>

      <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-6 border border-indigo-100 dark:border-indigo-800">
        <h3 className="text-lg font-medium text-indigo-800 dark:text-indigo-300 mb-4">
          Documentation en construction
        </h3>
        <p className="text-indigo-700 dark:text-indigo-300 mb-4">
          Notre documentation complète est en cours de développement et sera
          disponible prochainement. Nous travaillons à vous fournir des guides
          détaillés, des tutoriels et des exemples pour vous aider à tirer le
          meilleur parti de ThiCodeAI.
        </p>
        <p className="text-indigo-700 dark:text-indigo-300">
          En attendant, n'hésitez pas à explorer l'interface et à essayer les
          différentes fonctionnalités. Pour toute question, contactez-nous via
          la page d'assistance.
        </p>
      </div>

      <div className="mt-12 text-center">
        <a
          href="https://github.com/ThibaultG94/thicodeAi"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 cursor-pointer"
        >
          Consulter le dépôt GitHub
          <FiExternalLink className="ml-2" />
        </a>
      </div>
    </div>
  );
};

export default Documentation;
