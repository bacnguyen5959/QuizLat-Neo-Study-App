import { db, auth } from './firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { Deck } from '../store/deckStore';
import { Flashcard } from '../store/flashcardStore';

// Generate a random 6-character alphanumeric code
const generateShareCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const syncDeckToCloud = async (deck: Deck, flashcards: Flashcard[], isPublicWrite?: boolean): Promise<string | undefined> => {
  if (!auth.currentUser) throw new Error("Vui lòng đăng nhập để đồng bộ.");

  const userId = auth.currentUser.uid;
  const userEmail = auth.currentUser.email || '';
  const userName = userEmail ? userEmail.split('@')[0] : 'Cộng đồng';
  const deckRef = doc(db, 'decks', deck.deckId);
  
  const updatedDeck = { ...deck };
  if (isPublicWrite) {
    updatedDeck.isPublic = true;
    if (!updatedDeck.shareCode) {
      updatedDeck.shareCode = generateShareCode();
    }
  }

  // Set deck data
  await setDoc(deckRef, {
    ...updatedDeck,
    userId,
    creatorEmail: userEmail,
    creatorName: userName,
  }, { merge: true });

  // Sync flashcards
  const batchPromises = flashcards.map(card => {
    const cardRef = doc(db, 'flashcards', card.cardId);
    return setDoc(cardRef, {
      ...card,
      userId,
    });
  });

  await Promise.all(batchPromises);

  return updatedDeck.shareCode;
};

export const makeDeckPublic = async (deckId: string): Promise<string> => {
  if (!auth.currentUser) throw new Error("Vui lòng đăng nhập để chia sẻ.");
  
  const deckRef = doc(db, 'decks', deckId);
  const deckSnap = await getDoc(deckRef);

  if (!deckSnap.exists()) {
    throw new Error("Bộ thẻ chưa được đồng bộ lên Cloud. Vui lòng thử lại.");
  }

  const deckData = deckSnap.data();
  if (deckData.shareCode && deckData.isPublic) {
    return deckData.shareCode; // Already shared
  }

  // Ensure unique share code? For simplicity, we just generate one. Collision chance is low.
  const shareCode = generateShareCode();

  await updateDoc(deckRef, {
    isPublic: true,
    shareCode
  });

  return shareCode;
};

export const importDeckFromCode = async (shareCode: string): Promise<{ deck: Deck, flashcards: Flashcard[] }> => {
  if (!auth.currentUser) throw new Error("Vui lòng đăng nhập để tải bộ thẻ.");

  const q = query(collection(db, 'decks'), where('shareCode', '==', shareCode), where('isPublic', '==', true));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error("Mã chia sẻ không hợp lệ hoặc bộ thẻ đã bị xóa.");
  }

  const deckDoc = querySnapshot.docs[0];
  const sourceDeckData = deckDoc.data() as Deck;

  // Get flashcards
  const cardsQuery = query(collection(db, 'flashcards'), where('deckId', '==', sourceDeckData.deckId));
  const cardsSnapshot = await getDocs(cardsQuery);

  const sourceCards: Flashcard[] = [];
  cardsSnapshot.forEach(doc => {
    sourceCards.push(doc.data() as Flashcard);
  });

  // Create clone with new IDs
  const newDeckId = Date.now().toString();
  const clonedDeck: Deck = {
    ...sourceDeckData,
    deckId: newDeckId,
    name: `${sourceDeckData.name} (Copy)`
  };

  const clonedCards: Flashcard[] = sourceCards.map((card, index) => ({
    ...card,
    cardId: `${Date.now()}_${index}`,
    deckId: newDeckId,
  }));

  return { deck: clonedDeck, flashcards: clonedCards };
};

// --- GAMIFICATION ---

export const updateUserEXP = async (expToAdd: number) => {
  if (!auth.currentUser) return; // Silent return if guest
  const userId = auth.currentUser.uid;
  const userRef = doc(db, 'users', userId);

  try {
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const currentExp = userSnap.data().exp || 0;
      await updateDoc(userRef, {
        exp: currentExp + expToAdd,
        email: auth.currentUser.email,
        lastUpdated: Date.now()
      });
    } else {
      await setDoc(userRef, {
        exp: expToAdd,
        email: auth.currentUser.email,
        lastUpdated: Date.now()
      });
    }
  } catch (error) {
    console.warn("Lỗi cập nhật EXP:", error);
  }
};

export const getLeaderboard = async () => {
  try {
    const q = query(collection(db, 'users'), where('exp', '>', 0));
    const querySnapshot = await getDocs(q);
    
    let users: any[] = [];
    querySnapshot.forEach(docSnap => {
      users.push({ id: docSnap.id, ...docSnap.data() });
    });

    // Sort descending by exp and take top 10
    users.sort((a, b) => b.exp - a.exp);
    return users.slice(0, 10);
  } catch (error) {
    console.warn("Lỗi lấy Leaderboard:", error);
    return [];
  }
};

import { HARDCODED_PUBLIC_DECKS } from '../utils/publicDecksData';

export const getPublicDecks = async (): Promise<Deck[]> => {
  if (!auth.currentUser) throw new Error("Vui lòng đăng nhập để xem danh sách cộng đồng.");

  const q = query(collection(db, 'decks'), where('isPublic', '==', true));
  const querySnapshot = await getDocs(q);

  const decks: Deck[] = [...HARDCODED_PUBLIC_DECKS];
  querySnapshot.forEach(docSnap => {
    decks.push(docSnap.data() as Deck);
  });

  return decks;
};

import { HARDCODED_PUBLIC_CARDS } from '../utils/publicDecksData';

export const importDeckById = async (sourceDeckId: string): Promise<{ deck: Deck, flashcards: Flashcard[] }> => {
  if (!auth.currentUser) throw new Error("Vui lòng đăng nhập để tải bộ thẻ.");

  let sourceDeckData: Deck;
  let sourceCards: Flashcard[] = [];

  const hardcodedDeck = HARDCODED_PUBLIC_DECKS.find(d => d.deckId === sourceDeckId);
  
  if (hardcodedDeck) {
    sourceDeckData = hardcodedDeck;
    const rawCards = HARDCODED_PUBLIC_CARDS[sourceDeckId] || [];
    sourceCards = rawCards.map((c, idx) => ({
      cardId: `${sourceDeckId}_${idx}`,
      deckId: sourceDeckId,
      question: c[0],
      answer: c[1],
      createdAt: Date.now() - idx * 1000
    }));
  } else {
    const deckRef = doc(db, 'decks', sourceDeckId);
    const deckSnap = await getDoc(deckRef);

    if (!deckSnap.exists()) {
      throw new Error("Bộ thẻ không tồn tại hoặc đã bị xóa.");
    }

    sourceDeckData = deckSnap.data() as Deck;

    const cardsQuery = query(collection(db, 'flashcards'), where('deckId', '==', sourceDeckData.deckId));
    const cardsSnapshot = await getDocs(cardsQuery);

    cardsSnapshot.forEach(docSnap => {
      sourceCards.push(docSnap.data() as Flashcard);
    });
  }

  // Create clone with new IDs
  const newDeckId = Date.now().toString();
  const clonedDeck: Deck = {
    ...sourceDeckData,
    deckId: newDeckId,
    name: `${sourceDeckData.name} (Tải về)`
  };

  const clonedCards: Flashcard[] = sourceCards.map((card, index) => ({
    ...card,
    cardId: `${Date.now()}_${index}`,
    deckId: newDeckId,
  }));

  return { deck: clonedDeck, flashcards: clonedCards };
};
