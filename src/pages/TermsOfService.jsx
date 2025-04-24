import React from "react";
import { FiAlertCircle } from "react-icons/fi";

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Conditions d'Utilisation
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Les règles d'utilisation de la plateforme ThiCodeAI
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
              Nos conditions d'utilisation sont actuellement en cours de
              rédaction. Le contenu complet sera disponible très prochainement.
              Merci de votre compréhension.
            </p>
          </div>
        </div>
      </div>

      <div className="prose prose-lg max-w-none dark:prose-invert">
        <p>
          En utilisant ThiCodeAI, vous acceptez de respecter les règles et
          conditions décrites sur cette page. Ces conditions régissent votre
          utilisation de notre plateforme et définissent les droits et
          responsabilités des utilisateurs.
        </p>

        <p className="text-gray-500 dark:text-gray-400 italic">
          Le contenu détaillé de nos conditions d'utilisation sera disponible
          prochainement.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
