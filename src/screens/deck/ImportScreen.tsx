import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useFlashcardStore } from '../../store/flashcardStore';
import { useDeckStore } from '../../store/deckStore';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { playSuccess, playMediumImpact } from '../../utils/haptics';
import { GridBackground } from '../../components/GridBackground';

export function ImportScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  
  // If deckId is passed, we add to existing deck. Otherwise, we create a new one.
  const existingDeckId = route.params?.deckId;
  const isCreatingNew = !existingDeckId;

  const [deckName, setDeckName] = useState('');
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const addCard = useFlashcardStore(s => s.addCard);
  const addDeck = useDeckStore(s => s.addDeck);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/plain', 'text/csv'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      if (!file.name.endsWith('.txt') && !file.name.endsWith('.csv')) {
        Alert.alert('Lỗi', 'Chỉ hỗ trợ file định dạng .txt hoặc .csv');
        return;
      }

      setIsProcessing(true);
      // Fixed: FileSystem.EncodingType is an enum in newer SDKs, so using literal 'utf8' ensures compatibility 
      // without TS issues if types are mismatched.
      const fileContent = await FileSystem.readAsStringAsync(file.uri, { encoding: 'utf8' });
      setInputText(fileContent);
      setIsProcessing(false);
      
      // Auto-fill deck name if creating new
      if (isCreatingNew && !deckName) {
        setDeckName(file.name.replace(/\.[^/.]+$/, ""));
      }
      
      playSuccess();
      Alert.alert('Thành công', 'Đã đọc dữ liệu từ file. Vui lòng kiểm tra lại trong ô nội dung bên dưới.');
    } catch (error) {
      setIsProcessing(false);
      Alert.alert('Lỗi', 'Không thể đọc file. Vui lòng thử lại.');
      console.error(error);
    }
  };

  const handleImport = () => {
    if (isCreatingNew && !deckName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên bộ thẻ.');
      return;
    }

    if (!inputText.trim()) {
      Alert.alert('Lỗi', 'Vui lòng dán dữ liệu vào khung chứa hoặc chọn File.');
      return;
    }

    const lines = inputText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    let successCount = 0;
    let failCount = 0;
    
    const newCards: any[] = [];
    const targetDeckId = isCreatingNew ? Date.now().toString() : existingDeckId;

    lines.forEach(line => {
      // Try splitting by Pipe '|', then Tab '\t', then Comma ','
      let parts = line.split('|');
      if (parts.length < 2) parts = line.split('\t');
      if (parts.length < 2) parts = line.split(',');

      if (parts.length >= 2) {
        const question = parts[0].trim();
        const answer = parts.slice(1).join(',').trim(); // Join in case answer has commas

        if (question && answer) {
          newCards.push({
            cardId: Math.random().toString(36).substring(7),
            deckId: targetDeckId,
            question,
            answer,
            createdAt: Date.now()
          });
          successCount++;
        } else {
          failCount++;
        }
      } else {
        failCount++;
      }
    });

    if (successCount === 0) {
      Alert.alert('Lỗi', 'Không tìm thấy thẻ nào hợp lệ. Vui lòng kiểm tra lại định dạng.');
      return;
    }

    // Save Deck if creating new
    if (isCreatingNew) {
      addDeck({
        deckId: targetDeckId,
        name: deckName.trim(),
        description: 'Tạo từ tính năng Import File',
        createdAt: Date.now()
      });
    }

    // Save Cards (bulk update would be better, but we loop for simplicity unless there are thousands)
    newCards.forEach(c => addCard(c));

    playSuccess();
    Alert.alert(
      'Hoàn tất nhập liệu',
      `Tạo thành công: ${successCount} thẻ.\nBỏ qua do lỗi định dạng: ${failCount} dòng.`,
      [{ text: 'OK', onPress: () => {
        if (isCreatingNew) {
          navigation.navigate('MainTabs'); // Or navigate to the new Deck
        } else {
          navigation.goBack();
        }
      }}]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC] dark:bg-slate-900 relative" edges={['top', 'bottom']}>
      <GridBackground />
      {/* Brutalist Header */}
      <View className="px-5 pt-6 pb-4 border-b-4 border-slate-900 bg-[#FCD34D] dark:bg-slate-800 flex-row items-center justify-between">
        <View>
          <Text className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">Nhập Tệp</Text>
          <Text className="text-slate-800 dark:text-gray-300 font-bold uppercase text-xs tracking-widest">Nạp Dữ Liệu Nhanh</Text>
        </View>
        <TouchableOpacity 
          className="w-10 h-10 bg-white border-4 border-slate-900 items-center justify-center active:translate-y-1 active:translate-x-1 shadow-[2px_2px_0_#0F172A] active:shadow-none"
          onPress={() => { playMediumImpact(); navigation.goBack(); }}
          activeOpacity={1}
        >
          <Ionicons name="close" size={24} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
          
          <View className="mb-6 border-4 border-slate-900 p-4 bg-[#67E8F9] shadow-[4px_4px_0_#0F172A]">
            <Text className="text-lg font-black text-slate-900 uppercase tracking-widest mb-2">Hướng dẫn nạp thẻ</Text>
            <Text className="text-slate-800 font-bold leading-5">
              Bạn có thể dán nội dung vào ô bên dưới, hoặc tải tệp .TXT hoặc .CSV (có thể xuất từ Excel).
            </Text>
          </View>

          {isCreatingNew && (
            <View className="mb-6">
              <View className="flex-row items-center mb-2">
                <Ionicons name="folder-open" size={20} color="#0F172A" className="mr-2" />
                <Text className="text-slate-900 dark:text-white font-black uppercase text-sm tracking-widest">Tên Bộ Thẻ Mới</Text>
              </View>
              <View className="bg-white dark:bg-slate-800 border-4 border-slate-900 shadow-[2px_2px_0_#0F172A] p-1">
                <TextInput 
                  className="text-slate-900 dark:text-white font-bold text-lg py-3 px-4"
                  placeholder="Ví dụ: Từ vựng Toeic 600"
                  placeholderTextColor="#94A3B8"
                  value={deckName}
                  onChangeText={setDeckName}
                />
              </View>
            </View>
          )}

          <TouchableOpacity 
            className="bg-[#A78BFA] border-4 border-slate-900 p-4 flex-row items-center justify-center mb-8 shadow-[4px_4px_0_#0F172A] active:translate-x-1 active:translate-y-1 active:shadow-none"
            onPress={pickDocument}
            disabled={isProcessing}
            activeOpacity={1}
          >
            {isProcessing ? (
              <ActivityIndicator color="#0F172A" />
            ) : (
              <>
                <Ionicons name="document-text" size={24} color="#0F172A" className="mr-2" />
                <Text className="text-slate-900 font-black text-base uppercase tracking-widest">Chọn File (.TXT, .CSV)</Text>
              </>
            )}
          </TouchableOpacity>

          <View className="bg-[#FCA5A5] p-4 border-4 border-slate-900 shadow-[4px_4px_0_#0F172A] mb-6">
            <Text className="font-black text-slate-900 uppercase tracking-widest mb-2 text-sm">Mẫu Định Dạng (TXT):</Text>
            <Text className="text-slate-800 font-bold text-xs mb-3 leading-5">Mỗi dòng 1 thẻ. Ngăn cách bởi Dấu Gạch Đứng (|) hoặc Phẩy (,)</Text>
            <View className="bg-slate-900 p-3">
              <Text className="text-green-400 font-mono text-sm font-bold">Apple | Quả táo</Text>
              <Text className="text-green-400 font-mono text-sm font-bold mt-1">Banana | Quả chuối</Text>
            </View>
          </View>

          <View className="bg-white dark:bg-slate-800 border-4 border-slate-900 shadow-[4px_4px_0_#0F172A] p-1 mb-8">
            <TextInput
              className="text-slate-900 dark:text-white text-base font-bold p-3 h-48"
              placeholder="Nội dung tệp sẽ hiện ở đây, hoặc bạn có thể tự dán vào..."
              placeholderTextColor="#94A3B8"
              multiline
              textAlignVertical="top"
              value={inputText}
              onChangeText={setInputText}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity
            className="bg-[#4ADE80] w-full p-4 items-center flex-row justify-center border-4 border-slate-900 shadow-[4px_4px_0_#0F172A] mb-12 active:translate-x-1 active:translate-y-1 active:shadow-none"
            onPress={handleImport}
            activeOpacity={1}
          >
            <Ionicons name="save" size={24} color="#0F172A" className="mr-2" />
            <Text className="text-slate-900 font-black text-lg uppercase tracking-widest">Lưu Dữ Liệu</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
