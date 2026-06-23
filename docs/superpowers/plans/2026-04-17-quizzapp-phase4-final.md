# QuizzAppMobile Phase 4: Gamification & SRS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hoàn thiện MVP với các tính năng: Profile (Quản lý Auth & Streak), Progress (Thống kê tiến độ học tập), và Mistake Review (Hệ thống SRS lược giản để ôn lại thẻ). 

**Architecture:** 
- `userStore`: Cập nhật logic để xử lý Streak (chuỗi ngày học liên tiếp) dựa trên `lastActiveDate`.
- `srsStore`: Quản lý danh sách các thẻ "Cần ôn lại" (Mistakes) dựa trên hệ số độ khó (ease) và khoảng thời gian (interval).
- `ProfileScreen`: Hiển thị thông tin người dùng, chuỗi Streak hiện tại, và nút Đăng xuất.
- `ProgressScreen`: Hiển thị tổng số thẻ đã học, tổng số bộ thẻ.
- `MistakeReviewScreen`: Giao diện tương tự Quiz nhưng dành riêng cho những thẻ nằm trong danh sách SRS đến hạn.

---

### Task 1: SRS & Streak Zustand Stores

**Files:**
- Create: `src/store/srsStore.ts`
- Modify: `src/store/authStore.ts`

- [ ] **Step 1: Implement SRS Store**
`src/store/srsStore.ts`
```typescript
import { create } from 'zustand';

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
  addOrUpdateReview: (item: ReviewItem, isCorrect: boolean) => void;
  getDueReviews: () => ReviewItem[];
}

export const useSrsStore = create<SRSState>((set, get) => ({
  reviews: [],
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
      
      if (existing >= 0) {
        const newReviews = [...state.reviews];
        newReviews[existing] = newReview;
        return { reviews: newReviews };
      }
      return { reviews: [...state.reviews, newReview] };
    });
  },
  getDueReviews: () => {
    const now = Date.now();
    return get().reviews.filter(r => r.nextReviewDate <= now);
  }
}));
```

- [ ] **Step 2: Add Streak Logic to AuthStore**
Update `src/store/authStore.ts` to add streak fields.
```typescript
import { create } from 'zustand';

interface User {
  uid: string;
  email?: string | null;
}

interface AuthState {
  user: User | null;
  currentStreak: number;
  lastActiveDate: number;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  updateStreak: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  currentStreak: 0,
  lastActiveDate: 0,
  isLoading: false,
  setUser: (user) => set({ user }),
  updateStreak: () => {
    const state = get();
    const now = new Date();
    const lastActive = new Date(state.lastActiveDate);
    
    const isToday = now.toDateString() === lastActive.toDateString();
    
    // Check if difference is 1 day
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
}));
```

- [ ] **Step 3: Commit**
```bash
git add .
git commit -m "feat: add srs store and streak logic"
```

### Task 2: Profile & Progress Screens

**Files:**
- Create: `src/screens/ProfileScreen.tsx`
- Create: `src/screens/ProgressScreen.tsx`
- Modify: `App.tsx`

- [ ] **Step 1: Implement Profile Screen**
`src/screens/ProfileScreen.tsx`
```tsx
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../store/authStore';

export function ProfileScreen() {
  const { currentStreak, updateStreak, user } = useAuthStore();

  useEffect(() => {
    updateStreak();
  }, []);

  return (
    <View className="flex-1 bg-gray-50 p-6 items-center">
      <View className="w-24 h-24 bg-blue-100 rounded-full items-center justify-center mb-4">
        <Text className="text-4xl">👤</Text>
      </View>
      <Text className="text-2xl font-bold text-gray-800 mb-8">{user?.email || 'Guest User'}</Text>

      <View className="bg-white w-full p-6 rounded-2xl shadow-sm border border-gray-100 items-center mb-6">
        <Text className="text-4xl mb-2">🔥</Text>
        <Text className="text-3xl font-extrabold text-orange-500">{currentStreak}</Text>
        <Text className="text-gray-500 font-medium mt-1">Ngày học liên tiếp</Text>
      </View>

      <TouchableOpacity className="bg-red-50 w-full p-4 rounded-xl border border-red-200 items-center mt-auto">
        <Text className="text-red-600 font-bold text-lg">Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
}
```

- [ ] **Step 2: Implement Progress Screen**
`src/screens/ProgressScreen.tsx`
```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useDeckStore } from '../store/deckStore';
import { useFlashcardStore } from '../store/flashcardStore';
import { useSrsStore } from '../store/srsStore';

export function ProgressScreen() {
  const decks = useDeckStore(s => s.decks);
  const totalCards = useFlashcardStore(s => s.cards.length);
  const dueReviews = useSrsStore(s => s.getDueReviews().length);

  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-3xl font-bold text-gray-800 mb-8">Thống Kê</Text>
      
      <View className="flex-row flex-wrap justify-between">
        <View className="w-[48%] bg-blue-50 p-6 rounded-2xl mb-4 border border-blue-100">
          <Text className="text-3xl font-bold text-blue-600">{decks.length}</Text>
          <Text className="text-gray-600 mt-2 font-medium">Bộ thẻ</Text>
        </View>

        <View className="w-[48%] bg-purple-50 p-6 rounded-2xl mb-4 border border-purple-100">
          <Text className="text-3xl font-bold text-purple-600">{totalCards}</Text>
          <Text className="text-gray-600 mt-2 font-medium">Tổng số thẻ</Text>
        </View>

        <View className="w-full bg-red-50 p-6 rounded-2xl border border-red-100">
          <Text className="text-3xl font-bold text-red-600">{dueReviews}</Text>
          <Text className="text-gray-600 mt-2 font-medium">Thẻ cần ôn lại (SRS)</Text>
        </View>
      </View>
    </View>
  );
}
```

