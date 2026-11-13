import { create } from "zustand";
import {axiosInstance} from '../lib/axios.ts';

export interface Persona {
  id: string,
  name: string,
  role: string,
  image: string,
}

export interface Message {
  id: string,
  role: "user" | "assistant",
  personaId: string,
  content: string,
  createdAt?: string,
}

interface ChatState {
  selectedPersona: Persona | null,
  messages: Record<string, Message[]>,
  isTyping: boolean,
  setSelectedPersona: (persona: Persona | null) => void,
  sendMessage: (personaId: string, message: string) => void,
  getAllMessages: (persona: Persona) => void,
}

export const ChatStore = create<ChatState>((set)=>({
  selectedPersona: null,
  messages: {},
  isTyping: false,
  setSelectedPersona(persona) {
    set({selectedPersona: persona})
  },

  sendMessage: async (personaId, message) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role:'user',
      personaId: personaId,
      content: message,
      createdAt: new Date().toISOString(),
    }

    set((state) => ({
      messages: {
        ...state.messages,
        [personaId]: [...(state.messages[personaId] || []), userMessage ]
      },
      isTyping: true,
    }))

    try{
      const {data} = await axiosInstance.post('/chat', {userMessage}) 

      set((state) => ({
        messages: {
          ...state.messages,
          [personaId]: [...(state.messages[personaId] || []), data.message ]
        }
      }))

    } catch (err) {
      console.error("Message sending failed:", err);
    } finally {
      set({ isTyping: false })
    }
  },

  getAllMessages: async () => {
    try {
      const { data } = await axiosInstance.get('/chat/messages');
      set({messages: data})
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  },
}))