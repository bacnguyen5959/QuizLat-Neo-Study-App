import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Flashcard {
  cardId: string;
  deckId: string;
  question: string;
  answer: string; // Used for Flashcard mode or explanation in MCQ
  options?: string[]; // E.g., ['A', 'B', 'C', 'D']
  correctOptionIndexes?: number[]; // Indices of correct options
  createdAt: number;
}

interface FlashcardState {
  cards: Flashcard[];
  allUsersCards: Record<string, Flashcard[]>;
  addCard: (card: Flashcard) => void;
  deleteCard: (cardId: string) => void;
  getCardsByDeck: (deckId: string) => Flashcard[];
  deleteCardsByDeckId: (deckId: string) => void;
  switchUser: (newUid: string | null, currentUid: string | null) => void;
}

export const useFlashcardStore = create<FlashcardState>()(
  persist(
    (set, get) => ({
      cards: [],
      allUsersCards: {},
      addCard: (card) => set((state) => ({ cards: [...state.cards, card] })),
      deleteCard: (cardId) => set((state) => ({ cards: state.cards.filter(c => c.cardId !== cardId) })),
      getCardsByDeck: (deckId) => get().cards.filter((c) => c.deckId === deckId),
      deleteCardsByDeckId: (deckId) => set((state) => ({ cards: state.cards.filter(c => c.deckId !== deckId) })),
      switchUser: (newUid, currentUid) => {
        const state = get();
        let newAllUsersCards = { ...state.allUsersCards };
        
        // Save current user cards
        if (currentUid) {
          newAllUsersCards[currentUid] = state.cards;
        }

        if (newUid) {
          // Load new user cards
          set({
            cards: newAllUsersCards[newUid] || [],
            allUsersCards: newAllUsersCards
          });
        } else {
          // Log out -> clear active cards
          set({
            cards: [],
            allUsersCards: newAllUsersCards
          });
        }
      }
    }),
    {
      name: 'flashcard-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
