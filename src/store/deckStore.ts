import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Deck {
  deckId: string;
  name: string;
  description: string;
  createdAt: number;
  shareCode?: string;
  isPublic?: boolean;
  creatorName?: string;
  creatorEmail?: string;
}

interface DeckState {
  decks: Deck[];
  allUsersDecks: Record<string, Deck[]>;
  isLoading: boolean;
  addDeck: (deck: Deck) => void;
  setDecks: (decks: Deck[]) => void;
  deleteDeck: (deckId: string) => void;
  switchUser: (newUid: string | null, currentUid: string | null) => void;
}

export const useDeckStore = create<DeckState>()(
  persist(
    (set, get) => ({
      decks: [],
      allUsersDecks: {},
      isLoading: false,
      addDeck: (deck) => set((state) => ({ decks: [...state.decks, deck] })),
      setDecks: (decks) => set({ decks }),
      deleteDeck: (deckId) => set((state) => ({
        decks: state.decks.filter((d) => d.deckId !== deckId)
      })),
      switchUser: (newUid, currentUid) => {
        const state = get();
        let newAllUsersDecks = { ...state.allUsersDecks };
        
        // Save current user decks
        if (currentUid) {
          newAllUsersDecks[currentUid] = state.decks;
        }

        if (newUid) {
          // Load new user decks
          set({
            decks: newAllUsersDecks[newUid] || [],
            allUsersDecks: newAllUsersDecks
          });
        } else {
          // Log out -> clear active decks
          set({
            decks: [],
            allUsersDecks: newAllUsersDecks
          });
        }
      }
    }),
    {
      name: 'deck-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
