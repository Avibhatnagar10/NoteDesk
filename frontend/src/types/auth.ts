// frontend/src/types/auth.ts
export interface User {
    id: string;
    username: string;
    email?: string;
  }
  
  export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (userData: User, token: string) => void;
    logout: () => void;
  }
  