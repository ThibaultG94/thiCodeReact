import { createContext, useContext, useState, useEffect } from "react";
import { userApi, getCsrfToken } from "../lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if the user is already connected on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // We first retrieve a CSRF token
        await getCsrfToken();

        const response = await userApi.getCurrentUser();
        if (response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.log("User not authenticated or API error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await userApi.login(username, password);

      // Update user and return success
      if (response.data && response.data.user) {
        setUser(response.data.user);
        return { success: true };
      }

      // If we arrive here, the request was successful but without user data.
      return { success: false, error: "Format de réponse invalide" };
    } catch (error) {
      // IMPORTANT: Check whether the user is still logged in despite the error.
      try {
        const userCheck = await userApi.getCurrentUser();
        if (userCheck.data) {
          setUser(userCheck.data);
          return { success: true };
        }
      } catch (e) {
        // Ignore this verification error
      }

      return {
        success: false,
        error: error.response?.data?.message || "Erreur de connexion",
      };
    } finally {
      setLoading(false);
    }
  };
  const register = async (username, email, password, password2) => {
    setLoading(true);
    try {
      const response = await userApi.register(
        username,
        email,
        password,
        password2
      );

      // Do not automatically log users in after registration
      // The user must log in after registration
      return { success: true };
    } catch (error) {
      console.error("Register error:", error);
      return {
        success: false,
        error:
          error.response?.data?.errors ||
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
      await userApi.logout();
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
