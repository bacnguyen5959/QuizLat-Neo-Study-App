import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  uid: string;
  email?: string | null;
}

interface UserProfile {
  displayName?: string;
  school?: string;
  address?: string;
  birthday?: string;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  profile: UserProfile;
  currentStreak: number;
  lastActiveDate: number;
  exp: number;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  updateStreak: () => void;
  addExp: (points: number) => void;
  setExp: (points: number) => void;
  setLoading: (loading: boolean) => void;
  
  // Storage for multi-user offline accounts
  usersData: Record<string, { exp: number, currentStreak: number, lastActiveDate: number, profile: UserProfile }>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: {},
      currentStreak: 0,
      lastActiveDate: 0,
      exp: 0,
      isLoading: false,
      usersData: {},
      setUser: (newUser) => {
        const state = get();
        const currentUid = state.user?.uid;
        
        // If we have a current user, save their data before switching
        let newUsersData = { ...state.usersData };
        if (currentUid) {
          newUsersData[currentUid] = {
            exp: state.exp,
            currentStreak: state.currentStreak,
            lastActiveDate: state.lastActiveDate,
            profile: state.profile
          };
        }

        if (newUser) {
          // Switching to a new user or logging in
          const savedData = newUsersData[newUser.uid];
          set({
            user: newUser,
            usersData: newUsersData,
            exp: savedData?.exp || 0,
            currentStreak: savedData?.currentStreak || 0,
            lastActiveDate: savedData?.lastActiveDate || 0,
            profile: savedData?.profile || {}
          });
        } else {
          // Logging out
          set({
            user: null,
            usersData: newUsersData,
            exp: 0,
            currentStreak: 0,
            lastActiveDate: 0,
            profile: {}
          });
        }
      },
      updateProfile: (profileUpdates) => set((state) => ({ profile: { ...state.profile, ...profileUpdates } })),
      addExp: (points) => set((state) => ({ exp: state.exp + points })),
      setExp: (points) => set({ exp: points }),
      updateStreak: () => {
        const state = get();
        if (!state.user) return; // Only track streak if logged in
        
        const now = new Date();
        const lastActive = new Date(state.lastActiveDate);
        
        const isToday = now.toDateString() === lastActive.toDateString();
        
        const oneDay = 24 * 60 * 60 * 1000;
        const isYesterday = (now.getTime() - lastActive.getTime()) < (oneDay * 2) && now.getDate() !== lastActive.getDate();

        if (!isToday) {
          if (isYesterday) {
            set({ currentStreak: state.currentStreak + 1, lastActiveDate: now.getTime() });
          } else {
            set({ currentStreak: 1, lastActiveDate: now.getTime() });
          }
        }
      },
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
