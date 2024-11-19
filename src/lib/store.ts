import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  animated?: boolean;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

interface Settings {
  theme: 'light' | 'dark' | 'system';
  typingAnimation: boolean;
  typingSpeed: number;
  lmStudioUrl: string;
  activeModel: string;
}

interface AppState {
  chats: Chat[];
  activeChat: string | null;
  settings: Settings;
  setActiveChat: (chatId: string | null) => void;
  addChat: (chat: Chat) => void;
  deleteChat: (chatId: string) => void;
  updateChat: (chatId: string, updates: Partial<Chat>) => void;
  addMessage: (chatId: string, message: Message) => void;
  updateSettings: (settings: Partial<Settings>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      chats: [],
      activeChat: null,
      settings: {
        theme: 'system',
        typingAnimation: true,
        typingSpeed: 30,
        lmStudioUrl: '',
        activeModel: '',
      },
      setActiveChat: (chatId) => set({ activeChat: chatId }),
      addChat: (chat) => set((state) => ({ 
        chats: [...state.chats, chat],
        activeChat: chat.id 
      })),
      deleteChat: (chatId) => set((state) => ({
        chats: state.chats.filter((chat) => chat.id !== chatId),
        activeChat: state.activeChat === chatId ? null : state.activeChat,
      })),
      updateChat: (chatId, updates) => set((state) => ({
        chats: state.chats.map((chat) =>
          chat.id === chatId ? { ...chat, ...updates } : chat
        ),
      })),
      addMessage: (chatId, message) => set((state) => ({
        chats: state.chats.map((chat) =>
          chat.id === chatId
            ? { 
                ...chat, 
                messages: [...chat.messages, { ...message, animated: message.role === 'assistant' }] 
              }
            : chat
        ),
      })),
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings },
      })),
    }),
    {
      name: 'tanimgpt-storage',
    }
  )
);