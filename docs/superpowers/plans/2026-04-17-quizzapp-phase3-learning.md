# QuizzAppMobile Phase 3: Learning UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng luồng học tập hoàn chỉnh: Xem chi tiết Bộ Thẻ, Quản lý Thẻ nhớ, Giao diện học Flashcard (Lật thẻ), Giao diện Quiz (Trắc nghiệm), và Kết quả (Result).

**Architecture:** 
- `flashcardStore`: Quản lý danh sách thẻ thuộc về một bộ thẻ.
- `DeckDetailScreen`: Cầu nối từ danh sách bộ thẻ sang các chế độ học tập, cho phép thêm thẻ mới vào bộ.
- `FlashcardScreen`: Quản lý logic lật thẻ (mặt trước/mặt sau) bằng React Native Animated hoặc Reanimated cơ bản.
- `QuizScreen`: Quản lý luồng câu hỏi trắc nghiệm liên tiếp. Điểm số được tính toán nội bộ trong component.
- `ResultScreen`: Nhận params từ màn hình Quiz/Flashcard để hiển thị tổng kết.

---

### Task 1: Flashcard Zustand Store

**Files:**
- Create: `src/store/flashcardStore.ts`

- [ ] **Step 1: Implement Flashcard Store**
`src/store/flashcardStore.ts`
```typescript
import { create } from 'zustand';

export interface Flashcard {
  cardId: string;
  deckId: string;
  question: string;
  answer: string;
  createdAt: number;
}

interface FlashcardState {
  cards: Flashcard[];
  addCard: (card: Flashcard) => void;
  getCardsByDeck: (deckId: string) => Flashcard[];
}

export const useFlashcardStore = create<FlashcardState>((set, get) => ({
  cards: [],
  addCard: (card) => set((state) => ({ cards: [...state.cards, card] })),
  getCardsByDeck: (deckId) => get().cards.filter((c) => c.deckId === deckId),
}));
```

- [ ] **Step 2: Commit**
```bash
git add src/store/flashcardStore.ts
git commit -m "feat: add flashcard zustand store"
```

### Task 2: Deck Detail Screen

**Files:**
- Create: `src/screens/DeckDetailScreen.tsx`
- Modify: `App.tsx`
- Modify: `src/screens/DeckListScreen.tsx`

- [ ] **Step 1: Implement Deck Detail Screen**
`src/screens/DeckDetailScreen.tsx`
```tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useFlashcardStore } from '../store/flashcardStore';
import { useDeckStore } from '../store/deckStore';

export function DeckDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { deckId } = route.params;
  
  const deck = useDeckStore((s) => s.decks.find((d) => d.deckId === deckId));
  const cards = useFlashcardStore((s) => s.getCardsByDeck(deckId));
  const addCard = useFlashcardStore((s) => s.addCard);

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleAddCard = () => {
    if (!question.trim() || !answer.trim()) return;
    addCard({ cardId: Date.now().toString(), deckId, question, answer, createdAt: Date.now() });
    setQuestion('');
    setAnswer('');
  };

  if (!deck) return <Text className="p-4">Deck not found</Text>;

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <Text className="text-2xl font-bold text-gray-800 mb-2">{deck.name}</Text>
      <Text className="text-gray-600 mb-6">{deck.description}</Text>

      <View className="flex-row justify-between mb-6">
        <TouchableOpacity 
          className="bg-blue-600 p-3 rounded-xl flex-1 mr-2 items-center"
          onPress={() => navigation.navigate('Flashcard', { deckId })}
        >
          <Text className="text-white font-bold">Học Flashcard</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="bg-green-600 p-3 rounded-xl flex-1 ml-2 items-center"
          onPress={() => navigation.navigate('Quiz', { deckId })}
        >
          <Text className="text-white font-bold">Làm Quiz</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-lg font-bold mb-2">Thêm thẻ mới</Text>
      <View className="bg-white p-3 rounded-xl border border-gray-200 mb-6">
        <TextInput className="bg-gray-100 p-2 rounded mb-2" placeholder="Câu hỏi (Mặt trước)" value={question} onChangeText={setQuestion} />
        <TextInput className="bg-gray-100 p-2 rounded mb-2" placeholder="Câu trả lời (Mặt sau)" value={answer} onChangeText={setAnswer} />
        <TouchableOpacity className="bg-gray-800 p-2 rounded items-center" onPress={handleAddCard}>
          <Text className="text-white font-bold">Lưu Thẻ</Text>
        </TouchableOpacity>
      </View>

      <Text className="font-bold mb-2">Danh sách thẻ ({cards.length})</Text>
      <FlatList
        data={cards}
        keyExtractor={(item) => item.cardId}
        renderItem={({ item }) => (
          <View className="bg-white p-3 border-b border-gray-100">
            <Text className="font-semibold">{item.question}</Text>
            <Text className="text-gray-500 text-sm mt-1">{item.answer}</Text>
          </View>
        )}
      />
    </View>
  );
}
```

- [ ] **Step 2: Update App.tsx and DeckListScreen**
In `App.tsx`, add `DeckDetail` to `RootStackParamList` and `Stack.Navigator`.
In `src/screens/DeckListScreen.tsx`, update the `TouchableOpacity` `onPress` to navigate to `DeckDetail`:
```tsx
onPress={() => navigation.navigate('DeckDetail', { deckId: item.deckId })}
```

- [ ] **Step 3: Commit**
```bash
git add .
git commit -m "feat: add deck detail screen and card management"
```

### Task 3: Flashcard Learning Screen

**Files:**
- Create: `src/screens/FlashcardScreen.tsx`
- Modify: `App.tsx`

