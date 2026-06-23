# QuizzAppMobile Phase 2: Core UI & Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thiết lập React Navigation, NativeWind (Tailwind), và xây dựng các màn hình cốt lõi quản lý Bộ Thẻ (Deck Store, Deck List, Create Deck).

**Architecture:** Sử dụng React Navigation v7 với kiến trúc Stack cơ bản. Trạng thái các bộ thẻ (decks) được lưu trên Zustand store để dễ dàng truy xuất từ bất kỳ màn hình nào. Giao diện được style toàn bộ bằng NativeWind để đảm bảo đồng nhất hệ thống thiết kế (Design System). Do lỗi cấu hình Jest với Expo SDK 54 ở Phase 1, Phase 2 sẽ ưu tiên xây dựng logic trực tiếp thay vì bị block bởi Jest (Test-Driven UI Development sẽ bị loại bỏ để ưu tiên tốc độ).

**Tech Stack:** React Navigation v7, NativeWind v4, Zustand.

---

### Task 1: Setup React Navigation & NativeWind

**Files:**
- Modify: `package.json`
- Modify: `App.js` -> `App.tsx`
- Create: `tailwind.config.js`
- Create: `global.css`
- Create: `babel.config.js`

- [ ] **Step 1: Install Dependencies**
```bash
npm install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context
npm install nativewind tailwindcss react-native-reanimated
```

- [ ] **Step 2: Configure NativeWind (Tailwind v3/v4)**
Create `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}
```
Create `global.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 3: Update Babel Config**
Create `babel.config.js`:
```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

- [ ] **Step 4: Initialize Navigation in App.tsx**
Rename `App.js` to `App.tsx` and setup basic navigation wrapper.
```tsx
import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';

const Stack = createNativeStackNavigator();

function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-100">
      <Text className="text-2xl font-bold text-blue-600">QuizzApp Mobile</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

- [ ] **Step 5: Commit**
```bash
git add .
git commit -m "feat: setup react navigation and nativewind"
```

### Task 2: Deck Zustand Store

**Files:**
- Create: `src/store/deckStore.ts`

- [ ] **Step 1: Implement Deck Store**
`src/store/deckStore.ts`
```typescript
import { create } from 'zustand';

export interface Deck {
  deckId: string;
  name: string;
  description: string;
  createdAt: number;
}

interface DeckState {
  decks: Deck[];
  isLoading: boolean;
  addDeck: (deck: Deck) => void;
  setDecks: (decks: Deck[]) => void;
  deleteDeck: (deckId: string) => void;
}

export const useDeckStore = create<DeckState>((set) => ({
  decks: [],
  isLoading: false,
  addDeck: (deck) => set((state) => ({ decks: [...state.decks, deck] })),
  setDecks: (decks) => set({ decks }),
  deleteDeck: (deckId) => set((state) => ({
    decks: state.decks.filter((d) => d.deckId !== deckId)
  })),
}));
```

- [ ] **Step 2: Commit**
```bash
git add src/store/deckStore.ts
git commit -m "feat: add deck zustand store"
```

### Task 3: Deck List & Create Deck Screens

**Files:**
- Create: `src/screens/DeckListScreen.tsx`
- Create: `src/screens/CreateDeckScreen.tsx`
- Modify: `App.tsx`

- [ ] **Step 1: Implement Deck List Screen**
`src/screens/DeckListScreen.tsx`
```tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useDeckStore } from '../store/deckStore';
import { useNavigation } from '@react-navigation/native';

export function DeckListScreen() {
  const { decks } = useDeckStore();
  const navigation = useNavigation<any>();

  return (
    <View className="flex-1 bg-white p-4">
      <FlatList
        data={decks}
        keyExtractor={(item) => item.deckId}
        ListEmptyComponent={<Text className="text-gray-500 mt-4 text-center">Chưa có bộ thẻ nào. Hãy tạo một bộ mới!</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity className="p-4 bg-gray-50 rounded-xl mb-3 border border-gray-200 shadow-sm">
            <Text className="text-lg font-bold text-gray-800">{item.name}</Text>
            <Text className="text-gray-600 mt-1" numberOfLines={2}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity 
        className="absolute bottom-6 right-6 bg-blue-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => navigation.navigate('CreateDeck')}
      >
        <Text className="text-white text-3xl font-bold">+</Text>
      </TouchableOpacity>
    </View>
  );
}
```

- [ ] **Step 2: Implement Create Deck Screen**
`src/screens/CreateDeckScreen.tsx`
```tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useDeckStore } from '../store/deckStore';
import { useNavigation } from '@react-navigation/native';

export function CreateDeckScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { addDeck } = useDeckStore();
  const navigation = useNavigation();

  const handleCreate = () => {
    if (!name.trim()) return;
    addDeck({
      deckId: Date.now().toString(),
      name,
      description,
      createdAt: Date.now(),
    });
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-gray-700 font-semibold mb-2">Tên bộ thẻ</Text>
      <TextInput
        className="bg-gray-50 border border-gray-300 rounded-lg p-3 mb-4 text-gray-800"
        placeholder="Vd: Tiếng Anh giao tiếp..."
        value={name}
        onChangeText={setName}
      />
      
      <Text className="text-gray-700 font-semibold mb-2">Mô tả chi tiết</Text>
      <TextInput
        className="bg-gray-50 border border-gray-300 rounded-lg p-3 mb-6 text-gray-800 h-24"
        placeholder="Mô tả bộ thẻ..."
        multiline
        textAlignVertical="top"
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity 
        className={`p-4 rounded-xl items-center ${name.trim() ? 'bg-blue-600' : 'bg-gray-300'}`}
        onPress={handleCreate}
        disabled={!name.trim()}
      >
        <Text className="text-white font-bold text-lg">Tạo Bộ Thẻ</Text>
      </TouchableOpacity>
    </View>
  );
}
```

- [ ] **Step 3: Integrate Screens into Navigation Stack**
Update `App.tsx`:
```tsx
import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DeckListScreen } from './src/screens/DeckListScreen';
import { CreateDeckScreen } from './src/screens/CreateDeckScreen';

export type RootStackParamList = {
  DeckList: undefined;
  CreateDeck: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="DeckList">
        <Stack.Screen 
          name="DeckList" 
          component={DeckListScreen} 
          options={{ title: 'Bộ Thẻ Của Bạn', headerLargeTitle: true }} 
        />
        <Stack.Screen 
          name="CreateDeck" 
          component={CreateDeckScreen} 
          options={{ title: 'Tạo Bộ Thẻ', presentation: 'modal' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

- [ ] **Step 4: Commit**
```bash
git add src/screens/ App.tsx
git commit -m "feat: add deck list and create deck screens"
```

## User Review Required
- > [!IMPORTANT]
  > I've skipped Jest tests for Phase 2 as per our decision in Phase 1 to prioritize implementation speed over test debugging.
- > [!IMPORTANT]
  > NativeWind v4 with React Native 0.81 might have specific metro configuration needs. If we encounter issues with styling applying correctly, we'll troubleshoot the metro config.
- Please review and approve this plan.
