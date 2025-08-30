// frontend/src/store/authStore.ts
import { create } from "zustand";
import type { AuthState, User } from "../types/auth";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: (userData: User, token: string) =>
    set(() => ({
      user: userData,
      token,
      isAuthenticated: true,
    })),

  logout: () =>
    set(() => ({
      user: null,
      token: null,
      isAuthenticated: false,
    })),
}));
