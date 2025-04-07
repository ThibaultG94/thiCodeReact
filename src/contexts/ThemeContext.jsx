import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // Detects system preference or uses saved theme
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("darkMode");

    if (savedTheme === "true") return true;
    if (savedTheme === "false") return false;

    // If no preference saved, use system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Update HTML class when theme changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("darkMode", newMode.toString());
      return newMode;
    });
  };

  const setTheme = (isDark) => {
    setDarkMode(isDark);
    localStorage.setItem("darkMode", isDark.toString());
  };

  const useSystemTheme = () => {
    localStorage.removeItem("darkMode");
    setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
  };

  const value = {
    darkMode,
    toggleDarkMode,
    setTheme,
    useSystemTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
