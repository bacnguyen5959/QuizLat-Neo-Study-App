import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Pressable, useColorScheme, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useFlashcardStore } from '../../store/flashcardStore';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate, Extrapolation, withSequence, configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

import { useAuthStore } from '../../store/authStore';
import { updateUserEXP } from '../../services/firestoreService';
import { playLightImpact } from '../../utils/haptics';

const PASTEL_COLORS = [
  '#A7F3D0', // Emerald
  '#BFDBFE', // Blue
  '#C7D2FE', // Indigo
  '#E9D5FF', // Purple
  '#FBCFE8', // Pink
  '#FECDD3', // Rose
  '#FED7AA', // Orange
  '#FEF08A'  // Yellow
];

const DARK_PASTEL_COLORS = [
  '#064E3B', // Emerald dark
  '#1E3A8A', // Blue dark
  '#312E81', // Indigo dark
  '#581C87', // Purple dark
  '#831843', // Pink dark
  '#881337', // Rose dark
  '#7C2D12', // Orange dark
  '#713F12'  // Yellow dark
];

export function FlashcardScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const deckId = route.params.deckId;
  const allCards = useFlashcardStore((s) => s.cards);
  const cards = React.useMemo(() => allCards.filter(c => c.deckId === deckId), [allCards, deckId]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const spin = useSharedValue(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    spin.value = withTiming(isFlipped ? 1 : 0, { duration: 300 });
  }, [isFlipped]);

  if (cards.length === 0) {
    return (
      <View className="flex-1 bg-neutral-50 dark:bg-neutral-900 items-center justify-center p-4">
        <Ionicons name="folder-open-outline" size={60} color="#9CA3AF" />
        <Text className="text-neutral-500 mt-4 text-lg font-bold uppercase tracking-widest">Trống không</Text>
      </View>
    );
  }

  const currentCard = (cards[currentIndex] || cards[0] || { question: 'Đang tải...', answer: 'Đang tải...' }) as any;
  
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  useEffect(() => {
    let currentSound: Audio.Sound | null = null;
    let isMounted = true;

    async function loadAudio() {
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true }).catch(() => {});
        const { sound: audioSound } = await Audio.Sound.createAsync(
          require('../../../assets/lofi-study.mp3'),
          { shouldPlay: false, isLooping: true, volume: 0.3 }
        );
        
        if (!isMounted) {
          await audioSound.unloadAsync().catch(() => {});
          return;
        }

        currentSound = audioSound;
        setSound(audioSound);
        
        // Auto play
        await audioSound.playAsync().catch(() => {});
        setIsPlayingMusic(true);
      } catch (e) {
        console.warn("Lỗi tải nhạc nền:", e);
      }
    }
    loadAudio();

    return () => {
      isMounted = false;
      if (currentSound) {
        const soundToCleanup = currentSound;
        soundToCleanup.stopAsync()
          .catch(() => {})
          .finally(() => {
            soundToCleanup.unloadAsync().catch(() => {});
          });
      }
    };
  }, []);

  const toggleMusic = async () => {
    if (sound) {
      try {
        if (isPlayingMusic) {
          await sound.pauseAsync();
        } else {
          await sound.playAsync();
        }
        setIsPlayingMusic(!isPlayingMusic);
      } catch (e) {
        console.warn("Lỗi chuyển đổi nhạc:", e);
      }
    }
  };

  const bgColor = isDark 
    ? DARK_PASTEL_COLORS[currentIndex % DARK_PASTEL_COLORS.length]
    : PASTEL_COLORS[currentIndex % PASTEL_COLORS.length];

  const handleFlip = () => {
    playLightImpact();
    setIsFlipped(!isFlipped);
  };

  const chargeAnim = useSharedValue(0);

  const nextCard = () => {
    if (isTransitioning) return;
    playLightImpact();
    // Sonic Charge attack!
    chargeAnim.value = withSequence(
      withTiming(1, { duration: 150 }), // Charge forward
      withTiming(0, { duration: 150 })  // Return
    );

    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((prev) => Math.min(cards.length - 1, prev + 1)), 300);
    } else {
      setIsTransitioning(true);
      setTimeout(() => {
        const earnedExp = cards.length * 2;
        if (earnedExp > 0) {
          useAuthStore.getState().addExp(earnedExp);
          updateUserEXP(earnedExp);
        }
        // Stop sound immediately before navigation replacement
        if (sound) {
          sound.stopAsync().catch(() => {});
        }
        navigation.replace('Result', { score: cards.length, total: cards.length, type: 'Flashcard' });
      }, 300);
    }
  };

  const chargeStyle = useAnimatedStyle(() => {
    // Determine translation distance (e.g. 200px or based on screen width, we use a fixed 280 roughly)
    const distance = 260; 
    return {
      transform: [
        { translateX: interpolate(chargeAnim.value, [0, 1], [0, distance]) }
      ]
    } as any;
  });

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(spin.value, [0, 1], [0, 180], Extrapolation.CLAMP);
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden',
    } as any;
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(spin.value, [0, 1], [180, 360], Extrapolation.CLAMP);
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden',
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
    } as any;
  });

  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-900" edges={['top', 'bottom']}>
      
      {/* Screen Header */}
      <View className="px-5 py-4 border-b-4 border-slate-900 bg-[#C084FC] dark:bg-slate-800 flex-row items-center justify-between z-10">
        <TouchableOpacity 
          onPress={() => {
            if (sound) {
              sound.stopAsync().catch(() => {});
            }
            navigation.goBack();
          }} 
          className="w-10 h-10 border-4 border-slate-900 items-center justify-center rounded-none bg-white shadow-[2px_2px_0_#0F172A] active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          <Ionicons name="close" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text className="text-xl font-black uppercase text-slate-900 dark:text-white tracking-widest">Học Thẻ</Text>
        <View className="w-10 h-10 border-4 border-transparent" />
      </View>

      {/* BOSS BATTLE HEADER BLOCK */}
      <View className="w-full px-6 pt-6 pb-2 z-10 border-b-4 border-slate-900 bg-white dark:bg-slate-800 mb-6">
        
        {/* Title */}
        <Text className="text-slate-900 dark:text-white font-black text-2xl uppercase tracking-widest text-center mb-4">Tiêu Diệt Boss</Text>
        
        {/* Hero vs Boss Arena */}
        <View className="flex-row items-center w-full mb-4 relative z-20">
          <Animated.View style={chargeStyle} className="mr-3 z-30">
            <Image source={require('../../../assets/images/sonic.jpg')} style={{ width: 44, height: 44, resizeMode: 'contain', mixBlendMode: 'multiply' } as any} />
          </Animated.View>
          <View className="flex-1 h-6 border-4 border-neutral-900 dark:border-white bg-neutral-200 dark:bg-neutral-800 shadow-[2px_2px_0_#0F172A] flex-row relative overflow-hidden z-10">
            <View 
              style={{ width: `${((cards.length - currentIndex) / cards.length) * 100}%` }} 
              className="h-full bg-red-500 border-r-4 border-neutral-900 dark:border-white transition-all duration-300"
            />
            <View className="absolute inset-0 items-center justify-center">
              <Text className="text-white dark:text-neutral-900 font-black text-[10px] uppercase tracking-widest mix-blend-difference">Máu Boss</Text>
            </View>
          </View>
          <View className="ml-3 z-20">
            <Image source={require('../../../assets/images/eggman.jpg')} style={{ width: 44, height: 44, resizeMode: 'contain', mixBlendMode: 'multiply' } as any} />
          </View>
        </View>

        {/* Minimal Buttons */}
        <View className="flex-row items-center w-full justify-center gap-6">
          <View className="border-4 border-slate-900 dark:border-white bg-white dark:bg-slate-900 px-6 py-2 shadow-[2px_2px_0_#0F172A]">
            <Text className="text-slate-900 dark:text-white font-black uppercase tracking-widest text-lg">{currentIndex + 1} / {cards.length}</Text>
          </View>
          <TouchableOpacity onPress={toggleMusic} className="w-12 h-12 border-4 border-slate-900 dark:border-white bg-white dark:bg-slate-900 items-center justify-center shadow-[2px_2px_0_#0F172A] active:translate-x-1 active:translate-y-1 active:shadow-none">
            <Ionicons name={isPlayingMusic ? "musical-notes" : "volume-mute"} size={24} color={isDark ? "white" : "black"} />
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-1 px-6 pb-8">
        
        {/* Flashcard Container */}
        <View className="flex-1 w-full justify-center items-center mb-6">
          <Pressable 
            onPress={handleFlip}
            className="w-full aspect-[3/4] max-h-[450px] relative"
          >
          {/* Brutalist Hard Shadow / Offset Background */}
          <View className="absolute top-3 left-3 w-full h-full bg-neutral-900 dark:bg-neutral-100" />

          {/* Front of Card */}
          <Animated.View 
            className="w-full h-full border-4 border-neutral-900 dark:border-white items-center justify-center p-8"
            style={[frontAnimatedStyle, { backgroundColor: bgColor }]}
          >
            <View className="absolute top-6 left-6 border-2 border-neutral-900 dark:border-white bg-white dark:bg-neutral-900 w-10 h-10 items-center justify-center">
              <Text className="text-neutral-900 dark:text-white font-black text-lg">Q</Text>
            </View>
            <Text className="text-4xl font-black text-center text-neutral-900 dark:text-white leading-tight uppercase tracking-tighter">
              {currentCard.question || (currentCard as any).term || "Không có nội dung"}
            </Text>
            <View className="absolute bottom-6 border-b-2 border-neutral-900 dark:border-white pb-1">
              <Text className="text-neutral-900 dark:text-white font-bold uppercase tracking-widest text-xs">
                CHẠM ĐỂ LẬT
              </Text>
            </View>
          </Animated.View>

          {/* Back of Card */}
          <Animated.View 
            className="w-full h-full border-4 border-neutral-900 dark:border-white items-center justify-center p-8 bg-white dark:bg-neutral-800"
            style={backAnimatedStyle}
          >
            <View className="absolute top-6 left-6 border-2 border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white w-10 h-10 items-center justify-center">
              <Text className="text-white dark:text-neutral-900 font-black text-lg">A</Text>
            </View>
            <Text className="text-2xl font-bold text-center text-neutral-900 dark:text-white leading-9">
              {currentCard.options && currentCard.options.length > 0
                ? currentCard.correctOptionIndexes?.map(i => currentCard.options![i]).join(', ')
                : (currentCard.answer || (currentCard as any).definition || "Không có nội dung")}
            </Text>
            {currentCard.options && currentCard.options.length > 0 && currentCard.answer && currentCard.answer !== "Chưa có giải thích" && (
              <View className="mt-6 p-4 border-l-4 border-neutral-900 dark:border-white bg-neutral-100 dark:bg-neutral-700 w-full">
                <Text className="text-neutral-900 dark:text-white font-medium">
                  {currentCard.answer}
                </Text>
              </View>
            )}
            <View className="absolute bottom-6 flex-row items-center">
              <Ionicons name="checkmark-sharp" size={16} color={isDark ? "white" : "black"} className="mr-1" />
              <Text className="text-neutral-900 dark:text-white font-bold uppercase tracking-widest text-xs">
                ĐÃ LẬT
              </Text>
            </View>
          </Animated.View>
          </Pressable>
        </View>

        {/* Bottom Action Buttons */}
        <View className="w-full flex-row justify-center gap-4">
          <TouchableOpacity 
            className="flex-1 bg-red-400 dark:bg-red-600 border-4 border-slate-900 dark:border-white py-4 items-center justify-center active:translate-x-1 active:translate-y-1 shadow-[4px_4px_0_#0F172A] active:shadow-none"
            onPress={nextCard}
            activeOpacity={1}
          >
            <Text className="text-slate-900 dark:text-white font-black text-sm uppercase tracking-widest">Xé bỏ (Quên)</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-1 bg-green-400 dark:bg-green-600 border-4 border-slate-900 dark:border-white py-4 items-center justify-center active:translate-x-1 active:translate-y-1 shadow-[4px_4px_0_#0F172A] active:shadow-none"
            onPress={nextCard}
            activeOpacity={1}
          >
            <Text className="text-slate-900 dark:text-white font-black text-sm uppercase tracking-widest">Ghim lại (Nhớ)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
