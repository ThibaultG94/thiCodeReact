import axios from 'axios';

// Configuration de base d'axios
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  withCredentials: true,
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si l'erreur est une erreur d'authentification, rediriger vers la page de login
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const endpoints = {
  conversations: {
    list: () => '/chat/conversations/',
    get: (id) => `/chat/conversations/${id}/`,
    messages: (id) => `/chat/conversations/${id}/messages/`,
    archive: (id) => `/chat/conversations/${id}/archive/`,
    restore: (id) => `/chat/conversations/${id}/restore/`,
    updateMetadata: (id) => `/chat/conversations/${id}/update_metadata/`,
  },
};

export default api;
