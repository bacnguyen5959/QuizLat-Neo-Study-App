import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSrsStore } from '../../store/srsStore';
import { useDeckStore } from '../../store/deckStore';
import { Ionicons } from '@expo/vector-icons';
import { playMediumImpact, playSuccess, playLightImpact } from '../../utils/haptics';
import { GridBackground } from '../../components/GridBackground';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';

export function MistakeReviewScreen({ navigation: propNavigation }: any) {
  const hookNavigation = useNavigation<any>();
  const navigation = propNavigation || hookNavigation;
  const reviews = useSrsStore(s => s.reviews);
  const addOrUpdateReview = useSrsStore(s => s.addOrUpdateReview);
  const decks = useDeckStore(s => s.decks);
  const insets = useSafeAreaInsets();
  
  const [sessionReviews] = useState(() => {
    const now = Date.now();
    return reviews.filter(r => r.nextReviewDate <= now);
  });
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  
  // Boss Fight State
  const [playerHp, setPlayerHp] = useState(100);
  const [bossHp, setBossHp] = useState(100);
  const [isGameOver, setIsGameOver] = useState(false);
  const [bossAnim] = useState(new Animated.Value(1));
  const [shakeAnim] = useState(new Animated.Value(0));

  const isVictory = sessionReviews.length === 0 || currentIndex >= sessionReviews.length;

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

  useEffect(() => {
    if ((isGameOver || isVictory) && sound) {
      sound.stopAsync().catch(() => {});
      setIsPlayingMusic(false);
    }
  }, [isGameOver, isVictory, sound]);

  // Boss floating animation
  useEffect(() => {
    if (isGameOver || isVictory) return;

    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(bossAnim, { toValue: 1.1, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(bossAnim, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
      ])
    );
    anim.start();

    return () => {
      anim.stop();
    };
  }, [isGameOver, isVictory]);

  const triggerBossHit = () => {
    Animated.sequence([
      Animated.timing(bossAnim, { toValue: 0.8, duration: 100, useNativeDriver: true }),
      Animated.timing(bossAnim, { toValue: 1, duration: 100, useNativeDriver: true })
    ]).start();
  };

  const triggerCameraShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true })
    ]).start();
  };

  const currentCard = sessionReviews[currentIndex] || { question: '', answer: '', cardId: '', deckId: '' };
  const currentDeck = currentCard.deckId ? decks.find(d => d.deckId === currentCard.deckId) : null;
  const deckName = currentDeck ? currentDeck.name : "Boss Fight Mode";

  const handleAnswer = (correct: boolean) => {
    const card = sessionReviews[currentIndex];
    if (!card) return;

    if (correct) {
      playSuccess();
      triggerBossHit();
      setBossHp(prev => Math.max(0, prev - (100 / sessionReviews.length)));
    } else {
      playMediumImpact();
      const newHp = Math.max(0, playerHp - 25); // 4 mistakes = death
      setPlayerHp(newHp);
      if (newHp === 0) {
        addOrUpdateReview(card, false);
        setIsGameOver(true);
        return;
      }
      triggerCameraShake();
    }
    
    addOrUpdateReview(card, correct);
    setCurrentIndex(i => Math.min(sessionReviews.length, i + 1));
    setShowAnswer(false);
  };

  if (isVictory) {
    return (
      <View className="flex-1 bg-[#F8FAFC] dark:bg-slate-900 relative" style={{ paddingBottom: insets.bottom }}>
        <GridBackground />
        <View className="flex-1 justify-center items-center px-6" style={{ paddingTop: insets.top }}>
          <View className="w-32 h-32 bg-yellow-400 border-8 border-slate-900 justify-center items-center -rotate-12 mb-10 shadow-[16px_16px_0_#0F172A]">
            <Ionicons name="trophy" size={64} color="#0F172A" />
          </View>
          <Text className="text-5xl font-black text-slate-900 dark:text-white mt-6 mb-4 uppercase tracking-tighter text-center">Victory!</Text>
          <View className="bg-white border-4 border-slate-900 p-4 mb-10 -rotate-2">
            <Text className="text-center font-bold text-slate-900 text-lg uppercase">Đã tiêu diệt Quái Thú Lãng Quên</Text>
          </View>
          <TouchableOpacity 
            className="bg-emerald-400 px-8 py-5 border-4 border-slate-900 w-full items-center active:translate-y-1 active:translate-x-1 shadow-[8px_8px_0_#0F172A] active:shadow-none" 
            onPress={() => {
              if (sound) {
                sound.stopAsync().catch(() => {});
              }
              navigation.goBack();
            }}
            activeOpacity={1}
          >
            <Text className="text-slate-900 font-black text-xl uppercase tracking-widest">Lĩnh Thưởng</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (isGameOver) {
    return (
      <View className="flex-1 bg-[#F8FAFC] dark:bg-slate-900 relative" style={{ paddingBottom: insets.bottom }}>
        <GridBackground />
        <View className="flex-1 bg-red-600 justify-center items-center px-6" style={{ paddingTop: insets.top }}>
          <View className="w-32 h-32 bg-slate-900 border-8 border-white justify-center items-center rotate-12 mb-10 shadow-[16px_16px_0_#FFFFFF]">
            <Ionicons name="skull" size={64} color="#EF4444" />
          </View>
          <Text className="text-5xl font-black text-white mt-6 mb-4 uppercase tracking-tighter text-center">Defeat!</Text>
          <View className="bg-slate-900 border-4 border-white p-4 mb-10 rotate-2">
            <Text className="text-center font-bold text-red-500 text-lg uppercase">Sinh lực cạn kiệt</Text>
          </View>
          <TouchableOpacity 
            className="bg-white px-8 py-5 border-4 border-slate-900 w-full items-center active:translate-y-1 active:translate-x-1 shadow-[8px_8px_0_#0F172A] active:shadow-none" 
            onPress={() => {
              if (sound) {
                sound.stopAsync().catch(() => {});
              }
              navigation.goBack();
            }}
            activeOpacity={1}
          >
            <Text className="text-red-600 font-black text-xl uppercase tracking-widest">Chịu Thua</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F8FAFC] dark:bg-slate-900 relative" style={{ paddingBottom: insets.bottom }}>
      <GridBackground />
      {/* Brutalist Header */}
      <View 
        className="px-5 pb-4 border-b-4 border-slate-900 bg-red-500 flex-row items-center justify-between"
        style={{ paddingTop: Math.max(insets.top, 24) + 12 }}
      >
        <View className="flex-1 mr-4">
          <Text className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-1" numberOfLines={1}>ÔN TẬP SRS</Text>
          <Text className="text-white font-bold uppercase text-xs tracking-widest" numberOfLines={1}>{deckName}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity 
            className="w-10 h-10 bg-white border-4 border-slate-900 items-center justify-center active:translate-y-1 active:translate-x-1 shadow-[2px_2px_0_#0F172A] active:shadow-none"
            onPress={toggleMusic}
            activeOpacity={1}
          >
            <Ionicons name={isPlayingMusic ? "musical-notes" : "volume-mute"} size={20} color="#0F172A" />
          </TouchableOpacity>
          <TouchableOpacity 
            className="w-10 h-10 bg-white border-4 border-slate-900 items-center justify-center active:translate-y-1 active:translate-x-1 shadow-[2px_2px_0_#0F172A] active:shadow-none"
            onPress={() => { 
              playMediumImpact(); 
              if (sound) {
                sound.stopAsync().catch(() => {});
              }
              navigation.goBack(); 
            }}
            activeOpacity={1}
          >
            <Ionicons name="close" size={24} color="#0F172A" />
          </TouchableOpacity>
        </View>
      </View>

      <Animated.View style={{ transform: [{ translateX: shakeAnim }] }} className="flex-1 p-6 flex-col justify-between">
        
        {/* Boss Section */}
        <View className="items-center mb-6">
          <Animated.View style={{ transform: [{ scale: bossAnim }] }} className="mb-8 mt-4">
            <View className="w-32 h-32 bg-red-600 border-8 border-slate-900 flex items-center justify-center -rotate-6 relative shadow-[12px_12px_0_#0F172A]">
              <Text className="text-6xl absolute -top-4 -right-4">🐉</Text>
              <View className="w-6 h-6 bg-yellow-400 absolute bottom-2 left-2 border-2 border-slate-900 rotate-45" />
            </View>
          </Animated.View>
          
          <View className="w-full bg-white border-4 border-slate-900 p-4 shadow-[4px_4px_0_#0F172A]">
            <View className="flex-row justify-between mb-2">
              <Text className="text-slate-900 font-black tracking-wider uppercase text-xs">Quái thú Lãng quên (HP)</Text>
              <Text className="text-red-600 font-black text-xs">{Math.ceil(bossHp)}%</Text>
            </View>
            <View className="w-full h-6 bg-slate-200 border-4 border-slate-900 overflow-hidden">
              <View className="h-full bg-red-600" style={{ width: `${bossHp}%` }} />
            </View>
          </View>
        </View>

        {/* Card Section */}
        <View className="flex-1 justify-center w-full my-4">
          <View className="w-full bg-yellow-100 border-8 border-slate-900 p-8 shadow-[8px_8px_0_#0F172A] items-center justify-center min-h-[250px] relative">
            <View className="absolute -top-5 bg-white px-4 py-2 border-4 border-slate-900 -rotate-3">
              <Text className="text-slate-900 font-black text-sm uppercase">Đòn đánh {currentIndex + 1}</Text>
            </View>
            <Text className="text-3xl font-black text-center text-slate-900 uppercase leading-tight tracking-tighter">{currentCard.question}</Text>
            
            {showAnswer && (
              <View className="mt-8 w-full items-center pt-8 border-t-4 border-slate-900 border-dashed">
                <Text className="text-sm text-slate-500 font-black mb-2 uppercase tracking-widest bg-white px-2 py-1 border-2 border-slate-900">Đáp án</Text>
                <Text className="text-2xl font-black text-slate-900 text-center uppercase">{currentCard.answer}</Text>
              </View>
            )}
          </View>
        </View>
        
        {/* Player Section & Controls */}
        <View className="mt-auto">
          {/* Player HP */}
          <View className="w-full bg-white border-4 border-slate-900 p-4 mb-6 shadow-[4px_4px_0_#0F172A]">
            <View className="flex-row justify-between mb-2">
              <Text className="text-slate-900 font-black tracking-wider uppercase text-xs">Sinh lực của bạn (HP)</Text>
              <Text className="text-emerald-500 font-black text-xs">{playerHp}%</Text>
            </View>
            <View className="w-full h-6 bg-slate-200 border-4 border-slate-900 overflow-hidden">
              <View className="h-full bg-emerald-500" style={{ width: `${playerHp}%` }} />
            </View>
          </View>

          {!showAnswer ? (
            <TouchableOpacity 
              className="bg-blue-500 w-full p-6 border-4 border-slate-900 items-center justify-center active:translate-y-1 active:translate-x-1 shadow-[8px_8px_0_#0F172A] active:shadow-none" 
              onPress={() => {
                playLightImpact();
                setShowAnswer(true);
              }}
              activeOpacity={1}
            >
              <Text className="text-white font-black text-2xl uppercase tracking-widest text-center">Đỡ Đòn & Nhìn Thấu</Text>
            </TouchableOpacity>
          ) : (
            <View className="flex-row w-full justify-between gap-4">
              <TouchableOpacity 
                className="bg-slate-300 border-4 border-slate-900 p-5 flex-1 items-center justify-center active:translate-y-1 active:translate-x-1 shadow-[4px_4px_0_#0F172A] active:shadow-none" 
                onPress={() => handleAnswer(false)}
                activeOpacity={1}
              >
                <Text className="text-slate-900 font-black text-lg uppercase tracking-wider text-center">Trượt (Quên)</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="bg-emerald-400 border-4 border-slate-900 p-5 flex-1 items-center justify-center active:translate-y-1 active:translate-x-1 shadow-[4px_4px_0_#0F172A] active:shadow-none" 
                onPress={() => handleAnswer(true)}
                activeOpacity={1}
              >
                <Text className="text-slate-900 font-black text-lg uppercase tracking-wider text-center">Chém (Nhớ)</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animated.View>
    </View>
  );
}

