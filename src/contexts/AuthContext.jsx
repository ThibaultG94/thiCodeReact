import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if the user is already connected to the load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/api/accounts/current-user/", {
          withCredentials: true, // Important pour les cookies CSRF
        });
        if (response.data.user) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.log("User not authenticated");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      // Get the CSRF token first
      await axios.get("/api/csrf/");

      const response = await axios.post(
        "/api/accounts/login/",
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );

      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Une erreur est survenue lors de la connexion",
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password, password2) => {
    setLoading(true);
    try {
      await axios.get("/api/csrf/");

      const response = await axios.post(
        "/api/accounts/register/",
        {
          username,
          email,
          password1: password,
          password2,
        },
        {
          withCredentials: true,
        }
      );

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Une erreur est survenue lors de l'inscription",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axios.post(
        "/api/accounts/logout/",
        {},
        {
          withCredentials: true,
        }
      );
      setUser(null);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Une erreur est survenue lors de la déconnexion",
      };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
