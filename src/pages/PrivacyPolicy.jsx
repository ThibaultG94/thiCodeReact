import React from "react";
import { FiAlertCircle } from "react-icons/fi";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Politique de Confidentialité
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Comment ThiCodeAI protège vos données
        </p>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <FiAlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-500 mt-0.5 mr-3" />
          <div>
            <h2 className="text-lg font-medium text-yellow-800 dark:text-yellow-400">
              Page en cours de développement
            </h2>
            <p className="mt-2 text-yellow-700 dark:text-yellow-300">
              Notre politique de confidentialité est actuellement en cours de
              rédaction. Le contenu complet sera disponible très prochainement.
              Merci de votre compréhension.
            </p>
          </div>
        </div>
      </div>

      <div className="prose prose-lg max-w-none dark:prose-invert">
        <p>
          Chez ThiCodeAI, nous prenons la protection de vos données personnelles
          très au sérieux. Cette page détaillera notre approche concernant la
          collecte, l'utilisation et la protection de vos informations lors de
          l'utilisation de notre plateforme.
        </p>

        <p className="text-gray-500 dark:text-gray-400 italic">
          Le contenu détaillé de notre politique de confidentialité sera
          disponible prochainement.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
