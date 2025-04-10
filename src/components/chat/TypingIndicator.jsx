import { motion } from "framer-motion";

const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 max-w-max shadow-sm">
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "loop",
          delay: 0,
        }}
        className="w-2 h-2 rounded-full bg-primary-500"
      />
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "loop",
          delay: 0.2,
        }}
        className="w-2 h-2 rounded-full bg-primary-500"
      />
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "loop",
          delay: 0.4,
        }}
        className="w-2 h-2 rounded-full bg-primary-500"
      />
      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
        ThiCodeAI est en train d'écrire...
      </span>
    </div>
  );
};

export default TypingIndicator;
