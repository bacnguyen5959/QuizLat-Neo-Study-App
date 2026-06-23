import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useDeckStore } from '../../store/deckStore';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { playSuccess, playMediumImpact } from '../../utils/haptics';

export function CreateDeckScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { addDeck } = useDeckStore();
  const navigation = useNavigation();

  const handleCreate = () => {
    if (!name.trim()) return;
    playSuccess();
    addDeck({
      deckId: Date.now().toString(),
      name,
      description,
      createdAt: Date.now(),
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC] dark:bg-slate-900" edges={['top', 'bottom']}>
      {/* Brutalist Header */}
      <View className="px-5 pt-6 pb-4 border-b-4 border-slate-900 bg-[#38BDF8] dark:bg-slate-800 flex-row items-center justify-between">
        <View>
          <Text className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">Tạo Thẻ</Text>
          <Text className="text-slate-800 dark:text-gray-300 font-bold uppercase text-xs tracking-widest">Khởi tạo dữ liệu</Text>
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
          
          {/* Deck Name Input */}
          <View className="mb-8">
            <View className="flex-row items-center mb-3">
              <View className="w-8 h-8 bg-amber-300 border-4 border-slate-900 items-center justify-center mr-3 transform -rotate-6">
                <Ionicons name="flash" size={16} color="#0F172A" />
              </View>
              <Text className="text-slate-900 dark:text-white font-black uppercase text-lg tracking-widest">Tên Bộ Thẻ</Text>
            </View>
            <View className="bg-white dark:bg-slate-800 border-4 border-slate-900 shadow-[4px_4px_0_#0F172A] p-1">
              <TextInput
                className="text-slate-900 dark:text-white font-black text-xl py-3 px-4"
                placeholder="Vd: Tiếng Anh giao tiếp..."
                placeholderTextColor="#94A3B8"
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>
          
          {/* Deck Description Input */}
          <View className="mb-8">
            <View className="flex-row items-center mb-3">
              <View className="w-8 h-8 bg-pink-400 border-4 border-slate-900 items-center justify-center mr-3 transform rotate-6">
                <Ionicons name="text" size={16} color="#0F172A" />
              </View>
              <Text className="text-slate-900 dark:text-white font-black uppercase text-lg tracking-widest">Mô tả chi tiết</Text>
            </View>
            <View className="bg-white dark:bg-slate-800 border-4 border-slate-900 shadow-[4px_4px_0_#0F172A] p-1">
              <TextInput
                className="text-slate-900 dark:text-white font-bold text-base h-32 py-3 px-4"
                placeholder="Bạn định học gì trong bộ thẻ này?"
                placeholderTextColor="#94A3B8"
                multiline
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
              />
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity 
            className={`py-4 items-center justify-center flex-row border-4 border-slate-900 shadow-[4px_4px_0_#0F172A] active:translate-x-1 active:translate-y-1 active:shadow-none mb-12 ${name.trim() ? 'bg-green-400 dark:bg-green-600' : 'bg-slate-300 dark:bg-slate-700'}`}
            onPress={handleCreate}
            disabled={!name.trim()}
            activeOpacity={1}
          >
            <Ionicons name="save" size={24} color={name.trim() ? '#0F172A' : '#64748B'} className="mr-2" />
            <Text className={`font-black text-lg uppercase tracking-widest ml-2 ${name.trim() ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Tạo Bộ Thẻ</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
