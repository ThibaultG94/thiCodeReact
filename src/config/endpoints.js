// API endpoints configuration
export const endpoints = {
  conversations: {
    list: () => '/api/chat/conversations/',
    create: () => '/api/chat/conversations/',
    get: (id) => `/api/chat/conversations/${id}/`,
    messages: (id) => `/api/chat/conversations/${id}/messages/`,
    archive: (id) => `/api/chat/conversations/${id}/archive/`,
    restore: (id) => `/api/chat/conversations/${id}/restore/`,
    updateMetadata: (id) => `/api/chat/conversations/${id}/update-metadata/`,
  },
  mistral: {
    ask: () => '/api/chat/ask-mistral/',
  },
  accounts: {
    currentUser: () => '/api/accounts/current-user/',
    settings: () => '/api/accounts/settings/',
    login: () => '/api/accounts/api/login/',
    register: () => '/api/accounts/api/register/',
    logout: () => '/api/accounts/api/logout/',
  },
  csrf: () => '/api/csrf/',
}

export default endpoints
