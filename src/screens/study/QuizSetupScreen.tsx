import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Switch, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDeckStore } from '../../store/deckStore';
import { useFlashcardStore } from '../../store/flashcardStore';
import { playMediumImpact, playSuccess } from '../../utils/haptics';

export function QuizSetupScreen({ route, navigation }: any) {
  const { deckId } = route.params;

  const deck = useDeckStore((s) => s.decks.find((d) => d.deckId === deckId));
  const allCards = useFlashcardStore((s) => s.cards);
  const cards = React.useMemo(() => allCards.filter(c => c.deckId === deckId), [allCards, deckId]);

  const maxCards = cards.length;
  const [questionCount, setQuestionCount] = useState(maxCards);
  const [isShuffled, setIsShuffled] = useState(true);
  const [timeLimit, setTimeLimit] = useState<number | null>(null);

  // Heartbeat Animation
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        })
      ])
    );
    anim.start();

    return () => {
      anim.stop();
    };
  }, []);

  if (!deck) return <View className="flex-1 bg-white" />;

  const handleStartQuiz = () => {
    playSuccess();
    navigation.replace('Quiz', { 
      deckId, 
      questionCount, 
      isShuffled,
      timeLimit
    });
  };

  const handleCountSelect = (count: number) => {
    playMediumImpact();
    setQuestionCount(count);
  };

  const handleTimeSelect = (minutes: number | null) => {
    playMediumImpact();
    setTimeLimit(minutes);
  };

  const questionOptions = [10, 20, 30, 40, 50, maxCards];
  const uniqueQuestionOptions = Array.from(new Set(questionOptions)).sort((a, b) => a - b);
  
  const timeOptions = [
    { label: 'Không giới hạn', value: null },
    { label: '15 phút', value: 15 },
    { label: '30 phút', value: 30 },
    { label: '45 phút', value: 45 },
    { label: '60 phút', value: 60 },
    { label: '90 phút', value: 90 },
    { label: '120 phút', value: 120 }
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC] dark:bg-slate-900" edges={['top', 'bottom']}>
      <View className="px-5 pt-6 pb-4 border-b-4 border-slate-900 bg-red-500 dark:bg-slate-800 flex-row items-center justify-between">
        <View>
          <Text className="text-3xl font-black text-white uppercase tracking-tight mb-2">Thông Số</Text>
          <Text className="text-red-100 dark:text-gray-300 font-bold">Cài Đặt Đấu Trường</Text>
        </View>
        <TouchableOpacity 
          className="w-10 h-10 bg-white border-4 border-slate-900 items-center justify-center active:translate-y-1 active:translate-x-1"
          onPress={() => navigation.goBack()}
          activeOpacity={1}
        >
          <Ionicons name="close" size={24} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        <View className="mb-8 items-center mt-2">
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }} className="w-24 h-24 bg-red-100 border-4 border-slate-900 rounded-full items-center justify-center mb-4 shadow-[4px_4px_0_#0F172A]">
            <Ionicons name="heart-half" size={48} color="#EF4444" />
          </Animated.View>
          <Text className="text-xl font-black text-slate-800 dark:text-white text-center uppercase tracking-widest">{deck.name}</Text>
          <Text className="text-slate-500 dark:text-slate-400 font-bold mt-2 uppercase text-xs tracking-widest">Áp lực nhịp tim: {timeLimit ? 'CÓ' : 'KHÔNG'}</Text>
        </View>

        <View className="bg-white dark:bg-slate-800 p-5 rounded-none border-4 border-slate-900 shadow-[4px_4px_0_#0F172A] mb-8">
          <Text className="text-sm font-black text-slate-900 dark:text-white mb-4 uppercase tracking-widest">Băng Đạn (Số lượng)</Text>
          <View className="flex-row flex-wrap gap-3">
            {uniqueQuestionOptions.map((count, index) => {
              const isAll = count === maxCards;
              const displayCount = isAll ? 'Tất cả' : count.toString();
              const isSelected = questionCount === count;
              const isDisabled = !isAll && count > maxCards;
              
              return (
                <TouchableOpacity
                  key={`q-${index}`}
                  className={`px-4 py-3 rounded-none border-4 active:translate-y-1 active:translate-x-1 ${
                    isDisabled ? 'border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-900 opacity-50' :
                    isSelected ? 'border-slate-900 bg-emerald-400 dark:border-white shadow-none translate-x-1 translate-y-1' : 
                    'border-slate-900 dark:border-slate-500 bg-white dark:bg-slate-700 shadow-[2px_2px_0_#0F172A]'
                  }`}
                  onPress={() => handleCountSelect(count)}
                  disabled={isDisabled}
                  activeOpacity={1}
                >
                  <Text className={`font-black text-lg uppercase ${
                    isDisabled ? 'text-slate-400 dark:text-slate-600' :
                    isSelected ? 'text-slate-900 dark:text-slate-900' : 
                    'text-slate-900 dark:text-white'
                  }`}>{displayCount}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View className="bg-white dark:bg-slate-800 p-5 rounded-none border-4 border-slate-900 shadow-[4px_4px_0_#0F172A] mb-8">
          <Text className="text-sm font-black text-slate-900 dark:text-white mb-4 uppercase tracking-widest">Khóa Thời Gian (Đếm ngược)</Text>
          <View className="flex-row flex-wrap gap-3">
            {timeOptions.map((option, index) => {
              const isSelected = timeLimit === option.value;
              return (
                <TouchableOpacity
                  key={`t-${index}`}
                  className={`px-4 py-3 rounded-none border-4 active:translate-y-1 active:translate-x-1 ${
                    isSelected ? 'border-slate-900 bg-amber-400 dark:border-white shadow-none translate-x-1 translate-y-1' : 
                    'border-slate-900 dark:border-slate-500 bg-white dark:bg-slate-700 shadow-[2px_2px_0_#0F172A]'
                  }`}
                  onPress={() => handleTimeSelect(option.value)}
                  activeOpacity={1}
                >
                  <Text className={`font-black text-base uppercase tracking-widest ${
                    isSelected ? 'text-slate-900 dark:text-slate-900' : 'text-slate-900 dark:text-white'
                  }`}>{option.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View className="bg-white dark:bg-slate-800 p-5 rounded-none border-4 border-slate-900 shadow-[4px_4px_0_#0F172A] mb-8 flex-row justify-between items-center">
          <View className="flex-1 pr-4">
            <Text className="text-sm font-black text-slate-900 dark:text-white mb-1 uppercase tracking-widest">Đảo câu hỏi</Text>
            <Text className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Trộn ngẫu nhiên (Khuyên dùng)</Text>
          </View>
          <View className="border-4 border-slate-900 rounded-full bg-white dark:bg-slate-700 p-1">
            <Switch 
              value={isShuffled} 
              onValueChange={(val) => {
                playMediumImpact();
                setIsShuffled(val);
              }} 
              trackColor={{ false: '#E2E8F0', true: '#EF4444' }}
              thumbColor={isShuffled ? '#0F172A' : '#94A3B8'}
            />
          </View>
        </View>

        <TouchableOpacity 
          className={`w-full p-5 rounded-none border-4 border-slate-900 mb-10 items-center justify-center flex-row ${cards.length > 0 ? 'bg-red-500 shadow-[4px_4px_0_#0F172A] active:translate-x-1 active:translate-y-1 active:shadow-none' : 'bg-slate-300 dark:bg-slate-700 opacity-60'}`}
          onPress={handleStartQuiz}
          disabled={cards.length === 0}
          activeOpacity={1}
        >
          <Ionicons name="flame" size={28} color={cards.length > 0 ? "#FFFFFF" : "#0F172A"} className="mr-3" />
          <Text className={`font-black text-xl uppercase tracking-widest ${cards.length > 0 ? 'text-white' : 'text-slate-900'}`}>
            Khai Hỏa
          </Text>
        </TouchableOpacity>
        
      </ScrollView>
    </SafeAreaView>
  );
}
