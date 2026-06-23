import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from './authStore';

export interface ReviewItem {
  reviewId: string;
  cardId: string;
  deckId: string;
  question: string;
  answer: string;
  lastReviewed: number;
  ease: number;
  interval: number;
  nextReviewDate: number;
}

interface SRSState {
  reviews: ReviewItem[];
  allUsersReviews: Record<string, ReviewItem[]>;
  addOrUpdateReview: (item: ReviewItem, isCorrect: boolean) => void;
  getDueReviews: () => ReviewItem[];
  deleteReviewsByDeckId: (deckId: string) => void;
  switchUser: (newUid: string | null, currentUid: string | null) => void;
}

export const useSrsStore = create<SRSState>()(
  persist(
    (set, get) => ({
      reviews: [],
      allUsersReviews: {},
      addOrUpdateReview: (item, isCorrect) => {
        // Thuật toán SM-2 lược giản
        let ease = item.ease || 2.5;
        let interval = item.interval || 1;
        
        if (isCorrect) {
          interval = interval === 1 ? 3 : interval * ease;
        } else {
          interval = 1;
          ease = Math.max(1.3, ease - 0.2);
        }

        const nextReviewDate = Date.now() + interval * 24 * 60 * 60 * 1000;
        
        set((state) => {
          const existing = state.reviews.findIndex(r => r.cardId === item.cardId);
          const newReview = { ...item, ease, interval, lastReviewed: Date.now(), nextReviewDate };
          
          let newReviews;
          if (existing >= 0) {
            newReviews = [...state.reviews];
            newReviews[existing] = newReview;
          } else {
            newReviews = [...state.reviews, newReview];
          }

          const currentUid = useAuthStore.getState().user?.uid;
          if (currentUid) {
            return { 
              reviews: newReviews,
              allUsersReviews: { ...state.allUsersReviews, [currentUid]: newReviews }
            };
          }
          return { reviews: newReviews };
        });
      },
      getDueReviews: () => {
        const now = Date.now();
        return get().reviews.filter(r => r.nextReviewDate <= now);
      },
      deleteReviewsByDeckId: (deckId) => set((state) => {
        const newReviews = state.reviews.filter((r) => r.deckId !== deckId);
        const currentUid = useAuthStore.getState().user?.uid;
        if (currentUid) {
          return {
            reviews: newReviews,
            allUsersReviews: { ...state.allUsersReviews, [currentUid]: newReviews }
          };
        }
        return { reviews: newReviews };
      }),
      switchUser: (newUid, currentUid) => {
        const state = get();
        let newAllUsersReviews = { ...state.allUsersReviews };
        
        if (currentUid) {
          newAllUsersReviews[currentUid] = state.reviews;
        }

        if (newUid) {
          set({
            reviews: newAllUsersReviews[newUid] || [],
            allUsersReviews: newAllUsersReviews
          });
        } else {
          set({
            reviews: [],
            allUsersReviews: newAllUsersReviews
          });
        }
      }
    }),
    {
      name: 'srs-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
