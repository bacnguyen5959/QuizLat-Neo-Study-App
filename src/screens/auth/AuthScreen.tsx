import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDeckStore } from '../../store/deckStore';
import { useFlashcardStore } from '../../store/flashcardStore';
import { auth, db } from '../../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuthErrorMessage } from '../../utils/authErrors';
import { HARDCODED_PUBLIC_DECKS, HARDCODED_PUBLIC_CARDS } from '../../utils/publicDecksData';
import { useSrsStore } from '../../store/srsStore';
import { GridBackground } from '../../components/GridBackground';

export function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  
  const setUser = useAuthStore((s) => s.setUser);
  const navigation = useNavigation<any>();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Lỗi', 'Địa chỉ email không hợp lệ.');
      return;
    }

    setIsLoading(true);
    try {
      const currentUid = useAuthStore.getState().user?.uid || null;
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const newUid = userCredential.user.uid;
      
      useDeckStore.getState().switchUser(newUid, currentUid);
      useFlashcardStore.getState().switchUser(newUid, currentUid);
      useSrsStore.getState().switchUser(newUid, currentUid);
      
      try {
        const userRef = doc(db, 'users', newUid);
        const userSnap = await getDoc(userRef);
        
        let expValue = 0;
        if (email.toLowerCase() === 'bacxnt2005@gmail.com') {
          expValue = 3450;
        } else if (userSnap.exists() && typeof userSnap.data().exp === 'number') {
          expValue = userSnap.data().exp;
        }

        // Always ensure user document is created or updated in Firestore on successful login
        if (!userSnap.exists() || email.toLowerCase() === 'bacxnt2005@gmail.com') {
          await setDoc(userRef, {
            exp: expValue,
            email: email,
            lastUpdated: Date.now()
          });
        }

        // Synchronize EXP in store
        useAuthStore.getState().setExp(expValue);

        if (email.toLowerCase() === 'bacxnt2005@gmail.com') {
          // Setup advanced demo account local store state
          useAuthStore.setState({
            exp: 3450,
            currentStreak: 12,
            lastActiveDate: Date.now(),
            profile: { displayName: "Bac Demo", avatarUrl: "" }
          });
        }
      } catch (e) {
        console.warn("Warning: Could not sync user doc on login (check Firestore rules):", e);
      }

      // Inject 7 public decks for the specific account if they have no decks
      if (email.toLowerCase() === 'bacxnt2005@gmail.com' && useDeckStore.getState().decks.length === 0) {
        const decksToInject = HARDCODED_PUBLIC_DECKS.slice(0, 7);
        decksToInject.forEach(deck => {
          const newDeckId = "INJECTED_" + deck.deckId;
          useDeckStore.getState().addDeck({
            ...deck,
            deckId: newDeckId,
            userId: newUid,
            createdAt: Date.now()
          } as any);
          
          const cards = HARDCODED_PUBLIC_CARDS[deck.deckId] || [];
          cards.forEach((c, idx) => {
            useFlashcardStore.getState().addCard({
              cardId: newDeckId + "_CARD_" + idx,
              deckId: newDeckId,
              userId: newUid,
              question: c[0],
              answer: c[1],
              createdAt: Date.now() - idx * 1000
            } as any);

            // Inject into SRS as due immediately (for some cards)
            if (idx % 2 === 0) { // Make half of them due immediately
              useSrsStore.setState((s: any) => ({
                reviews: [...s.reviews, {
                  reviewId: "REV_" + newDeckId + "_" + idx,
                  cardId: newDeckId + "_CARD_" + idx,
                  deckId: newDeckId,
                  question: c[0],
                  answer: c[1],
                  lastReviewed: Date.now() - 100000000,
                  ease: 2.5,
                  interval: 1,
                  nextReviewDate: Date.now() - 100000000 
                }]
              }));
            }
          });
        });
      }

      setUser({ uid: newUid, email: userCredential.user.email });
    } catch (error: any) {
      Alert.alert('Đăng nhập thất bại', getAuthErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const getInputStyle = (inputName: string) => {
    const isFocused = focusedInput === inputName;
    return `flex-row items-center bg-white dark:bg-slate-800 rounded-xl px-4 py-4 border-2 transition-all duration-200 ${
      isFocused 
        ? 'border-blue-500' 
        : 'border-slate-200 dark:border-slate-700 border-b-4 border-r-4'
    }`;
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC] dark:bg-slate-900 relative">
      <GridBackground />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 px-8 justify-center"
      >
        <View className="items-center mb-16 mt-10">
          <View className="w-24 h-24 bg-blue-600 rounded-2xl items-center justify-center mb-6 border-4 border-blue-900 dark:border-white shadow-sm rotate-3">
            <Ionicons name="school" size={48} color="white" />
          </View>
          <Text className="text-5xl font-black text-slate-800 dark:text-white tracking-tighter">QuizLat</Text>
          <View className="bg-blue-100 dark:bg-blue-900/40 px-3 py-1 rounded-full mt-3 border-2 border-blue-500">
            <Text className="text-blue-700 dark:text-blue-300 text-sm font-bold tracking-widest uppercase">Neo-Study</Text>
          </View>
        </View>

        <View className="w-full">
          <View className="mb-6">
            <Text className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">Email</Text>
            <View className={getInputStyle('email')} style={focusedInput === 'email' ? { transform: [{translateX: 2}, {translateY: 2}] } : {}}>
              <Ionicons name="mail" size={20} color={focusedInput === 'email' ? '#3B82F6' : '#9CA3AF'} className="mr-3" />
              <TextInput
                placeholder="Nhập địa chỉ email..."
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
                autoCapitalize="none"
                keyboardType="email-address"
                className="flex-1 text-slate-800 dark:text-white font-bold text-base ml-2"
                editable={!isLoading}
              />
            </View>
          </View>

          <View className="mb-2">
            <Text className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">Mật khẩu</Text>
            <View className={getInputStyle('password')} style={focusedInput === 'password' ? { transform: [{translateX: 2}, {translateY: 2}] } : {}}>
              <Ionicons name="key" size={20} color={focusedInput === 'password' ? '#3B82F6' : '#9CA3AF'} className="mr-3" />
              <TextInput
                placeholder="Nhập mật khẩu..."
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
                secureTextEntry
                className="flex-1 text-slate-800 dark:text-white font-bold text-base ml-2"
                editable={!isLoading}
              />
            </View>
          </View>
          
          <View className="flex-row justify-end mt-1">
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} disabled={isLoading}>
              <Text className="text-slate-500 dark:text-slate-400 font-bold underline">Quên mật khẩu?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            className={`bg-blue-600 dark:bg-white py-4 rounded-xl items-center mt-6 flex-row justify-center border-b-4 border-r-4 border-blue-900 dark:border-slate-300 active:translate-y-1 active:translate-x-1 active:border-b-0 active:border-r-0 ${isLoading ? 'opacity-70' : ''}`}
            onPress={handleAuth}
            activeOpacity={1}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white dark:text-slate-900 font-black text-lg uppercase tracking-widest">Đăng Nhập Ngay</Text>
            )}
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center mt-12 bg-white dark:bg-slate-800 p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700">
          <Text className="text-slate-600 dark:text-gray-400 font-bold text-base">Học viên mới? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')} disabled={isLoading}>
            <Text className="text-blue-600 dark:text-blue-400 font-black text-base underline">Đăng ký tham gia</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
