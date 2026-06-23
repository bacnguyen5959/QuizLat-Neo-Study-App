import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, Share, PanResponder, Animated, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFlashcardStore } from '../../store/flashcardStore';
import { useDeckStore } from '../../store/deckStore';
import { useSrsStore } from '../../store/srsStore';
import { Ionicons } from '@expo/vector-icons';
import { syncDeckToCloud } from '../../services/firestoreService';
import { playSuccess } from '../../utils/haptics';
import { useColorScheme } from 'nativewind';

const SCREEN_WIDTH = Dimensions.get('window').width;

function SwipeableCardItem({ item, index, cardsCount, onDelete, renderCardContent }: any) {
  const translateX = React.useRef(new Animated.Value(0)).current;

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dy) < 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          const dragX = gestureState.dx;
          if (dragX < -120) {
            translateX.setValue(-120 + (dragX + 120) * 0.4);
          } else {
            translateX.setValue(dragX);
          }
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -100) {
          Animated.timing(translateX, {
            toValue: -SCREEN_WIDTH,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            Alert.alert(
              "Xóa câu hỏi này?",
              "Bạn có chắc chắn muốn xóa câu hỏi này khỏi bộ thẻ không?",
              [
                {
                  text: "Hủy",
                  style: "cancel",
                  onPress: () => {
                    Animated.spring(translateX, {
                      toValue: 0,
                      bounciness: 12,
                      speed: 12,
                      useNativeDriver: true,
                    }).start();
                  }
                },
                {
                  text: "Xóa",
                  style: "destructive",
                  onPress: () => {
                    onDelete();
                  }
                }
              ],
              { cancelable: false }
            );
          });
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const rotate = translateX.interpolate({
    inputRange: [-150, 0],
    outputRange: ['-6deg', '0deg'],
    extrapolate: 'clamp',
  });

  const opacity = translateX.interpolate({
    inputRange: [-150, 0],
    outputRange: [0.8, 1],
    extrapolate: 'clamp',
  });

  return (
    <View 
      className={`relative mb-2 ${index > 0 ? '-mt-4' : ''}`}
      style={{ zIndex: cardsCount - index }}
    >
      {/* Background delete indicator */}
      <View 
        className="absolute inset-y-0 right-5 left-5 bg-red-500 border-4 border-slate-900 flex-row items-center justify-end px-6 shadow-[2px_2px_0_#0F172A]"
        style={{
          transform: [{ rotate: index % 2 === 0 ? '1deg' : '-1deg' }],
          borderRadius: 4
        }}
      >
        <View className="flex-row items-center gap-2">
          <Ionicons name="trash" size={20} color="white" />
          <Text className="text-white font-black text-[10px] uppercase tracking-widest">Xóa Thẻ</Text>
        </View>
      </View>

      {/* Foreground card container */}
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          transform: [{ translateX }, { rotate }],
          opacity,
        }}
      >
        {renderCardContent(item, index)}
      </Animated.View>
    </View>
  );
}

