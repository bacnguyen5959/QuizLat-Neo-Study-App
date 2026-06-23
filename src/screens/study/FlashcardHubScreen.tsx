import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Animated, Easing, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDeckStore } from '../../store/deckStore';
import { useFlashcardStore } from '../../store/flashcardStore';
import { useSrsStore } from '../../store/srsStore';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { playSuccess, playMediumImpact } from '../../utils/haptics';
import { GridBackground } from '../../components/GridBackground';

export function FlashcardHubScreen() {
  const { decks } = useDeckStore();
  const { getCardsByDeck } = useFlashcardStore();
  const reviews = useSrsStore(s => s.reviews);
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  // Calculate Due Reviews
  const dueReviewsCount = React.useMemo(() => {
    const now = Date.now();
    return reviews.filter(r => r.nextReviewDate <= now).length;
  }, [reviews]);

  // Floating animation for the Due Reviews stage
  const [floatAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        })
      ])
    );
    anim.start();

    return () => {
      anim.stop();
    };
  }, []);

  const floatingStyle = {
    transform: [
      {
        translateY: floatAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -10]
        })
      }
    ]
  };

  const handleRandomPick = () => {
    if (decks.length === 0) {
      Alert.alert("Trống", "Bạn chưa có bộ thẻ nào để bốc thăm!");
      return;
    }
    playMediumImpact();
    
    // Simulate a slot machine / random pick
    setTimeout(() => {
      playSuccess();
      const randomDeck = decks[Math.floor(Math.random() * decks.length)];
      navigation.navigate('Flashcard', { deckId: randomDeck.deckId });
    }, 500);
  };

  const renderHeader = () => (
    <View className="mb-8 mt-2">
      <Text className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Hoạt động nổi bật</Text>
      
      {/* 1. Máy bốc thăm (Random Picker) */}
      <TouchableOpacity 
        className="bg-yellow-300 dark:bg-yellow-500 rounded-xl p-5 border-4 border-slate-900 shadow-[4px_4px_0_#0F172A] mb-6 flex-row items-center active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0_#0F172A]"
        activeOpacity={1}
        onPress={handleRandomPick}
      >
        <View className="w-16 h-16 bg-white border-4 border-slate-900 rounded-full items-center justify-center mr-4 rotate-12">
          <Ionicons name="dice" size={32} color="#0F172A" />
        </View>
        <View className="flex-1">
          <Text className="text-2xl font-black text-slate-900 uppercase">Bốc Thăm</Text>
          <Text className="text-slate-800 font-bold mt-1">Chọn ngẫu nhiên 1 bộ thẻ!</Text>
        </View>
      </TouchableOpacity>

      {/* 2. Sàn diễn thẻ tới hạn (Due Reviews Stage) */}
      {dueReviewsCount > 0 && (
        <TouchableOpacity 
          className="bg-red-100 dark:bg-red-900/30 rounded-xl p-6 border-4 border-red-500 items-center justify-center relative overflow-hidden"
          activeOpacity={0.9}
          onPress={() => navigation.navigate('MistakeReview')}
        >
          {/* Spotlight background */}
          <View className="absolute top-0 w-32 h-32 bg-red-200/50 dark:bg-red-500/20 rounded-full blur-2xl" />
          
          <Animated.View style={floatingStyle} className="items-center z-10">
            <View className="flex-row mb-2">
              <View className="w-10 h-14 bg-white border-2 border-red-500 shadow-sm -rotate-12 mr-[-10px] z-10" />
              <View className="w-10 h-14 bg-white border-2 border-red-500 shadow-sm rotate-6" />
            </View>
            <Text className="text-3xl font-black text-red-600 dark:text-red-400">{dueReviewsCount}</Text>
            <Text className="text-red-800 dark:text-red-200 font-bold uppercase tracking-widest mt-1 text-xs">Thẻ cần ôn gấp!</Text>
          </Animated.View>
        </TouchableOpacity>
      )}

      <Text className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-8 mb-2">Chọn bộ thẻ thủ công</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-[#F8FAFC] dark:bg-slate-900 relative">
      <GridBackground />
      <View 
        className="px-5 pb-4 border-b-4 border-slate-900 bg-blue-600 dark:bg-slate-800"
        style={{ paddingTop: Math.max(insets.top, 24) + 12 }}
      >
        <Text className="text-3xl font-black text-white uppercase tracking-tight mb-2">Học Thẻ Nhớ</Text>
        <Text className="text-blue-100 dark:text-gray-300 font-bold mb-4">Hệ thống Lặp lại Ngắt quãng (SRS)</Text>
      </View>
      
      <FlatList
        data={decks}
        keyExtractor={(item) => item.deckId}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100, paddingTop: 20 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={() => (
          <View className="items-center mt-10 p-6 border-4 border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
            <Ionicons name="albums-outline" size={60} color="#94A3B8" />
            <Text className="text-slate-500 dark:text-slate-400 mt-4 text-center font-black uppercase">Trống Rỗng</Text>
          </View>
        )}
        renderItem={({ item, index }) => {
          const cardCount = getCardsByDeck(item.deckId).length;
          return (
            <TouchableOpacity 
              className={`p-5 bg-white dark:bg-slate-800 rounded-none mb-4 flex-row items-center justify-between border-4 border-slate-900 shadow-[4px_4px_0_#0F172A] active:translate-x-1 active:translate-y-1 active:shadow-none`}
              onPress={() => navigation.navigate('Flashcard', { deckId: item.deckId })}
              activeOpacity={1}
            >
              <View className="flex-1 pr-4">
                <Text className="text-xl font-black text-slate-900 dark:text-white uppercase leading-tight">{item.name}</Text>
                {item.description ? (
                  <Text className="text-slate-600 dark:text-gray-400 mt-1 font-medium" numberOfLines={1}>{item.description}</Text>
                ) : null}
                <View className="flex-row items-center mt-3 bg-blue-100 dark:bg-blue-900 border-2 border-slate-900 self-start px-2 py-1">
                  <Text className="text-slate-900 dark:text-white text-xs font-black uppercase">{cardCount} thẻ</Text>
                </View>
              </View>
              <View className="w-14 h-14 bg-green-400 border-4 border-slate-900 rounded-full items-center justify-center">
                <Ionicons name="play" size={24} color="#0F172A" className="ml-1" />
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
