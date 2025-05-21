import axios from "axios";
import { endpoints } from '../config/endpoints';

// Create an axios instance with a basic configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to obtain a new CSRF token if necessary
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.config && error.config._retry) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 403 &&
      error.response?.data?.detail?.includes("CSRF")
    ) {
      try {
        error.config._retry = true;
        await getCsrfToken();
        return api(error.config);
      } catch (e) {
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

// Generic function for obtaining a CSRF token before a request
export const getCsrfToken = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL || "http://localhost:8000"}${endpoints.csrf()}`,
      {
        withCredentials: true,
      }
    );

    if (response.data && response.data.csrfToken) {
      api.defaults.headers.common["X-CSRFToken"] = response.data.csrfToken;
      console.log("CSRF Token obtenu avec succès:", response.data.csrfToken);
      return response.data.csrfToken;
    } else {
      console.error("Format de réponse CSRF inattendu:", response.data);
    }
  } catch (error) {
    console.error("Erreur lors de l'obtention du token CSRF:", error);
  }
  return null;
};

// API for conversations
export const conversationsApi = {
  // Get the list of conversations
  getAll: async () => {
    await getCsrfToken();
    return api.get(endpoints.conversations.list());
  },

  // Get details of a conversation
  getById: async (id) => {
    await getCsrfToken();
    return api.get(endpoints.conversations.get(id));
  },

  // Ask Mistral AI for a response
  askMistral: async (message) => {
    await getCsrfToken();
    
    console.log("API call: asking Mistral", { message });
    
    const response = await api.post(endpoints.mistral.ask(), {
      message,
    });
    
    return response.data.response;
  },

  // Create a new conversation
  create: async (message) => {
    await getCsrfToken();

    console.log("API call: create conversation with message:", message);

    return api.post(endpoints.conversations.create(), {
      title: message.slice(0, 50) + '...',
      initial_message: message
    });
  },

  // Delete a conversation
  delete: async (id) => {
    await getCsrfToken();
    return api.delete(endpoints.conversations.get(id));
  },

  // Rename a conversation
  rename: async (id, title) => {
    await getCsrfToken();
    return api.patch(endpoints.conversations.get(id), { title });
  },

  // Sending a message in a conversation
  sendMessage: async (id, message, model = "mistral") => {
    await getCsrfToken();
    return api.post(endpoints.conversations.messages(id), {
      content: message,
      model,
    });
  },
};

// API for users
export const userApi = {
  // Get current user information
  getCurrentUser: () => api.get(endpoints.accounts.currentUser()),

  // Update user preferences
  updatePreferences: (preferences) =>
    api.patch(endpoints.accounts.settings(), { preferences }),

  // Get user preferences
  getPreferences: () => api.get(endpoints.accounts.settings()),

  // Login user
  login: async (username, password) => {
    try {
      await getCsrfToken();
    } catch (e) {}
    return api.post(endpoints.accounts.login(), { username, password });
  },

  // Register new user
  register: async (username, email, password1, password2) => {
    await getCsrfToken(); // Get CSRF token first
    return api.post(endpoints.accounts.register(), {
      username,
      email,
      password1,
      password2,
    });
  },

  // Logout user
  logout: async () => {
    try {
      // Explicitly obtain CSRF token before disconnection
      const csrfToken = await getCsrfToken();

      // Checks whether the token has been obtained
      if (!csrfToken) {
        console.error("Impossible d'obtenir un token CSRF pour la déconnexion");
      }

      // Performs logout request
      return api.post(
        endpoints.accounts.logout(),
        {},
        {
          headers: {
            "X-CSRFToken":
              csrfToken || api.defaults.headers.common["X-CSRFToken"],
          },
        }
      );
    } catch (error) {
      console.error("Erreur lors de la préparation de la déconnexion:", error);
      throw error;
    }
  },
};

export { endpoints };
export default api;
