import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface User {
  id: number;
  username: string;
  displayName: string | null;
  avatarColor: string | null;
  totalGamesPlayed: number | null;
  totalQuestionsAnswered: number | null;
  totalCorrectAnswers: number | null;
  totalScore: number | null;
  highestStreak: number | null;
  gamesWon: number | null;
  skipPowerUps: number | null;
  doublePointsPowerUps: number | null;
  extraTimePowerUps: number | null;
  createdAt: string | null;
  lastLoginAt: string | null;
}

interface Achievement {
  id: number;
  code: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  requirement: number | null;
  points: number | null;
}

interface UserAchievement {
  id: number;
  odaUserId: number;
  achievementId: number;
  unlockedAt: string | null;
  progress: number | null;
  achievement: Achievement;
}

interface CategoryStat {
  id: number;
  userId: number;
  category: string;
  questionsAnswered: number | null;
  correctAnswers: number | null;
  averageTimeSeconds: number | null;
}

interface GameHistoryEntry {
  id: number;
  odaUserId: number | null;
  gameMode: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  bestStreak: number | null;
  difficulty: string;
  categories: string[] | null;
  duration: number | null;
  playedAt: string | null;
  isWinner: boolean | null;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  achievements: UserAchievement[];
  categoryStats: CategoryStat[];
  recentGames: GameHistoryEntry[];
  
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, displayName?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  loadProfile: () => Promise<void>;
  updateProfile: (updates: { displayName?: string; avatarColor?: string }) => Promise<void>;
  usePowerUp: (type: 'skip' | 'doublePoints' | 'extraTime') => Promise<boolean>;
  recordGame: (gameData: any) => Promise<void>;
  clearError: () => void;
}

export const useAuth = create<AuthState>()(
  subscribeWithSelector((set, get) => ({
    user: null,
    isLoading: true,
    error: null,
    achievements: [],
    categoryStats: [],
    recentGames: [],

    login: async (username: string, password: string) => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (!response.ok) {
          set({ error: data.error, isLoading: false });
          return false;
        }

        set({ user: data.user, isLoading: false });
        await get().loadProfile();
        return true;
      } catch (error) {
        set({ error: "Login failed. Please try again.", isLoading: false });
        return false;
      }
    },

    register: async (username: string, password: string, displayName?: string) => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, displayName }),
        });

        const data = await response.json();
        if (!response.ok) {
          set({ error: data.error, isLoading: false });
          return false;
        }

        set({ user: data.user, isLoading: false });
        return true;
      } catch (error) {
        set({ error: "Registration failed. Please try again.", isLoading: false });
        return false;
      }
    },

    logout: async () => {
      try {
        await fetch("/api/auth/logout", { method: "POST" });
        set({ 
          user: null, 
          achievements: [], 
          categoryStats: [], 
          recentGames: [] 
        });
      } catch (error) {
        console.error("Logout error:", error);
      }
    },

    checkAuth: async () => {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();
        set({ user: data.user, isLoading: false });
        
        if (data.user) {
          await get().loadProfile();
        }
      } catch (error) {
        set({ user: null, isLoading: false });
      }
    },

    loadProfile: async () => {
      const { user } = get();
      if (!user) return;

      try {
        const response = await fetch("/api/user/profile");
        const data = await response.json();
        
        set({
          user: data.user,
          achievements: data.achievements || [],
          categoryStats: data.categoryStats || [],
          recentGames: data.recentGames || [],
        });
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    },

    updateProfile: async (updates) => {
      try {
        const response = await fetch("/api/user/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });

        if (response.ok) {
          const data = await response.json();
          set({ user: data.user });
        }
      } catch (error) {
        console.error("Failed to update profile:", error);
      }
    },

    usePowerUp: async (type) => {
      try {
        const response = await fetch("/api/user/powerup/use", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type }),
        });

        if (response.ok) {
          const { user } = get();
          if (user) {
            const fieldMap = {
              skip: "skipPowerUps",
              doublePoints: "doublePointsPowerUps",
              extraTime: "extraTimePowerUps",
            } as const;
            
            const field = fieldMap[type];
            set({
              user: {
                ...user,
                [field]: Math.max(0, (user[field] || 0) - 1),
              },
            });
          }
          return true;
        }
        return false;
      } catch (error) {
        console.error("Failed to use power-up:", error);
        return false;
      }
    },

    recordGame: async (gameData) => {
      try {
        await fetch("/api/game/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(gameData),
        });

        if (get().user) {
          await get().loadProfile();
        }
      } catch (error) {
        console.error("Failed to record game:", error);
      }
    },

    clearError: () => set({ error: null }),
  }))
);
