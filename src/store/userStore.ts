// src/store/userStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import * as api from '../api/user';
import type { AppNotification, Conversation, Message, Report, Review } from '../types/social';

// ================= MESSAGES STORE =================
interface MessagesState {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
  getConversations: (userId: string) => Promise<void>;
  startConversation: (user1Id: string, user2Id: string) => Promise<Conversation | null>;
  selectConversation: (conversation: Conversation) => Promise<void>;
  sendMessage: (conversationId: string, senderId: string, content: string) => Promise<void>;
  setSelectedConversation: (conversation: Conversation | null) => void;
  clearError: () => void;
}

export const useMessagesStore = create<MessagesState>((set, get) => ({
  conversations: [],
  selectedConversation: null,
  messages: [],
  loading: false,
  error: null,

  getConversations: async (userId) => {
    try {
      set({ loading: true, error: null });
      const res = await api.getUserConversations(userId);
      set({ conversations: res.data?.data || [], loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Error al obtener conversaciones', loading: false });
    }
  },

  startConversation: async (user1Id, user2Id) => {
    try {
      set({ loading: true, error: null });
      const res = await api.createConversation(user1Id, user2Id);
      const conversation = res.data?.data;
      if (!conversation) {
        set({ loading: false });
        return null;
      }

      const exists = get().conversations.some((c) => c._id === conversation._id);
      set({
        conversations: exists ? get().conversations : [conversation, ...get().conversations],
        loading: false,
      });

      await get().selectConversation(conversation);
      return conversation;
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Error al iniciar conversación', loading: false });
      throw error;
    }
  },

  selectConversation: async (conversation) => {
    set({ selectedConversation: conversation, messages: [] });
    try {
      const res = await api.getMessagesByConversation(conversation._id);
      set({ messages: res.data?.data || [] });
    } catch {
      set({ messages: [] });
    }
  },

  sendMessage: async (conversationId, senderId, content) => {
    try {
      const res = await api.sendMessage({ conversationId, senderId, content });
      const newMsg = res.data?.newMessage; // backend-user devuelve "newMessage"
      if (newMsg) set({ messages: [...get().messages, newMsg] });

      set({
        conversations: get().conversations.map((c) =>
          c._id === conversationId ? { ...c, lastMessage: content, lastMessageAt: new Date().toISOString() } : c
        ),
      });
    } catch (error: any) {
      console.error('Error enviando mensaje:', error.response?.data || error.message);
      throw error;
    }
  },

  setSelectedConversation: (conversation) => set({ selectedConversation: conversation }),
  clearError: () => set({ error: null }),
}));

// ================= NOTIFICATIONS STORE =================
interface NotificationsState {
  notifications: AppNotification[];
  readIds: string[];
  loading: boolean;
  error: string | null;
  getNotifications: (userId: string) => Promise<void>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearError: () => void;
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: [],
      readIds: [],
      loading: false,
      error: null,

      getNotifications: async (userId) => {
        try {
          set({ loading: true, error: null });
          const res = await api.getUserNotifications(userId);
          set({ notifications: res.data?.notifications || [], loading: false });
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Error al obtener notificaciones', loading: false });
        }
      },

      markAsRead: (id) => {
        if (get().readIds.includes(id)) return;
        set({ readIds: [...get().readIds, id] });
      },

      markAllAsRead: () => {
        const allIds = get().notifications.map((n) => n._id);
        set({ readIds: Array.from(new Set([...get().readIds, ...allIds])) });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'notifications-read-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// ================= REVIEWS STORE =================
interface ReviewsState {
  given: Review[];
  received: Review[];
  loading: boolean;
  error: string | null;
  getGivenReviews: (userId: string) => Promise<void>;
  getReceivedReviews: (userId: string) => Promise<void>;
  createReview: (data: any) => Promise<{ success: boolean; data?: Review; error?: string }>;
  clearError: () => void;
}

export const useReviewsStore = create<ReviewsState>((set, get) => ({
  given: [],
  received: [],
  loading: false,
  error: null,

  getGivenReviews: async (userId) => {
    try {
      set({ loading: true, error: null });
      const res = await api.getGivenReviews(userId);
      set({ given: res.data?.reviews || [], loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Error al obtener tus reseñas', loading: false });
    }
  },

  getReceivedReviews: async (userId) => {
    try {
      set({ loading: true, error: null });
      const res = await api.getReceivedReviews(userId);
      set({ received: res.data?.reviews || [], loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Error al obtener tus reseñas recibidas', loading: false });
    }
  },

  createReview: async (data) => {
    try {
      set({ loading: true, error: null });
      const res = await api.createReview(data);
      set({ given: [res.data.review, ...get().given], loading: false });
      return { success: true, data: res.data.review };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al crear la reseña';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  clearError: () => set({ error: null }),
}));

// ================= REPORTS STORE =================
interface ReportsState {
  createdReports: Report[];
  loading: boolean;
  error: string | null;
  getMyReports: (userId: string) => Promise<void>;
  createReport: (data: any) => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
}

export const useReportsStore = create<ReportsState>((set, get) => ({
  createdReports: [],
  loading: false,
  error: null,

  getMyReports: async (userId) => {
    try {
      set({ loading: true, error: null });
      const res = await api.getCreatedReports(userId);
      set({ createdReports: res.data?.reports || [], loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Error al obtener tus reportes', loading: false });
    }
  },

  createReport: async (data) => {
    try {
      set({ loading: true, error: null });
      const res = await api.createReport(data);
      set({ createdReports: [res.data.report, ...get().createdReports], loading: false });
      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al enviar el reporte';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  clearError: () => set({ error: null }),
}));