export function DeckDetailScreen({ route, navigation }: any) {
  const { deckId } = route.params;
  const { colorScheme } = useColorScheme();
  
  const decks = useDeckStore((s) => s.decks);
  const setDecks = useDeckStore((s) => s.setDecks);
  const deck = React.useMemo(() => decks.find((d) => d.deckId === deckId), [decks, deckId]);
  const allCards = useFlashcardStore((s) => s.cards);
  const cards = React.useMemo(() => allCards.filter(c => c.deckId === deckId), [allCards, deckId]);
  const addCard = useFlashcardStore((s) => s.addCard);
  const deleteDeck = useDeckStore((s) => s.deleteDeck);
  const deleteCardsByDeckId = useFlashcardStore((s) => s.deleteCardsByDeckId);
  const deleteCard = useFlashcardStore((s) => s.deleteCard);
  const deleteReviewsByDeckId = useSrsStore((s) => s.deleteReviewsByDeckId);

  const handleDeleteDeck = () => {
    Alert.alert(
      "Xóa bộ thẻ",
      "Bạn có chắc chắn muốn xóa bộ thẻ này không? Toàn bộ thẻ bên trong sẽ bị mất vĩnh viễn.",
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Xóa", 
          style: "destructive", 
          onPress: () => {
            deleteReviewsByDeckId(deckId);
            deleteCardsByDeckId(deckId);
            deleteDeck(deckId);
            navigation.goBack();
          } 
        }
      ]
    );
  };

  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (!deck) return;
    if (cards.length === 0) {
      Alert.alert("Lỗi", "Bộ thẻ trống. Vui lòng thêm câu hỏi trước khi công khai.");
      return;
    }

    Alert.alert(
      deck.isPublic ? "Cập nhật bản công khai" : "Công khai lên Cộng đồng",
      deck.isPublic 
        ? `Bạn có muốn cập nhật toàn bộ thay đổi mới nhất của bộ thẻ "${deck.name}" lên Kho đề Cộng đồng không?`
        : `Bạn có chắc chắn muốn công khai bộ thẻ "${deck.name}" lên Kho đề Cộng đồng không?\n\nMọi người đều có thể tìm thấy, xem và tải bộ đề này về máy để học tập.`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: deck.isPublic ? "Cập nhật ngay" : "Công khai ngay",
          onPress: async () => {
            setIsSharing(true);
            try {
              const code = await syncDeckToCloud(deck, cards, true);
              if (!code) throw new Error("Không thể khởi tạo mã chia sẻ.");
              
              // Update local Zustand store
              const updatedDecks = decks.map(d => 
                d.deckId === deckId 
                  ? { ...d, isPublic: true, shareCode: code } 
                  : d
              );
              setDecks(updatedDecks);
              
              Alert.alert(
                deck.isPublic ? "Cập nhật thành công!" : "Đăng tải thành công!",
                `Bộ thẻ đã được lưu hành công khai trên Cộng đồng!\n\nMã chia sẻ của bạn là: ${code}\n\nNgười khác có thể tìm kiếm tên bộ đề hoặc nhập mã này tại mục Cộng đồng để tải về.`,
                [
                  { text: "Đóng", style: "cancel" },
                  { 
                    text: "Chia sẻ mã", 
                    onPress: () => Share.share({ message: `Hãy nhập mã ${code} hoặc tìm kiếm bộ đề "${deck.name}" trên Kho cộng đồng QuizLat để cùng học nhé!` }) 
                  }
                ]
              );
            } catch (error: any) {
              Alert.alert("Lỗi", error.message || "Không thể công khai bộ thẻ.");
            } finally {
              setIsSharing(false);
            }
          }
        }
      ]
    );
  };

  const [cardType, setCardType] = useState<'flashcard' | 'mcq'>('flashcard');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctIndexes, setCorrectIndexes] = useState<number[]>([]);

  const handleToggleCorrect = (index: number) => {
    setCorrectIndexes(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  const handleUpdateOption = (text: string, index: number) => {
    const newOptions = [...options];
    newOptions[index] = text;
    setOptions(newOptions);
  };

  const handleAddCard = () => {
    if (!question.trim()) return;
    
    if (cardType === 'flashcard') {
      if (!answer.trim()) return;
      addCard({ cardId: Date.now().toString(), deckId, question, answer, createdAt: Date.now() });
    } else {
      const validOptions = options.map(o => o.trim()).filter(o => o.length > 0);
      if (validOptions.length < 2) {
        Alert.alert("Lỗi", "Vui lòng nhập ít nhất 2 đáp án.");
        return;
      }
      if (correctIndexes.length === 0) {
        Alert.alert("Lỗi", "Vui lòng chọn ít nhất 1 đáp án đúng.");
        return;
      }
      
      const validCorrectIndexes = correctIndexes.filter(i => options[i].trim().length > 0);
      for (let idx of correctIndexes) {
        if (!options[idx].trim()) {
          Alert.alert("Lỗi", "Đáp án đúng không được để trống.");
          return;
        }
      }

      const compactedOptions: string[] = [];
      const compactedCorrectIndexes: number[] = [];
      options.forEach((opt, idx) => {
        if (opt.trim().length > 0) {
          compactedOptions.push(opt.trim());
          if (correctIndexes.includes(idx)) {
            compactedCorrectIndexes.push(compactedOptions.length - 1);
          }
        }
      });

      addCard({ 
        cardId: Date.now().toString(), 
        deckId, 
        question, 
        answer: answer.trim() || "Chưa có giải thích", 
        options: compactedOptions,
        correctOptionIndexes: compactedCorrectIndexes,
        createdAt: Date.now() 
      });
    }

    playSuccess();
    setQuestion('');
    setAnswer('');
    setOptions(['', '', '', '']);
    setCorrectIndexes([]);
  };

  if (!deck) return <View className="flex-1 bg-white justify-center items-center"><Text className="text-gray-500">Deck not found</Text></View>;

  const isFormValid = () => {
    if (!question.trim()) return false;
    if (cardType === 'flashcard') {
      return answer.trim().length > 0;
    } else {
      return correctIndexes.length > 0 && options.filter(o => o.trim()).length >= 2;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-900" edges={['top', 'bottom']}>
      {/* Neo-Brutalist Header */}
      <View className="px-5 py-4 border-b-4 border-slate-900 bg-white dark:bg-slate-800 flex-row items-center justify-between z-10">
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          className="w-10 h-10 border-4 border-slate-900 items-center justify-center rounded-none bg-white shadow-[2px_2px_0_#0F172A] active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text className="text-xl font-black uppercase text-slate-900 dark:text-white tracking-widest">Bộ Thẻ</Text>
        <View className="w-10 h-10" />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <FlatList
          data={cards}
          keyExtractor={(item) => item.cardId}
          ListHeaderComponent={
            <View className="p-5 pt-8">
            <View className="flex-row justify-between items-start mb-6">
              <View className="flex-1 pr-4">
                <Text className="text-4xl font-black tracking-tight text-neutral-900 dark:text-white leading-tight mb-2 uppercase">{deck.name}</Text>
                {deck.description ? (
                  <Text className="text-neutral-500 dark:text-neutral-400 text-sm leading-5 font-medium mb-3">{deck.description}</Text>
                ) : null}
                
                {/* Neo-Brutalist Status Badge */}
                <View className="flex-row items-center gap-2 mt-2">
                  {deck.isPublic ? (
                    <View className="bg-emerald-400 dark:bg-emerald-600 border-2 border-slate-900 dark:border-slate-300 px-3 py-1 shadow-[2px_2px_0_#0F172A] dark:shadow-[2px_2px_0_#CBD5E1] rounded-none">
                      <Text className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">
                        ĐÃ CÔNG KHAI • MÃ: {deck.shareCode}
                      </Text>
                    </View>
                  ) : (
                    <View className="bg-neutral-200 dark:bg-neutral-700 border-2 border-slate-900 dark:border-slate-300 px-3 py-1 shadow-[2px_2px_0_#0F172A] dark:shadow-[2px_2px_0_#CBD5E1] rounded-none">
                      <Text className="text-[10px] font-black text-slate-700 dark:text-neutral-300 uppercase tracking-widest">
                        CÁ NHÂN (RIÊNG TƯ)
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* TUBE METRICS ROW */}
            <View className="flex-row border-4 border-slate-900 dark:border-slate-300 rounded-xl p-4 mb-8 bg-white dark:bg-slate-800 shadow-[4px_4px_0_#0F172A] dark:shadow-[4px_4px_0_#CBD5E1]">
              <View className="flex-1 pr-4 border-r-4 border-slate-900 dark:border-slate-300">
                <Text className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Tài nguyên</Text>
                <Text className="text-4xl font-black text-slate-900 dark:text-white">{cards.length} <Text className="text-sm">Thẻ</Text></Text>
              </View>
              <View className="flex-1 pl-4 justify-center">
                <Text className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Độ chín (Mô phỏng)</Text>
                
                {/* Test Tube Progress */}
                <View className="w-full h-8 border-4 border-slate-900 dark:border-slate-300 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700 relative shadow-inner">
                  <View className="h-full bg-cyan-400 border-r-4 border-slate-900 dark:border-slate-300 absolute left-0 top-0 bottom-0" style={{ width: `${cards.length > 0 ? 65 : 0}%` }} />
                  <View className="absolute inset-0 items-center justify-center">
                    <Text className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mix-blend-difference">{cards.length > 0 ? '65' : '0'}%</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* ACTION BUTTONS */}
            <View className="flex-row gap-3 mb-10">
              <TouchableOpacity 
                className="flex-1 bg-slate-900 dark:bg-white py-3 px-4 flex-row items-center justify-center rounded-sm border-b-4 border-r-4 border-slate-500 active:translate-x-1 active:translate-y-1 active:border-b-0 active:border-r-0"
                onPress={handleShare}
                disabled={isSharing}
                activeOpacity={1}
              >
                {isSharing ? (
                  <ActivityIndicator size="small" color={colorScheme === 'dark' ? '#0F172A' : '#FFFFFF'} />
                ) : (
                  <>
                    <Ionicons name={deck.isPublic ? "cloud-upload-outline" : "earth-outline"} size={20} color={colorScheme === 'dark' ? '#0F172A' : '#FFFFFF'} className="mr-2" />
                    <Text className="text-white dark:text-slate-900 font-black text-sm tracking-widest uppercase">
                      {deck.isPublic ? "Cập Nhật" : "Công Khai"}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="bg-white dark:bg-slate-800 py-3 px-5 flex-row items-center justify-center rounded-sm border-4 border-slate-900 dark:border-slate-300 active:bg-slate-200"
                onPress={() => navigation.navigate('ImportScreen', { deckId })}
              >
                <Ionicons name="download-outline" size={22} color={colorScheme === 'dark' ? '#FFFFFF' : '#0F172A'} />
              </TouchableOpacity>

              <TouchableOpacity 
                className="bg-red-500 py-3 px-5 flex-row items-center justify-center rounded-sm border-4 border-slate-900 dark:border-slate-300 active:bg-red-600"
                onPress={handleDeleteDeck}
              >
                <Ionicons name="trash" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* NEO-BRUTALIST EDITOR FORM */}
            <View className="bg-[#FFFDF0] dark:bg-slate-800 p-5 border-4 border-slate-900 dark:border-slate-300 rounded-sm mb-10 relative shadow-[4px_4px_0_#0F172A] dark:shadow-[4px_4px_0_#CBD5E1]">
              <View className="absolute -top-3 -right-3 w-6 h-6 bg-yellow-400 border-2 border-slate-900 rounded-full" />
              <Text className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Máy In Thẻ Mới</Text>
              
              {/* Tabs */}
              <View className="flex-row mb-5 border-b border-neutral-200 dark:border-neutral-700">
                <TouchableOpacity 
                  className={`flex-1 pb-3 items-center border-b-2 ${cardType === 'flashcard' ? 'border-teal-500' : 'border-transparent'}`}
                  onPress={() => setCardType('flashcard')}
                >
                  <Text className={`text-xs font-bold uppercase tracking-wider ${cardType === 'flashcard' ? 'text-teal-600 dark:text-teal-400' : 'text-neutral-400'}`}>Thẻ ghi nhớ</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  className={`flex-1 pb-3 items-center border-b-2 ${cardType === 'mcq' ? 'border-teal-500' : 'border-transparent'}`}
                  onPress={() => setCardType('mcq')}
                >
                  <Text className={`text-xs font-bold uppercase tracking-wider ${cardType === 'mcq' ? 'text-teal-600 dark:text-teal-400' : 'text-neutral-400'}`}>Trắc nghiệm</Text>
                </TouchableOpacity>
              </View>

              <TextInput 
                className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 rounded-sm mb-4 font-medium" 
                placeholder="Nhập câu hỏi tại đây..." 
                placeholderTextColor="#A3A3A3"
                value={question} 
                onChangeText={setQuestion} 
              />

              {cardType === 'flashcard' ? (
                <TextInput 
                  className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 rounded-sm mb-6 font-medium" 
                  placeholder="Nhập câu trả lời..." 
                  placeholderTextColor="#A3A3A3"
                  value={answer} 
                  onChangeText={setAnswer} 
                />
              ) : (
                <View className="mb-6">
                  <Text className="text-[10px] text-neutral-500 dark:text-neutral-400 mb-3 uppercase font-bold tracking-widest">Thiết lập đáp án (Đánh dấu đúng)</Text>
                  {options.map((opt, idx) => (
                    <View key={idx} className="flex-row items-center mb-3">
                      <TouchableOpacity 
                        className={`w-6 h-6 mr-3 rounded-sm border items-center justify-center ${correctIndexes.includes(idx) ? 'border-teal-500 bg-teal-500' : 'border-neutral-300 dark:border-neutral-600 bg-transparent'}`}
                        onPress={() => handleToggleCorrect(idx)}
                      >
                        {correctIndexes.includes(idx) && <Ionicons name="checkmark" size={14} color="white" />}
                      </TouchableOpacity>
                      <TextInput 
                        className={`flex-1 px-4 py-2 text-neutral-900 dark:text-white border rounded-sm font-medium ${correctIndexes.includes(idx) ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-900/10' : 'border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900'}`} 
                        placeholder={`Lựa chọn ${String.fromCharCode(65 + idx)}`} 
                        placeholderTextColor="#A3A3A3"
                        value={opt} 
                        onChangeText={(text) => handleUpdateOption(text, idx)} 
                      />
                    </View>
                  ))}
                  <TextInput 
                    className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 rounded-sm mt-2 font-medium text-sm" 
                    placeholder="Giải thích thêm (Tùy chọn)" 
                    placeholderTextColor="#A3A3A3"
                    value={answer} 
                    onChangeText={setAnswer} 
                  />
                </View>
              )}

              <TouchableOpacity 
                className={`py-4 items-center rounded-sm border-b-4 border-r-4 active:translate-x-1 active:translate-y-1 active:border-b-0 active:border-r-0 border-slate-900 dark:border-slate-300 ${isFormValid() ? 'bg-green-400 dark:bg-green-600' : 'bg-slate-200 dark:bg-slate-700 opacity-70'}`} 
                onPress={handleAddCard}
                disabled={!isFormValid()}
                activeOpacity={1}
              >
                <Text className={`font-black text-sm tracking-widest uppercase ${isFormValid() ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>+ Dập Thẻ</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-between items-end mb-4">
              <Text className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">Danh sách thẻ</Text>
              <Text className="text-neutral-400 font-bold">{cards.length}</Text>
            </View>
          </View>
        }
        ListEmptyComponent={() => (
          <View className="items-center py-12 px-6 border border-dashed border-neutral-300 dark:border-neutral-700 mx-5 rounded-sm">
            <Text className="text-neutral-400 dark:text-neutral-500 font-medium text-center">Trống không. Hãy bắt đầu thêm thẻ đầu tiên của bạn.</Text>
          </View>
        )}
        renderItem={({ item, index }) => (
          <SwipeableCardItem
            item={item}
            index={index}
            cardsCount={cards.length}
            onDelete={() => deleteCard(item.cardId)}
            renderCardContent={(item: any, index: number) => (
              <View className="px-5">
                <View 
                  className={`bg-white dark:bg-slate-800 p-5 border-4 border-slate-900 dark:border-slate-300 flex-row items-start relative ${index % 2 === 0 ? '-rotate-1' : 'rotate-1'}`}
                >
                  {/* Fake spiral binding holes */}
                  <View className="absolute left-2 top-2 bottom-2 w-2 flex-col justify-around">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <View key={i} className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-900 border border-slate-400" />
                    ))}
                  </View>

                  <View className="flex-1 pr-4 pl-4">
                    <Text className="font-black text-slate-900 dark:text-white text-lg leading-6 mb-2">{item.question}</Text>
                    {item.options ? (
                      <View className="flex-row items-center mt-1 gap-2">
                        <View className="bg-amber-400 border-2 border-slate-900 px-2 py-0.5">
                          <Text className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Trắc nghiệm</Text>
                        </View>
                        <Text className="text-slate-600 dark:text-slate-400 text-xs font-bold">{item.options.length} lựa chọn</Text>
                      </View>
                    ) : (
                      <View className="flex-row items-start mt-1 gap-2">
                        <View className="bg-blue-400 border-2 border-slate-900 px-2 py-0.5 mt-0.5">
                          <Text className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Đáp án</Text>
                        </View>
                        <Text className="text-slate-700 dark:text-slate-300 font-medium text-sm flex-1 leading-tight">{item.answer}</Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-slate-300 dark:text-slate-600 font-black text-3xl opacity-50 absolute right-3 top-3">
                    {(index + 1).toString().padStart(2, '0')}
                  </Text>
                </View>
              </View>
            )}
          />
        )}
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      />
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
