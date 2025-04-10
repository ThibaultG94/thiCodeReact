import { create } from "zustand";
import { conversationsApi } from "./api";

export const useConversationStore = create((set, get) => ({
  // State
  conversations: [],
  currentConversation: null,
  loading: false,
  error: null,
  isTyping: false, // For typing animation

  // Actions
  fetchConversations: async () => {
    set({ loading: true, error: null });
    try {
      const response = await conversationsApi.getAll();
      set({ conversations: response.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  fetchConversation: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await conversationsApi.getById(id);
      set({ currentConversation: response.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  createConversation: async (message, model = "mistral") => {
    set({ loading: true, error: null });
    try {
      const response = await conversationsApi.create(message, model);

      // Update conversation list
      set((state) => ({
        conversations: [response.data, ...state.conversations],
        currentConversation: response.data,
        loading: false,
      }));

      return response.data.id;
    } catch (err) {
      set({ error: err.message, loading: false });
      return null;
    }
  },

  deleteConversation: async (id) => {
    set({ loading: true, error: null });
    try {
      await conversationsApi.delete(id);

      // Update status
      set((state) => ({
        conversations: state.conversations.filter((conv) => conv.id !== id),
        currentConversation:
          state.currentConversation?.id === id
            ? null
            : state.currentConversation,
        loading: false,
      }));

      return true;
    } catch (err) {
      set({ error: err.message, loading: false });
      return false;
    }
  },

  renameConversation: async (id, title) => {
    set({ loading: true, error: null });
    try {
      const response = await conversationsApi.rename(id, title);

      // Update status
      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv.id === id ? { ...conv, title } : conv
        ),
        currentConversation:
          state.currentConversation?.id === id
            ? { ...state.currentConversation, title }
            : state.currentConversation,
        loading: false,
      }));

      return true;
    } catch (err) {
      set({ error: err.message, loading: false });
      return false;
    }
  },

  sendMessage: async (id, message, model = "mistral") => {
    set({ isTyping: true, error: null });
    try {
      const response = await conversationsApi.sendMessage(id, message, model);

      // Update current conversation with new messages
      if (get().currentConversation?.id === id) {
        set((state) => ({
          currentConversation: {
            ...state.currentConversation,
            messages: [
              ...state.currentConversation.messages,
              response.data.user_message,
              response.data.ai_message,
            ],
          },
          isTyping: false,
        }));
      }

      return true;
    } catch (err) {
      set({ error: err.message, isTyping: false });
      return false;
    }
  },

  // To simulate the typing animation before receiving the response
  setTyping: (isTyping) => set({ isTyping }),

  // Function to add a user message immediately, then wait for a reply
  sendMessageWithAnimation: async (id, message, model = "mistral") => {
    // Add the user message first, for a better UX
    if (get().currentConversation?.id === id) {
      set((state) => ({
        currentConversation: {
          ...state.currentConversation,
          messages: [
            ...state.currentConversation.messages,
            {
              id: `temp-${Date.now()}`,
              role: "user",
              content: message,
              created_at: new Date().toISOString(),
            },
          ],
        },
        isTyping: true,
      }));
    }

    // Send message to API
    try {
      const response = await conversationsApi.sendMessage(id, message, model);

      // Update with the real API message and add the IA response
      if (get().currentConversation?.id === id) {
        set((state) => ({
          currentConversation: {
            ...state.currentConversation,
            // Replace the user's temporary message and add the IA response
            messages: [
              ...state.currentConversation.messages.filter(
                (msg) => !msg.id.startsWith("temp-")
              ),
              response.data.user_message,
              response.data.ai_message,
            ],
          },
          isTyping: false,
        }));
      }

      return true;
    } catch (err) {
      set({ error: err.message, isTyping: false });
      return false;
    }
  },
}));
