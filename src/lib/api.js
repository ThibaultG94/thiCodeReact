import axios from "axios";

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
    // If the error is due to an expired CSRF token
    if (
      error.response?.status === 403 &&
      error.response?.data?.detail?.includes("CSRF")
    ) {
      try {
        // Get a new CSRF token
        await axios.get("/api/csrf/");
        // Retry the original query
        return api(error.config);
      } catch (e) {
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

// API for conversations
export const conversationsApi = {
  // Get the list of conversations
  getAll: () => api.get("/api/chat/conversations/"),

  // Get details of a conversation
  getById: (id) => api.get(`/api/chat/conversations/${id}/`),

  // Create a new conversation
  create: (message, model = "mistral") =>
    api.post("/api/chat/conversations/", { message, ai_model: model }),

  // Delete a conversation
  delete: (id) => api.delete(`/api/chat/conversations/${id}/`),

  // Rename a conversation
  rename: (id, title) => api.patch(`/api/chat/conversations/${id}/`, { title }),

  // Sending a message in a conversation
  sendMessage: (id, message, model = "mistral") =>
    api.post(`/api/chat/conversations/${id}/messages/`, {
      message,
      model,
    }),
};

// API for users
export const userApi = {
  // Get current user information
  getCurrentUser: () => api.get("/api/accounts/current-user/"),

  // Update user preferences
  updatePreferences: (preferences) =>
    api.patch("/api/accounts/settings/", { preferences }),

  // Get user preferences
  getPreferences: () => api.get("/api/accounts/settings/"),
};

export default api;