- [ ] **Step 3: Update App.tsx**
Import new screens and add them to the navigation stack. We will add a bottom tab navigator or just buttons on DeckList to navigate to Profile/Progress.
For MVP speed, we'll add header buttons to `DeckListScreen`.

In `src/screens/DeckListScreen.tsx`, update to add navigation to Profile and Progress:
```tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useDeckStore } from '../store/deckStore';
import { useNavigation } from '@react-navigation/native';

export function DeckListScreen() {
  const { decks } = useDeckStore();
  const navigation = useNavigation<any>();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View className="flex-row">
          <TouchableOpacity onPress={() => navigation.navigate('Progress')} className="mr-4"><Text className="text-blue-600 font-bold">Thống kê</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}><Text className="text-blue-600 font-bold">Hồ sơ</Text></TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  return (
    // ...existing flatlist and create button...
```

- [ ] **Step 4: Commit**
```bash
git add .
git commit -m "feat: add profile and progress screens"
```

### Task 3: Mistake Review Screen (SRS)

**Files:**
- Create: `src/screens/MistakeReviewScreen.tsx`
- Modify: `App.tsx`
- Modify: `src/screens/DeckListScreen.tsx`

- [ ] **Step 1: Implement Mistake Review**
`src/screens/MistakeReviewScreen.tsx`
```tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSrsStore } from '../store/srsStore';

export function MistakeReviewScreen() {
  const navigation = useNavigation<any>();
  const dueReviews = useSrsStore(s => s.getDueReviews());
  const addOrUpdateReview = useSrsStore(s => s.addOrUpdateReview);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  if (dueReviews.length === 0 || currentIndex >= dueReviews.length) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-6">
        <Text className="text-2xl font-bold text-green-600 mb-4">Tuyệt vời!</Text>
        <Text className="text-center text-gray-600 mb-8">Bạn đã ôn xong toàn bộ thẻ đến hạn hôm nay.</Text>
        <TouchableOpacity className="bg-blue-600 px-6 py-3 rounded-xl" onPress={() => navigation.goBack()}>
          <Text className="text-white font-bold text-lg">Quay về</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentCard = dueReviews[currentIndex];

  const handleAnswer = (correct: boolean) => {
    addOrUpdateReview(currentCard, correct);
    setCurrentIndex(i => i + 1);
    setShowAnswer(false);
  };

  return (
    <View className="flex-1 bg-red-50 p-4 justify-center items-center">
      <Text className="text-red-600 font-bold mb-4">Ôn Tập SRS ({currentIndex + 1}/{dueReviews.length})</Text>
      <Text className="text-xl font-bold mb-8 text-center text-gray-800">{currentCard.question}</Text>
      
      {!showAnswer ? (
        <TouchableOpacity className="bg-blue-600 p-4 rounded-xl w-full items-center" onPress={() => setShowAnswer(true)}>
          <Text className="text-white font-bold text-lg">Hiện đáp án</Text>
        </TouchableOpacity>
      ) : (
        <View className="w-full items-center">
          <Text className="text-2xl font-bold text-green-600 mb-8">{currentCard.answer}</Text>
          <View className="flex-row w-full justify-between gap-4">
            <TouchableOpacity className="bg-red-500 p-4 rounded-xl flex-1 items-center" onPress={() => handleAnswer(false)}>
              <Text className="text-white font-bold text-lg">Vẫn Quên</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-green-500 p-4 rounded-xl flex-1 items-center" onPress={() => handleAnswer(true)}>
              <Text className="text-white font-bold text-lg">Đã Nhớ</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
```

- [ ] **Step 2: Update App.tsx**
Add `Profile`, `Progress`, and `MistakeReview` to the Stack Navigator.

- [ ] **Step 3: Trigger SRS from QuizScreen**
Modify `src/screens/QuizScreen.tsx` to add cards to SRS store when answered incorrectly:
```tsx
import { useSrsStore } from '../store/srsStore';
// ... inside QuizScreen
const addOrUpdateReview = useSrsStore(s => s.addOrUpdateReview);
const handleAnswer = (correct: boolean) => {
  if (correct) {
    setScore(s => s + 1);
  } else {
    // Add to SRS if wrong
    addOrUpdateReview({
      reviewId: currentCard.cardId,
      cardId: currentCard.cardId,
      deckId: currentCard.deckId,
      question: currentCard.question,
      answer: currentCard.answer,
      lastReviewed: 0,
      ease: 2.5,
      interval: 1,
      nextReviewDate: 0
    }, false);
  }
  setShowAnswer(true);
};
```

- [ ] **Step 4: Add Mistake Review Button to DeckList**
If `dueReviews.length > 0`, show a floating alert/button on `DeckListScreen`.

- [ ] **Step 5: Commit**
```bash
git add .
git commit -m "feat: add mistake review screen and integrate srs"
```

## User Review Required
- Mọi thứ đã chuẩn bị để tiến hành ghép các mảnh ghép cuối cùng.
- Tôi đã đưa nút Profile và Progress lên Header của màn hình DeckList.
- Xin hãy review và xác nhận để tôi kích hoạt tiến trình code.
