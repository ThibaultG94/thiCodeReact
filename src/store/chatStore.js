import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import api, { endpoints } from '../config/api'

const useChatStore = create(devtools((set, get) => ({
  // État
  conversations: [],
  messages: [],
  isLoading: false,
  isTyping: false,
  error: null,
  
  // Actions
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  
  // Chargement des messages d'une conversation
  fetchMessages: async (conversationId) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await api.get(`${endpoints.conversations.get(conversationId)}messages/`)
      set({ messages: data, isLoading: false })
    } catch (error) {
      set({ 
        error: error.response?.data?.error || error.message,
        isLoading: false
      })
      throw error
    }
  },
  
  // Chargement des conversations
  fetchConversations: async () => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await api.get(endpoints.conversations.list())
      set({ conversations: data, isLoading: false })
    } catch (error) {
      set({ error: error.response?.data?.error || error.message, isLoading: false })
      throw error
    }
  },
  
  // Création d'une conversation avec réponse Mistral
  createConversation: async (message) => {
    set({ isLoading: true, error: null })
    
    try {
      // Demander d'abord la réponse à Mistral
      const { data: mistralResponse } = await api.post(endpoints.mistral.ask(), {
        message
      })
      
      // Créer la conversation avec le message initial
      const { data: conversation } = await api.post(endpoints.conversations.create(), {
        initial_message: message
      })
      
      // Mettre à jour le store avec la nouvelle conversation
      set(state => ({
        conversations: [conversation, ...state.conversations],
        currentConversationId: conversation.id,
        messages: conversation.messages || [],
        isLoading: false
      }))
      
      // Ajouter la réponse de Mistral à la conversation
      if (mistralResponse.response) {
        const { data: messageData } = await api.post(endpoints.conversations.messages(conversation.id), {
          content: mistralResponse.response,
          role: 'assistant'
        })
        
        // Mettre à jour les messages dans le store
        set(state => ({
          messages: [...state.messages, messageData],
          isTyping: false
        }))
      }
      
      return conversation
    } catch (error) {
      set({ 
        error: error.response?.data?.error || error.message,
        isLoading: false,
        isTyping: false
      })
      throw error
    }
  },
  
  // Envoi d'un message
  sendMessage: async (conversationId, message, contentType = 'text') => {
    set({ isLoading: true, error: null })
    try {
      // Envoyer le message sans attendre la réponse
      const { data } = await api.post(endpoints.conversations.messages(conversationId), {
        content: message,
        content_type: contentType
      })
      
      const { user_message, status } = data
      
      // Mettre à jour le store avec le message utilisateur
      set(state => ({
        messages: [...state.messages, user_message],
        isLoading: false,
        isTyping: true
      }))
      
      // Si le statut est en attente, commencer à vérifier la réponse
      if (status === 'pending') {
        get().checkMessageStatus(conversationId, user_message.id)
      }
      
      return data
    } catch (error) {
      set({ 
        error: error.response?.data?.error || error.message,
        isLoading: false,
        isTyping: false
      })
      throw error
    }
  },
  
  // Nouvelle fonction pour vérifier le statut d'un message
  checkMessageStatus: async (conversationId, messageId) => {
    const checkStatus = async () => {
      try {
        const { data } = await api.get(`${endpoints.conversations.messages(conversationId)}${messageId}/status/`)
        
        if (data.status === 'completed' && data.ai_message) {
          // Mettre à jour le store avec la réponse AI
          set(state => ({
            messages: [...state.messages, data.ai_message],
            isTyping: false
          }))
          return true
        } else if (data.status === 'error') {
          set({ 
            error: data.error,
            isTyping: false
          })
          return true
        }
        
        return false
      } catch (error) {
        set({ 
          error: error.response?.data?.error || error.message,
          isTyping: false
        })
        return true
      }
    }
    
    // Vérifier toutes les 2 secondes jusqu'à ce qu'il y ait une réponse
    const interval = setInterval(async () => {
      const done = await checkStatus()
      if (done) {
        clearInterval(interval)
      }
    }, 2000)
    
    // Arrêter de vérifier après 5 minutes
    setTimeout(() => {
      clearInterval(interval)
      set({ 
        error: 'La réponse a pris trop de temps',
        isTyping: false
      })
    }, 5 * 60 * 1000)
  },
  
  // Archivage d'une conversation
  archiveConversation: async (conversationId) => {
    set({ isLoading: true, error: null })
    try {
      const { data: updatedConversation } = await api.post(endpoints.conversations.archive(conversationId))
      
      set(state => ({
        conversations: state.conversations.map(conv =>
          conv.id === conversationId ? updatedConversation : conv
        ),
        isLoading: false
      }))
      return updatedConversation
    } catch (error) {
      set({ error: error.response?.data?.error || error.message, isLoading: false })
      throw error
    }
  },
  
  // Restauration d'une conversation
  restoreConversation: async (conversationId) => {
    set({ isLoading: true, error: null })
    try {
      const { data: updatedConversation } = await api.post(endpoints.conversations.restore(conversationId))
      
      set(state => ({
        conversations: state.conversations.map(conv =>
          conv.id === conversationId ? updatedConversation : conv
        ),
        isLoading: false
      }))
      return updatedConversation
    } catch (error) {
      set({ error: error.response?.data?.error || error.message, isLoading: false })
      throw error
    }
  },
  
  // Mise à jour des métadonnées
  updateMetadata: async (conversationId, metadata) => {
    set({ isLoading: true, error: null })
    try {
      const { data: updatedConversation } = await api.post(
        endpoints.conversations.updateMetadata(conversationId),
        metadata
      )
      
      set(state => ({
        conversations: state.conversations.map(conv =>
          conv.id === conversationId ? updatedConversation : conv
        ),
        isLoading: false
      }))
      return updatedConversation
    } catch (error) {
      set({ error: error.response?.data?.error || error.message, isLoading: false })
      throw error
    }
  }
})))

export default useChatStore