- [ ] **Step 1: Implement Flashcard UI**
`src/screens/FlashcardScreen.tsx`
```tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useFlashcardStore } from '../store/flashcardStore';

export function FlashcardScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { deckId } = route.params;
  const cards = useFlashcardStore((s) => s.getCardsByDeck(deckId));
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (cards.length === 0) {
    return <View className="flex-1 items-center justify-center p-4"><Text>Không có thẻ nào để học!</Text></View>;
  }

  const currentCard = cards[currentIndex];

  const nextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    } else {
      navigation.replace('Result', { score: cards.length, total: cards.length, type: 'Flashcard' });
    }
  };

  return (
    <View className="flex-1 bg-gray-900 p-4 justify-center items-center">
      <Text className="text-gray-400 absolute top-10">Thẻ {currentIndex + 1} / {cards.length}</Text>
      
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={() => setIsFlipped(!isFlipped)}
        className={`w-full aspect-[3/4] rounded-3xl items-center justify-center p-6 ${isFlipped ? 'bg-blue-50' : 'bg-white'}`}
        style={{ shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 }}
      >
        <Text className="text-3xl font-bold text-center text-gray-800">
          {isFlipped ? currentCard.answer : currentCard.question}
        </Text>
        <Text className="text-gray-400 absolute bottom-6 text-sm">
          Chạm để lật
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        className="absolute bottom-10 bg-blue-600 px-10 py-4 rounded-full"
        onPress={nextCard}
      >
        <Text className="text-white font-bold text-lg">{currentIndex === cards.length - 1 ? 'Hoàn thành' : 'Tiếp theo'}</Text>
      </TouchableOpacity>
    </View>
  );
}
```

- [ ] **Step 2: Commit**
```bash
git add src/screens/FlashcardScreen.tsx App.tsx
git commit -m "feat: add flashcard learning screen"
```

### Task 4: Quiz & Result Screens

**Files:**
- Create: `src/screens/QuizScreen.tsx`
- Create: `src/screens/ResultScreen.tsx`
- Modify: `App.tsx`

- [ ] **Step 1: Implement Result Screen first**
`src/screens/ResultScreen.tsx`
```tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

export function ResultScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { score, total, type } = route.params;

  return (
    <View className="flex-1 bg-white items-center justify-center p-6">
      <Text className="text-4xl font-extrabold text-blue-600 mb-2">Hoàn Thành!</Text>
      <Text className="text-lg text-gray-600 mb-8">Bạn vừa học xong chế độ {type}</Text>
      
      <View className="bg-gray-50 rounded-full w-40 h-40 items-center justify-center border-8 border-green-400 mb-10">
        <Text className="text-3xl font-bold text-gray-800">{score}/{total}</Text>
      </View>

      <TouchableOpacity 
        className="bg-gray-800 w-full p-4 rounded-xl items-center"
        onPress={() => navigation.navigate('DeckList')}
      >
        <Text className="text-white font-bold text-lg">Về Trang Chủ</Text>
      </TouchableOpacity>
    </View>
  );
}
```

- [ ] **Step 2: Implement Quiz Screen**
`src/screens/QuizScreen.tsx`
```tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useFlashcardStore } from '../store/flashcardStore';

export function QuizScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { deckId } = route.params;
  const cards = useFlashcardStore((s) => s.getCardsByDeck(deckId));
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  if (cards.length === 0) return <View className="flex-1 justify-center items-center"><Text>Chưa có thẻ!</Text></View>;

  const currentCard = cards[currentIndex];

  const handleAnswer = (correct: boolean) => {
    if (correct) setScore(s => s + 1);
    setShowAnswer(true);
  };

  const nextQuestion = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(i => i + 1);
      setShowAnswer(false);
    } else {
      navigation.replace('Result', { score, total: cards.length, type: 'Quiz' });
    }
  };

  return (
    <View className="flex-1 bg-gray-50 p-4 justify-center items-center">
      <Text className="text-xl font-bold mb-8 text-center text-gray-800">{currentCard.question}</Text>
      
      {!showAnswer ? (
        <TouchableOpacity className="bg-blue-600 p-4 rounded-xl w-full items-center" onPress={() => handleAnswer(true)}>
          <Text className="text-white font-bold text-lg">Hiện đáp án</Text>
        </TouchableOpacity>
      ) : (
        <View className="w-full items-center">
          <Text className="text-2xl font-bold text-green-600 mb-8">{currentCard.answer}</Text>
          <View className="flex-row w-full justify-between gap-4">
            <TouchableOpacity className="bg-red-500 p-4 rounded-xl flex-1 items-center" onPress={nextQuestion}>
              <Text className="text-white font-bold text-lg">Sai</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-green-500 p-4 rounded-xl flex-1 items-center" onPress={() => { setScore(s=>s+1); nextQuestion(); }}>
              <Text className="text-white font-bold text-lg">Đúng</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
```

- [ ] **Step 3: Update App.tsx**
Add `DeckDetail`, `Flashcard`, `Quiz`, `Result` to the Navigation Stack.

- [ ] **Step 4: Commit**
```bash
git add .
git commit -m "feat: add quiz and result screens"
```

## User Review Required
- Màn hình Quiz hiện tại đang sử dụng kiểu tự chấm điểm (Self-graded) tương tự Anki để giữ ứng dụng đơn giản nhất. Khi người dùng bấm "Hiện đáp án", họ tự chấm Đúng/Sai. Bạn có đồng ý với thiết kế UI đơn giản này cho MVP không?
- Please review and approve this plan.
