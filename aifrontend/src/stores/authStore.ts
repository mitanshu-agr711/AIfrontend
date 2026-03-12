import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  hydrated: boolean; 
  
  setAuth: (accessToken: string, user: User) => void;
  updateAccessToken: (accessToken: string) => void;
  logout: () => void;
  getAccessToken: () => string | null;
  setHydrated: () => void; 
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      hydrated: false, 

      setAuth: (accessToken: string, user: User) => {
        console.log('💾 Setting auth in store:', {
          tokenPreview: accessToken?.substring(0, 20) + '...',
          user: { ...user, _id: user._id?.substring(0, 10) + '...' }
        });
        set({
          accessToken,
          user,
          isAuthenticated: true,
        });
      },

      updateAccessToken: (accessToken: string) => {
        set({ accessToken });
      },

      logout: () => {
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
        });
      },

      getAccessToken: () => {
        const token = get().accessToken;
        if (token) {
          console.log('🔑 Retrieved token from store:', token.substring(0, 20) + '...');
        } else {
          console.log('⚠️ No token found in store');
        }
        return token;
      },
      
      setHydrated: () => set({ hydrated: true }), 
    }),
    {
      name: 'ai-interview-auth',
      storage: createJSONStorage(() => localStorage), 
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated();
        }
      },
    }
  )
);


if (typeof window !== 'undefined') {
  useAuthStore.persist.rehydrate();
}
