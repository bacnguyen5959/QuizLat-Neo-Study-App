import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useFlashcardStore } from '../../store/flashcardStore';
import { useSrsStore } from '../../store/srsStore';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { updateUserEXP } from '../../services/firestoreService';
import { playMediumImpact, playSuccess } from '../../utils/haptics';

const TypewriterText = ({ text, styleClass }: { text: string, styleClass?: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    setDisplayedText('');
    const chars = Array.from(text || '');
    let i = 0;
    const interval = setInterval(() => {
      if (i < chars.length) {
        setDisplayedText(chars.slice(0, i + 1).join(''));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 15); // Faster typewriter
    return () => clearInterval(interval);
  }, [text]);

  return <Text className={styleClass}>{displayedText}<Text className="text-slate-400">_</Text></Text>;
};

export function QuizScreen({ route, navigation }: any) {
  const { deckId, questionCount, isShuffled, timeLimit } = route.params;
  const allCards = useFlashcardStore((s) => s.cards);
  const storeCards = React.useMemo(() => allCards.filter(c => c.deckId === deckId), [allCards, deckId]);
  
  const [cards] = useState(() => {
    let processed = [...storeCards];
    if (isShuffled) {
      processed.sort(() => Math.random() - 0.5);
    }
    if (questionCount && questionCount < processed.length) {
      processed = processed.slice(0, questionCount);
    }
    
    processed = processed.map(card => {
      if (card.options && card.options.length > 0) return card;
      
      const currentAnswer = card.answer || (card as any).definition || "Không có đáp án";
      const currentQuestion = card.question || (card as any).term || "Không có câu hỏi";

      let otherAnswers = storeCards
        .filter(c => c.cardId !== card.cardId)
        .map(c => c.answer || (c as any).definition || "Không có đáp án");
      
      if (otherAnswers.length < 3) {
        const globalAnswers = allCards
          .filter(c => c.cardId !== card.cardId)
          .map(c => c.answer || (c as any).definition || "Không có đáp án");
        otherAnswers = [...otherAnswers, ...globalAnswers];
      }
      
      otherAnswers.sort(() => Math.random() - 0.5);
      const wrongOptions = Array.from(new Set(otherAnswers)).slice(0, 3);
      
      const allOptions = Array.from(new Set([...wrongOptions, currentAnswer]));
      allOptions.sort(() => Math.random() - 0.5);
      const correctIndex = allOptions.indexOf(currentAnswer);
      
      return {
        ...card,
        question: currentQuestion,
        answer: currentAnswer,
        options: allOptions,
        correctOptionIndexes: [correctIndex]
      };
    });
    
    return processed;
  });

  const addOrUpdateReview = useSrsStore(s => s.addOrUpdateReview);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [showGrid, setShowGrid] = useState(false);
  const [seconds, setSeconds] = useState(timeLimit ? timeLimit * 60 : 0);
  const [bookmarked, setBookmarked] = useState<number[]>([]);
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => {
        if (timeLimit) {
          if (s <= 1) {
            clearInterval(interval);
            setIsTimeUp(true);
            return 0;
          }
          return s - 1;
        } else {
          return s + 1;
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLimit]);

  useEffect(() => {
    if (isTimeUp) {
      Alert.alert("Hết giờ!", "Thời gian làm bài đã kết thúc. Hệ thống sẽ tự động nộp bài.", [
        { text: "OK", onPress: () => processResults() }
      ]);
    }
  }, [isTimeUp]);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const toggleBookmark = () => {
    setBookmarked(prev => 
      prev.includes(currentIndex) ? prev.filter(i => i !== currentIndex) : [...prev, currentIndex]
    );
  };

  if (cards.length === 0) return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-900 justify-center items-center">
      <Ionicons name="folder-open-outline" size={60} color="#9CA3AF" />
      <Text className="text-neutral-500 mt-4 text-lg font-bold tracking-widest uppercase">Trống</Text>
    </View>
  );

  const currentCard = cards[currentIndex];

  const toggleOption = (optIndex: number) => {
    playMediumImpact();
    setAnswers(prev => {
      return { ...prev, [currentIndex]: [optIndex] };
    });
  };

  const handleSubmit = () => {
    const answeredCount = Object.keys(answers).length;
    const missing = cards.length - answeredCount;
    
    Alert.alert(
      "Nộp bài",
      missing > 0 ? `Bạn còn ${missing} câu chưa làm. Bạn có chắc chắn muốn nộp bài không?` : "Bạn có chắc chắn muốn nộp bài?",
      [
        { text: "Hủy", style: "cancel" },
        { text: "Nộp bài", style: "destructive", onPress: processResults }
      ]
    );
  };

  const processResults = () => {
    let finalScore = 0;
    let wrongCards: any[] = [];

    cards.forEach((card, idx) => {
      const userSelected = answers[idx] || [];
      const correctArr = card.correctOptionIndexes || [];
      const isCorrect = 
        userSelected.length > 0 &&
        userSelected.length === correctArr.length && 
        userSelected.every(val => correctArr.includes(val));

      if (isCorrect) {
        finalScore++;
        addOrUpdateReview({
          reviewId: card.cardId,
          cardId: card.cardId,
          deckId: card.deckId,
          question: card.question,
          answer: card.answer,
          lastReviewed: 0,
          ease: 2.5,
          interval: 1,
          nextReviewDate: 0
        }, true);
      } else {
        wrongCards.push(card);
        addOrUpdateReview({
          reviewId: card.cardId,
          cardId: card.cardId,
          deckId: card.deckId,
          question: card.question,
          answer: `Đ/A đúng: ${card.correctOptionIndexes?.map(i => card.options![i]).join(', ')}`,
          lastReviewed: 0,
          ease: 2.5,
          interval: 1,
          nextReviewDate: 0
        }, false);
      }
    });

    playSuccess();
    const earnedExp = finalScore * 10;
    if (earnedExp > 0) {
      useAuthStore.getState().addExp(earnedExp);
      updateUserEXP(earnedExp);
    }
    
    navigation.replace('Result', { 
      score: finalScore, 
      total: cards.length, 
      type: 'Kiểm Tra',
      wrongCards: wrongCards
    });
  };

  const isAlarm = timeLimit && seconds <= 60 && seconds > 0;

  return (
    <SafeAreaView className={`flex-1 ${isAlarm ? 'bg-red-500' : 'bg-[#F8FAFC] dark:bg-slate-900'}`} edges={['top', 'bottom']}>
      {/* Screen Header */}
      <View className="px-5 py-4 border-b-4 border-slate-900 bg-[#C084FC] dark:bg-slate-800 flex-row items-center justify-between z-10">
        <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 border-4 border-slate-900 items-center justify-center rounded-none bg-white shadow-[2px_2px_0_#0F172A] active:translate-x-1 active:translate-y-1 active:shadow-none">
          <Ionicons name="close" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text className="text-xl font-black uppercase text-slate-900 dark:text-white tracking-widest">Kiểm Tra</Text>
        <View className="w-10 h-10 border-4 border-transparent" />
      </View>

      {/* ACADEMIC/DOCUMENT HEADER */}
      <View className={`flex-row items-center justify-center gap-6 px-6 py-4 border-b-4 border-slate-900 ${isAlarm ? 'bg-red-600' : 'bg-white dark:bg-slate-800'}`}>
        
        <View className="items-center bg-white border-4 border-slate-900 px-6 py-1 shadow-[2px_2px_0_#0F172A]">
          <Text className="text-slate-500 font-black text-[10px] tracking-widest uppercase mb-1">Mã Phách</Text>
          <Text className="text-slate-900 font-black text-xl tracking-widest">{currentIndex + 1} / {cards.length}</Text>
        </View>

        <View className={`border-4 border-slate-900 px-4 py-2 rounded-none flex-row items-center shadow-[2px_2px_0_#0F172A] ${isAlarm ? 'bg-red-500 animate-pulse' : 'bg-white dark:bg-slate-700'}`}>
          <Ionicons name="time" size={18} color={isAlarm ? "#FFFFFF" : "#0F172A"} className={isAlarm ? "" : "dark:text-white"} />
          <Text className={`text-lg font-black ml-2 tracking-widest ${isAlarm ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{formatTime(seconds)}</Text>
        </View>
      </View>

      {/* BODY */}
      <View className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          {/* Question Box */}
          <View className={`px-6 py-8 border-b-4 border-slate-900 ${isAlarm ? 'bg-red-400' : 'bg-[#FFFDF0] dark:bg-slate-800'}`}>
            <View className="flex-row items-center justify-between mb-6">
              <View className="border-4 border-slate-900 px-3 py-1 bg-white shadow-[2px_2px_0_#0F172A]">
                <Text className="text-slate-900 font-black text-xs uppercase tracking-widest">Question {currentIndex + 1}</Text>
              </View>
              <TouchableOpacity 
                onPress={toggleBookmark}
                className={`w-10 h-10 border-4 border-slate-900 items-center justify-center ${bookmarked.includes(currentIndex) ? 'bg-yellow-400' : 'bg-white'}`}
              >
                <Ionicons name="bookmark" size={20} color="#0F172A" />
              </TouchableOpacity>
            </View>
            <TypewriterText text={currentCard.question} styleClass="text-3xl font-black text-slate-900 dark:text-white leading-tight font-mono tracking-tight" />
          </View>
          
          {/* Options List */}
          <View className="px-6 py-6">
            <Text className={`font-black text-xs tracking-widest uppercase mb-4 ${isAlarm ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>Chỉ định đáp án</Text>
            {currentCard.options?.map((opt, idx) => {
              const isSelected = (answers[currentIndex] || []).includes(idx);
              return (
                <TouchableOpacity 
                  key={idx}
                  className={`w-full p-4 mb-4 border-4 rounded-none flex-row items-center shadow-[4px_4px_0_#0F172A] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all ${
                    isSelected 
                      ? 'border-slate-900 bg-slate-900 dark:border-white dark:bg-white' 
                      : 'border-slate-900 bg-white dark:border-slate-300 dark:bg-slate-800'
                  }`}
                  onPress={() => toggleOption(idx)}
                  activeOpacity={1}
                >
                  <View className={`w-10 h-10 rounded-none border-4 items-center justify-center mr-4 ${
                    isSelected 
                      ? 'border-white bg-slate-900 dark:border-slate-900 dark:bg-white' 
                      : 'border-slate-900 bg-slate-100 dark:border-slate-300 dark:bg-slate-700'
                  }`}>
                    <Text className={`font-black text-lg ${
                      isSelected ? 'text-white dark:text-slate-900' : 'text-slate-900 dark:text-white'
                    }`}>
                      {['A', 'B', 'C', 'D', 'E'][idx]}
                    </Text>
                  </View>
                  <Text className={`text-lg font-bold flex-1 ${
                    isSelected ? 'text-white dark:text-slate-900' : 'text-slate-800 dark:text-white'
                  }`}>{opt}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </ScrollView>
      </View>

      {/* BOTTOM NAVIGATION BAR */}
      <View className={`absolute bottom-0 left-0 right-0 border-t-4 border-slate-900 px-6 py-4 flex-row items-center justify-between ${isAlarm ? 'bg-red-600' : 'bg-white dark:bg-slate-800'}`}>
        <TouchableOpacity 
          className={`flex-row items-center border-4 border-slate-900 px-4 py-3 rounded-none bg-white active:translate-x-1 active:translate-y-1 shadow-[2px_2px_0_#0F172A] ${currentIndex === 0 ? 'opacity-50' : ''}`}
          onPress={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          activeOpacity={1}
        >
          <Ionicons name="arrow-back" size={20} color="#0F172A" />
          <Text className="font-black ml-2 text-slate-900 uppercase tracking-widest text-xs">Trước</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="w-14 h-14 bg-white border-4 border-slate-900 rounded-none items-center justify-center active:translate-x-1 active:translate-y-1 shadow-[2px_2px_0_#0F172A]"
          onPress={() => setShowGrid(true)}
          activeOpacity={1}
        >
          <Ionicons name="grid" size={24} color="#0F172A" />
        </TouchableOpacity>

        {currentIndex === cards.length - 1 ? (
          <TouchableOpacity 
            className="flex-row items-center px-6 py-3 rounded-none bg-emerald-400 border-4 border-slate-900 active:translate-x-1 active:translate-y-1 shadow-[2px_2px_0_#0F172A]"
            onPress={handleSubmit}
            activeOpacity={1}
          >
            <Text className="text-slate-900 font-black mr-2 uppercase tracking-widest text-xs">Nộp</Text>
            <Ionicons name="checkmark-done" size={24} color="#0F172A" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            className="flex-row items-center px-4 py-3 rounded-none bg-white border-4 border-slate-900 active:translate-x-1 active:translate-y-1 shadow-[2px_2px_0_#0F172A]"
            onPress={() => setCurrentIndex(prev => Math.min(cards.length - 1, prev + 1))}
            activeOpacity={1}
          >
            <Text className="text-slate-900 font-black mr-2 uppercase tracking-widest text-xs">Tiếp</Text>
            <Ionicons name="arrow-forward" size={20} color="#0F172A" />
          </TouchableOpacity>
        )}
      </View>

      {/* QUESTION PALETTE MODAL */}
      <Modal visible={showGrid} animationType="fade" transparent={true}>
        <View className="flex-1 justify-end bg-slate-900/80">
          <View className="bg-white dark:bg-slate-800 border-t-8 border-slate-900 h-[70%]">
            <View className="flex-row items-center justify-between px-6 py-5 border-b-4 border-slate-900">
              <Text className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">Bảng điều khiển</Text>
              <TouchableOpacity 
                onPress={() => setShowGrid(false)} 
                className="w-10 h-10 border-4 border-slate-900 bg-white items-center justify-center shadow-[2px_2px_0_#0F172A] active:translate-y-1 active:translate-x-1 active:shadow-none"
                activeOpacity={1}
              >
                <Ionicons name="close" size={24} color="#0F172A" />
              </TouchableOpacity>
            </View>
            
            <ScrollView className="p-6">
              <View className="flex-row flex-wrap justify-between">
                {cards.map((_, idx) => {
                  const isAnswered = answers[idx] && answers[idx].length > 0;
                  const isCurrent = currentIndex === idx;
                  return (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => {
                        setCurrentIndex(idx);
                        setShowGrid(false);
                      }}
                      activeOpacity={1}
                      className={`w-[18%] aspect-square items-center justify-center mb-4 border-4 shadow-[2px_2px_0_#0F172A] active:translate-x-1 active:translate-y-1 active:shadow-none ${
                        isCurrent 
                          ? 'border-slate-900 bg-emerald-400 dark:bg-emerald-500' 
                          : isAnswered 
                            ? 'border-slate-900 bg-slate-900 dark:border-white dark:bg-white' 
                            : 'border-slate-900 bg-white dark:border-slate-500 dark:bg-slate-700'
                      }`}
                    >
                      {bookmarked.includes(idx) && (
                        <View className="absolute top-1 right-1 w-3 h-3 bg-yellow-400 border-2 border-slate-900 rounded-none" />
                      )}
                      <Text className={`font-black text-xl ${
                        isCurrent 
                          ? 'text-slate-900' 
                          : isAnswered 
                            ? 'text-white dark:text-slate-900' 
                            : 'text-slate-900 dark:text-white'
                      }`}>
                        {idx + 1}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                {/* Empty views to fix flex-wrap spacing if necessary */}
                {[...Array(5 - (cards.length % 5))].map((_, i) => (
                   <View key={`empty-${i}`} className="w-[18%] aspect-square mb-3" />
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
