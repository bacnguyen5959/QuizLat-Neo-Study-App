import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StatusBar, Modal, TextInput, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDeckStore } from '../../store/deckStore';
import { useNavigation } from '@react-navigation/native';
import { useSrsStore } from '../../store/srsStore';
import { Ionicons } from '@expo/vector-icons';
import { useFlashcardStore } from '../../store/flashcardStore';
import { importDeckFromCode } from '../../services/firestoreService';
import { useAuthStore } from '../../store/authStore';
import { useColorScheme } from 'nativewind';
import { GridBackground } from '../../components/GridBackground';

const { width } = Dimensions.get('window');

// A simple simulated 4-week heatmap
const Heatmap = () => {
  const { currentStreak } = useAuthStore();
  const days = Array.from({ length: 28 }).map((_, i) => {
    // Generate pseudo-random intensity based on index and streak
    const intensity = i >= 28 - currentStreak ? Math.random() * 0.8 + 0.2 : Math.random() * 0.3;
    return intensity;
  });

  return (
    <View className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl border-4 border-slate-900 dark:border-slate-300 shadow-sm flex-row flex-wrap justify-between gap-1 mt-2">
      {days.map((intensity, index) => (
        <View 
          key={index} 
          className="w-3 h-3 rounded-sm border border-slate-900/10 dark:border-white/10"
          style={{ backgroundColor: `rgba(59, 130, 246, ${intensity})` }} // blue-500
        />
      ))}
      <Text className="w-full text-center text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-widest">
        Hoạt động 28 ngày qua (Chuỗi: {currentStreak} ngày)
      </Text>
    </View>
  );
}

