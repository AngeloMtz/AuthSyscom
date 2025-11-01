import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '@/types/auth';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      tempEmail: null,
      tempUserId: null,
      tempMetodoVerificacion: null,

      setUser: (user: User | null) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setToken: (token: string | null) =>
        set({ token }),

      setTempData: (email: string, userId: number) =>
        set({
          tempEmail: email,
          tempUserId: userId,
        }),

      setTempMetodo: (metodo: 'email' | 'sms') =>
        set({
          tempMetodoVerificacion: metodo,
        }),

      clearTempData: () =>
        set({
          tempEmail: null,
          tempUserId: null,
          tempMetodoVerificacion: null,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          tempEmail: null,
          tempUserId: null,
          tempMetodoVerificacion: null,
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);