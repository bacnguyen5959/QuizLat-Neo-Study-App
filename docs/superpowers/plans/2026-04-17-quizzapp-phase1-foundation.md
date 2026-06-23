# QuizzAppMobile Phase 1: Foundation & State Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Khởi tạo dự án Expo Bare workflow, thiết lập Firebase (Auth, Firestore, Storage) và xây dựng Zustand stores với TDD.

**Architecture:** Sử dụng Expo SDK 54 Bare workflow. Khởi tạo Firebase app tập trung trong `src/services/firebase.ts`. Các service sẽ thao tác trực tiếp với Firebase, và trạng thái toàn cục sẽ được quản lý bằng Zustand (`src/store`). Chúng ta sẽ áp dụng TDD sử dụng Jest cho các logic store/services.

**Tech Stack:** Expo SDK 54, Firebase JS SDK, Zustand, Jest.

---

### Task 1: Project Initialization

**Files:**
- Create: `package.json` (via expo-cli)
- Modify: `app.json`

- [ ] **Step 1: Initialize Expo Bare Workflow**

```bash
npx create-expo-app@latest . --template blank
npx expo run:android # (Just to verify bare workflow runs, but skip this for agent execution, we rely on jest)
```

- [ ] **Step 2: Install core dependencies**

```bash
npm install firebase zustand @react-native-async-storage/async-storage
npm install --save-dev jest @testing-library/react-native
```

- [ ] **Step 3: Setup Jest configuration**
Create `jest.config.js`:
```javascript
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ],
};
```
Update `package.json` scripts:
```json
"scripts": {
  "test": "jest"
}
```

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "chore: initialize expo bare workflow with jest, firebase, and zustand"
```

### Task 2: Firebase Configuration

**Files:**
- Create: `src/services/firebase.ts`
- Create: `tests/services/firebase.test.ts`

- [ ] **Step 1: Write the failing test**
`tests/services/firebase.test.ts`
```typescript
import { app, auth, db, storage } from '../../src/services/firebase';

describe('Firebase Service', () => {
  it('should initialize firebase app and export instances', () => {
    expect(app).toBeDefined();
    expect(auth).toBeDefined();
    expect(db).toBeDefined();
    expect(storage).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npm test tests/services/firebase.test.ts`
Expected: FAIL (Cannot find module)

- [ ] **Step 3: Write minimal implementation**
`src/services/firebase.ts`
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "demo-key",
  authDomain: "demo.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo.appspot.com",
  messagingSenderId: "12345",
  appId: "1:12345:web:abcde"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

- [ ] **Step 4: Run test to verify it passes**
Run: `npm test tests/services/firebase.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/services/firebase.ts tests/services/firebase.test.ts
git commit -m "feat: setup firebase initialization"
```

### Task 3: Auth Zustand Store

**Files:**
- Create: `src/store/authStore.ts`
- Create: `tests/store/authStore.test.ts`

- [ ] **Step 1: Write the failing test**
`tests/store/authStore.test.ts`
```typescript
import { useAuthStore } from '../../src/store/authStore';

describe('Auth Store', () => {
  it('should have initial state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it('should set user', () => {
    useAuthStore.getState().setUser({ uid: '123' } as any);
    expect(useAuthStore.getState().user?.uid).toBe('123');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npm test tests/store/authStore.test.ts`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**
`src/store/authStore.ts`
```typescript
import { create } from 'zustand';

interface User {
  uid: string;
  email?: string | null;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
}));
```

- [ ] **Step 4: Run test to verify it passes**
Run: `npm test tests/store/authStore.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/store/authStore.ts tests/store/authStore.test.ts
git commit -m "feat: add auth Zustand store"
```
