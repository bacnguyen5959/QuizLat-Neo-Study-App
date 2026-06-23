import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useDeckStore } from '../../store/deckStore';
import { useFlashcardStore } from '../../store/flashcardStore';
import { playSuccess, playMediumImpact } from '../../utils/haptics';

export function ResultScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { score, total, type, wrongCards = [] } = route.params;

  const addDeck = useDeckStore(s => s.addDeck);
  const addCard = useFlashcardStore(s => s.addCard);

  const handleCreateMistakeDeck = () => {
    if (wrongCards.length === 0) return;
    playMediumImpact();

    const today = new Date();
    const dateString = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    const newDeckId = Math.random().toString(36).substring(7);
    
    addDeck({
      deckId: newDeckId,
      name: `Ôn tập lỗi sai - ${dateString}`,
      description: `Tạo tự động từ các câu trả lời sai lúc ${today.getHours()}:${today.getMinutes()}`,
      createdAt: Date.now()
    });

    wrongCards.forEach((card: any) => {
      addCard({
        cardId: Math.random().toString(36).substring(7),
        deckId: newDeckId,
        question: card.question,
        answer: card.answer,
        createdAt: Date.now()
      });
    });

    playSuccess();
    Alert.alert(
      "Tạo thành công!",
      "Bộ thẻ ôn tập lỗi sai đã được tạo.",
      [
        { text: "Để sau", style: "cancel" },
        { text: "Đến ngay", onPress: () => navigation.navigate('DeckDetail', { deckId: newDeckId }) }
      ]
    );
  };

  const percentage = (score / total) * 100;
  const isPerfect = score === total;

  const renderHeader = () => (
    <View className="items-center w-full mb-8">
      {/* TICKET / RECEIPT UI */}
      <View className="w-full bg-[#FFFDF0] dark:bg-slate-800 p-8 border-8 border-slate-900 shadow-[12px_12px_0_#0F172A] mb-10 relative mt-4">
        <View className="absolute -top-6 -left-6 bg-yellow-400 border-4 border-slate-900 px-4 py-2 -rotate-12 shadow-[4px_4px_0_#0F172A]">
          <Text className="font-black text-slate-900 text-xl uppercase tracking-widest">{isPerfect ? 'PERFECT!' : 'HOÀN THÀNH'}</Text>
        </View>

        <View className="items-center mb-6 mt-4 border-b-4 border-dashed border-slate-900 pb-6">
          <Ionicons name={isPerfect ? "trophy" : "flag"} size={64} color="#0F172A" className={isPerfect ? "dark:text-yellow-400" : "dark:text-white"} />
          <Text className="text-3xl font-black text-slate-900 dark:text-white mt-4 uppercase tracking-tighter text-center">Báo Cáo</Text>
          <Text className="text-sm font-black text-slate-500 uppercase tracking-widest">{type}</Text>
        </View>
        
        <View className="items-center">
          <Text className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Điểm số</Text>
          <View className="flex-row items-baseline mb-4">
            <Text className="text-7xl font-black text-slate-900 dark:text-white leading-none">{score}</Text>
            <Text className="text-3xl font-black text-slate-400">/{total}</Text>
          </View>
          
          <View className="w-full h-8 border-4 border-slate-900 bg-white dark:bg-slate-700 overflow-hidden relative">
            <View className={`h-full ${isPerfect ? 'bg-yellow-400' : 'bg-emerald-400'}`} style={{ width: `${percentage}%` }} />
            <Text className="absolute w-full text-center font-black text-slate-900 top-0.5 mix-blend-difference">{percentage.toFixed(0)}%</Text>
          </View>
        </View>

        {/* Receipt jagged edge mock */}
        <View className="absolute -bottom-4 w-[110%] flex-row overflow-hidden left-[-5%] justify-around">
          {[...Array(15)].map((_, i) => (
            <View key={i} className="w-4 h-4 bg-[#F8FAFC] dark:bg-slate-900 rotate-45 transform translate-y-2 border-t-8 border-l-8 border-slate-900" />
          ))}
        </View>
      </View>

      <View className="w-full gap-4">
        <TouchableOpacity 
          className="bg-white dark:bg-slate-800 w-full p-5 border-4 border-slate-900 items-center flex-row justify-center shadow-[4px_4px_0_#0F172A] active:translate-x-1 active:translate-y-1 active:shadow-none"
          onPress={() => {
            playMediumImpact();
            navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
          }}
          activeOpacity={1}
        >
          <Ionicons name="home" size={24} color="#0F172A" className="dark:text-white mr-2" />
          <Text className="text-slate-900 dark:text-white font-black text-xl uppercase tracking-widest">Trung Tâm</Text>
        </TouchableOpacity>

        {wrongCards.length > 0 && (
          <TouchableOpacity 
            className="bg-red-500 w-full p-5 border-4 border-slate-900 items-center flex-row justify-center shadow-[4px_4px_0_#0F172A] active:translate-x-1 active:translate-y-1 active:shadow-none mt-2"
            onPress={handleCreateMistakeDeck}
            activeOpacity={1}
          >
            <Ionicons name="medical" size={24} color="#FFFFFF" className="mr-2" />
            <Text className="text-white font-black text-xl uppercase tracking-widest">Tạo Thẻ Lỗi ({wrongCards.length})</Text>
          </TouchableOpacity>
        )}
      </View>

      {wrongCards.length > 0 && (
        <View className="w-full mt-12 mb-4 border-b-4 border-slate-900 pb-2">
          <Text className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">Báo cáo Lỗi ({wrongCards.length})</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC] dark:bg-slate-900" edges={['top']}>
      <FlatList
        data={wrongCards}
        keyExtractor={(item, index) => item.cardId || index.toString()}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View className="bg-white dark:bg-slate-800 border-4 border-slate-900 shadow-[4px_4px_0_#0F172A] p-5 mb-6 relative">
            <View className="absolute -top-3 -left-3 bg-red-500 border-2 border-slate-900 w-8 h-8 items-center justify-center -rotate-6">
              <Text className="text-white font-black text-xs">{index + 1}</Text>
            </View>
            <View className="mb-4 mt-2">
              <Text className="text-slate-900 dark:text-white font-black text-lg leading-6 uppercase">{item.question}</Text>
            </View>
            <View className="bg-green-400 border-4 border-slate-900 p-3 mt-2 -rotate-1">
              <Text className="text-slate-900 font-black mb-1 uppercase tracking-widest text-[10px]">Đáp án chuẩn</Text>
              <Text className="text-slate-900 text-lg font-bold">
                {item.options && item.options.length > 0 
                  ? item.correctOptionIndexes?.map((i: number) => item.options![i]).join(', ')
                  : item.answer}
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
