import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import ReactMarkdown from "react-markdown";

const ChatMessage = ({ message, isTyping = false }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isFullyTyped, setIsFullyTyped] = useState(false);
  const isFirstRender = useRef(true);

  // Determine message style based on role
  const isUser = message.role === "user";

  // Animation speed - characters per second
  const typingSpeed = 20;

  useEffect(() => {
    // Skip animation for user messages or on subsequent renders of the same message
    if (isUser || !isFirstRender.current) {
      setDisplayedText(message.content);
      setIsFullyTyped(true);
      return;
    }

    // Reset state when a new message comes in
    if (isFirstRender.current) {
      setDisplayedText("");
      setIsFullyTyped(false);
      isFirstRender.current = false;
    }

    // If typing is complete or not an assistant message, show full text
    if (!isTyping || message.role !== "assistant") {
      setDisplayedText(message.content);
      setIsFullyTyped(true);
      return;
    }

    // Animate typing for assistant messages
    let currentIndex = 0;
    const content = message.content;

    const typingInterval = setInterval(() => {
      if (currentIndex < content.length) {
        setDisplayedText(content.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsFullyTyped(true);
      }
    }, 1000 / typingSpeed);

    return () => clearInterval(typingInterval);
  }, [message.content, isTyping, isUser]);

  // Format the timestamp
  const formattedTime = message.created_at
    ? formatDistanceToNow(new Date(message.created_at), {
        addSuffix: true,
        locale: fr,
      })
    : "";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
      >
        <div
          className={`max-w-3xl rounded-lg px-4 py-3 ${
            isUser
              ? "bg-indigo-50 text-gray-800 dark:bg-indigo-900 dark:text-gray-100"
              : "bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-100"
          } shadow-sm`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium text-sm">
              {isUser ? "Vous" : "ThiCodeAI"}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formattedTime}
            </span>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{displayedText}</ReactMarkdown>
          </div>

          {!isFullyTyped && !isUser && (
            <div className="flex mt-2">
              <span className="inline-block h-2 w-2 rounded-full bg-indigo-400 mr-1 animate-pulse"></span>
              <span
                className="inline-block h-2 w-2 rounded-full bg-indigo-400 mr-1 animate-pulse"
                style={{ animationDelay: "300ms" }}
              ></span>
              <span
                className="inline-block h-2 w-2 rounded-full bg-indigo-400 animate-pulse"
                style={{ animationDelay: "600ms" }}
              ></span>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatMessage;