export function DeckListScreen() {
  const { decks, addDeck, deleteDeck } = useDeckStore();
  const { getCardsByDeck, addCard } = useFlashcardStore();
  const totalCards = useFlashcardStore(s => s.cards.length);
  const navigation = useNavigation<any>();
  const reviews = useSrsStore(s => s.reviews);
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();
  
  const dueReviews = React.useMemo(() => {
    const now = Date.now();
    return reviews.filter(r => r.nextReviewDate <= now).length;
  }, [reviews]);

  const [isModalVisible, setModalVisible] = useState(false);
  const [shareCode, setShareCode] = useState('');
  const [isImporting, setIsImporting] = useState(false);


  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: '#F8FAFC' },
      headerTitleStyle: { color: '#0F172A', fontWeight: '900', fontSize: 24 },
      headerShadowVisible: false,
      headerRight: () => (
        <TouchableOpacity 
          className="mr-4 flex-row items-center bg-blue-600 px-3 py-2 rounded-md border-b-4 border-r-4 border-blue-900 active:translate-x-1 active:translate-y-1 active:border-b-0 active:border-r-0"
          onPress={() => setModalVisible(true)}
          activeOpacity={1}
        >
          <Ionicons name="cloud-download-outline" size={18} color="#FFFFFF" />
          <Text className="text-white font-black ml-1 text-xs uppercase tracking-widest">Tải Đề</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleImport = async () => {
    if (!shareCode.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập mã chia sẻ.");
      return;
    }

    setIsImporting(true);
    try {
      const { deck, flashcards } = await importDeckFromCode(shareCode.trim().toUpperCase());
      addDeck(deck);
      flashcards.forEach(c => addCard(c));
      Alert.alert("Thành công", `Đã tải thành công bộ đề "${deck.name}" với ${flashcards.length} câu hỏi!`);
      setModalVisible(false);
      setShareCode('');
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể tải bộ đề.");
    } finally {
      setIsImporting(false);
    }
  };

  const confirmDelete = (deckId: string, name: string) => {
    Alert.alert("Xé nháp?", `Bạn có muốn xé cuốn sổ "${name}" này không?`, [
      { text: "Giữ lại", style: "cancel" },
      { text: "Xé bỏ", style: "destructive", onPress: () => deleteDeck(deckId) }
    ]);
  };

  const renderHeader = () => (
    <View className="mb-6 mt-4">
      <View className="flex-row justify-between items-center mb-2 px-1">
        <Text className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Hồ sơ học tập</Text>
      </View>
      <Heatmap />
      
      {dueReviews > 0 && (
        <TouchableOpacity 
          className="mt-6 bg-red-50 dark:bg-red-900/30 border-4 border-red-500 py-4 rounded-xl flex-row items-center justify-center active:bg-red-100"
          onPress={() => navigation.navigate('MistakeReview')}
          activeOpacity={0.8}
        >
          <Ionicons name="flame" size={24} color="#EF4444" className="mr-2" />
          <Text className="text-red-600 dark:text-red-400 font-black text-lg uppercase tracking-widest">Cần ôn gấp: {dueReviews} thẻ!</Text>
        </TouchableOpacity>
      )}

      <Text className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest mt-8 mb-2 px-1">Bảng ghim thẻ ({decks.length})</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-[#F8FAFC] dark:bg-slate-900 relative" style={{ paddingTop: insets.top }}>
      <GridBackground />
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      <View className="flex-1 px-4">
        {/* Import Modal */}
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View className="flex-1 bg-slate-900/80 justify-center items-center px-6">
          <View className="bg-white dark:bg-slate-800 w-full p-6 rounded-none border-4 border-slate-900 dark:border-white items-center">
            <View className="w-16 h-16 bg-blue-600 rounded-none border-4 border-slate-900 dark:border-white items-center justify-center mb-4 rotate-6">
              <Ionicons name="cloud-download" size={32} color="#FFFFFF" />
            </View>
            <Text className="text-xl font-black text-slate-800 dark:text-white mb-2 uppercase tracking-widest">Tải Bộ Thẻ</Text>
            <Text className="text-center text-slate-500 dark:text-gray-400 mb-6 font-bold">NHẬP MÃ CODE CHIA SẺ VÀO BÊN DƯỚI.</Text>
            
            <TextInput 
              className="w-full bg-slate-100 dark:bg-slate-700 border-4 border-slate-900 dark:border-white p-4 text-center text-2xl font-black text-slate-800 dark:text-white tracking-widest mb-6 uppercase focus:bg-blue-50"
              placeholder="MÃ CODE"
              placeholderTextColor="#9CA3AF"
              value={shareCode}
              onChangeText={setShareCode}
              maxLength={6}
              autoCapitalize="characters"
            />
            
            <View className="flex-row w-full gap-4">
              <TouchableOpacity 
                className="flex-1 bg-white border-4 border-slate-900 p-4 items-center active:bg-slate-200"
                onPress={() => { setModalVisible(false); setShareCode(''); }}
                disabled={isImporting}
              >
                <Text className="text-slate-900 font-black text-lg uppercase">Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="flex-1 bg-blue-600 border-4 border-slate-900 p-4 items-center flex-row justify-center active:bg-blue-700"
                onPress={handleImport}
                disabled={isImporting}
              >
                {isImporting ? <ActivityIndicator color="#FFF" /> : <Text className="text-white font-black text-lg uppercase">Tải Ngay</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      <FlatList
        data={decks}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        keyExtractor={(item) => item.deckId}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={() => (
          <View className="items-center mt-10 p-8 border-4 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl">
            <Ionicons name="folder-open" size={60} color="#94A3B8" />
            <Text className="text-slate-500 mt-4 text-center font-black uppercase tracking-widest">Bảng ghim trống</Text>
            <Text className="text-slate-400 text-center font-bold mt-2">Bấm dấu + góc dưới để tạo cuốn sổ tay đầu tiên!</Text>
          </View>
        )}
        renderItem={({ item, index }) => {
          const cardCount = getCardsByDeck(item.deckId).length;
          // Randomize rotation slightly for masonry feel
          const rotate = index % 2 === 0 ? '-rotate-2' : 'rotate-2';
          // Cycle pastel colors for notebooks
          const colors = ['bg-amber-100', 'bg-emerald-100', 'bg-blue-100', 'bg-rose-100', 'bg-purple-100'];
          const bgColor = colors[index % colors.length];

          return (
            <View className="w-[48%] mb-4">
              <TouchableOpacity 
                className={`p-4 ${bgColor} dark:bg-slate-800 rounded-sm shadow-sm border-4 border-slate-900 dark:border-slate-300 min-h-[160px] ${rotate} justify-between`}
                onPress={() => navigation.navigate('DeckDetail', { deckId: item.deckId })}
                activeOpacity={0.9}
              >
                {/* Delete/Tear button */}
                <TouchableOpacity 
                  className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 border-2 border-slate-900 rounded-full items-center justify-center z-10"
                  onPress={() => confirmDelete(item.deckId, item.name)}
                >
                  <Ionicons name="close" size={16} color="white" />
                </TouchableOpacity>

                {/* Notebook binding styling */}
                <View className="absolute left-2 top-0 bottom-0 w-1 bg-slate-900/10" />

                <View>
                  <Text className="text-xl font-black text-slate-900 dark:text-white leading-tight">{item.name}</Text>
                  {item.description ? (
                    <Text className="text-slate-700 dark:text-gray-400 mt-2 font-medium text-xs leading-relaxed" numberOfLines={3}>{item.description}</Text>
                  ) : null}
                </View>
                
                <View className="mt-4 pt-3 border-t-2 border-slate-900/10 dark:border-white/10 flex-row items-center justify-between">
                  <Text className="text-slate-900 dark:text-white font-black text-xs uppercase">{cardCount} Thẻ</Text>
                  <Ionicons name="arrow-forward" size={16} color="black" />
                </View>
              </TouchableOpacity>
            </View>
          );
        }}
      />
      
      <TouchableOpacity 
        className="absolute bottom-6 right-6 bg-slate-900 dark:bg-white w-16 h-16 rounded-sm border-b-4 border-r-4 border-slate-500 items-center justify-center active:translate-x-1 active:translate-y-1 active:border-b-0 active:border-r-0"
        onPress={() => navigation.navigate('CreateDeck')}
        activeOpacity={1}
      >
        <Ionicons name="add" size={36} color={colorScheme === 'dark' ? 'black' : 'white'} />
      </TouchableOpacity>
      </View>
    </View>
  );
}
