import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDeckStore } from '../../store/deckStore';
import { useFlashcardStore } from '../../store/flashcardStore';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { playSuccess, playMediumImpact } from '../../utils/haptics';
import { GridBackground } from '../../components/GridBackground';

export function QuizHubScreen() {
  const { decks } = useDeckStore();
  const { getCardsByDeck } = useFlashcardStore();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const handleRandomQuiz = () => {
    const validDecks = decks.filter(d => getCardsByDeck(d.deckId).length >= 10);
    if (validDecks.length === 0) {
      Alert.alert("Trống", "Cần ít nhất một bộ thẻ có từ 10 thẻ trở lên để làm bài kiểm tra!");
      return;
    }
    playMediumImpact();
    
    setTimeout(() => {
      playSuccess();
      const randomDeck = validDecks[Math.floor(Math.random() * validDecks.length)];
      navigation.navigate('QuizSetupScreen', { deckId: randomDeck.deckId });
    }, 500);
  };

  const renderHeader = () => (
    <View className="mb-8 mt-2">
      <Text className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Chế độ thử thách</Text>
      
      <TouchableOpacity 
        className="bg-emerald-400 dark:bg-emerald-600 rounded-none p-5 border-4 border-slate-900 shadow-[6px_6px_0_#0F172A] mb-2 flex-row items-center active:translate-x-1 active:translate-y-1 active:shadow-none"
        activeOpacity={1}
        onPress={handleRandomQuiz}
      >
        <View className="w-16 h-16 bg-white border-4 border-slate-900 rounded-none items-center justify-center mr-4 -rotate-6">
          <Ionicons name="flash" size={32} color="#0F172A" />
        </View>
        <View className="flex-1">
          <Text className="text-2xl font-black text-slate-900 dark:text-white uppercase">Sát Hạch Nhanh</Text>
          <Text className="text-slate-800 dark:text-slate-200 font-bold mt-1">Chọn ngẫu nhiên 1 bộ thẻ!</Text>
        </View>
      </TouchableOpacity>

      <Text className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-10 mb-2">Chọn bộ thẻ thủ công</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-[#F8FAFC] dark:bg-slate-900 relative">
      <GridBackground />
      <View 
        className="px-5 pb-4 border-b-4 border-slate-900 bg-emerald-500 dark:bg-slate-800"
        style={{ paddingTop: Math.max(insets.top, 24) + 12 }}
      >
        <Text className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Đấu Trường</Text>
        <Text className="text-emerald-900 dark:text-gray-300 font-bold mb-2">Bài kiểm tra & Trắc nghiệm</Text>
      </View>
      
      <FlatList
        data={decks}
        keyExtractor={(item) => item.deckId}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100, paddingTop: 20 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={() => (
          <View className="items-center mt-10 p-6 border-4 border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
            <Ionicons name="hardware-chip-outline" size={60} color="#94A3B8" />
            <Text className="text-slate-500 dark:text-slate-400 mt-4 text-center font-black uppercase">Chưa có dữ liệu</Text>
          </View>
        )}
        renderItem={({ item }) => {
          const cardCount = getCardsByDeck(item.deckId).length;
          const isPlayable = cardCount > 0;
          
          return (
            <TouchableOpacity 
              className={`p-5 bg-white dark:bg-slate-800 rounded-none mb-4 flex-row items-center justify-between border-4 border-slate-900 shadow-[4px_4px_0_#0F172A] ${isPlayable ? 'active:translate-x-1 active:translate-y-1 active:shadow-none' : 'opacity-60'}`}
              onPress={() => isPlayable ? navigation.navigate('QuizSetupScreen', { deckId: item.deckId }) : Alert.alert('Lỗi', 'Bộ thẻ này chưa có câu hỏi nào.')}
              activeOpacity={isPlayable ? 1 : 0.8}
            >
              <View className="flex-1 pr-4">
                <Text className="text-xl font-black text-slate-900 dark:text-white uppercase leading-tight">{item.name}</Text>
                {item.description ? (
                  <Text className="text-slate-600 dark:text-gray-400 mt-1 font-medium" numberOfLines={1}>{item.description}</Text>
                ) : null}
                <View className="flex-row items-center mt-3 bg-emerald-100 dark:bg-emerald-900 border-2 border-slate-900 self-start px-2 py-1">
                  <Text className="text-slate-900 dark:text-white text-xs font-black uppercase">{cardCount} câu hỏi</Text>
                </View>
              </View>
              <View className={`w-14 h-14 border-4 border-slate-900 rounded-full items-center justify-center ${isPlayable ? 'bg-emerald-400' : 'bg-slate-300'}`}>
                <Ionicons name="game-controller" size={24} color="#0F172A" />
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
