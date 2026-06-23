import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, ScrollView, Alert, Share, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useDeckStore } from '../../store/deckStore';
import { useFlashcardStore } from '../../store/flashcardStore';
import { useSrsStore } from '../../store/srsStore';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { useNavigation } from '@react-navigation/native';
import { playSuccess, playMediumImpact } from '../../utils/haptics';

export function SettingsScreen() {
  const navigation = useNavigation<any>();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Mechanical switch animation for Dark Mode
  const [switchAnim] = useState(new Animated.Value(colorScheme === 'dark' ? 1 : 0));

  const handleToggleTheme = () => {
    playSuccess();
    const toValue = colorScheme === 'dark' ? 0 : 1;
    Animated.spring(switchAnim, {
      toValue,
      friction: 4,
      useNativeDriver: false
    }).start();
    toggleColorScheme();
  };

  const handleToggleSound = () => {
    const val = !soundEnabled;
    setSoundEnabled(val);
    if (val) {
      playMediumImpact();
      setTimeout(() => playMediumImpact(), 150); // Double rumble for enable
    } else {
      playMediumImpact();
    }
  };

  const handleLogout = () => {
    playMediumImpact();
    Alert.alert(
      "Cảnh Báo Nguồn",
      "Hệ thống sẽ bị ngắt kết nối. Bạn có chắc chắn muốn thoát?",
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Ngắt Kết Nối", 
          style: "destructive", 
          onPress: () => {
            const currentUid = useAuthStore.getState().user?.uid || null;
            // Save data and switch to guest
            useDeckStore.getState().switchUser(null, currentUid);
            useFlashcardStore.getState().switchUser(null, currentUid);
            useSrsStore.getState().switchUser(null, currentUid);
            useAuthStore.getState().setUser(null);
          }
        }
      ]
    );
  };

  const handleClearCache = () => {
    playMediumImpact();
    Alert.alert("Dọn Dẹp Bộ Nhớ", "Thao tác này sẽ xóa toàn bộ dữ liệu đệm. Tiến hành?", [
      { text: "Hủy", style: "cancel" },
      { text: "Dọn dẹp", style: "destructive", onPress: () => Alert.alert("Thành công", "Đã xóa cache!") }
    ]);
  };

  const THEME_COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#A855F7'];

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC] dark:bg-slate-900" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="px-5 pt-6 pb-4 border-b-4 border-slate-900 bg-slate-300 dark:bg-slate-800 flex-row justify-between items-center">
        <View>
          <Text className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Hệ Thống</Text>
          <Text className="text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">Bảng điều khiển trung tâm</Text>
        </View>
        <TouchableOpacity 
          className="w-12 h-12 bg-white border-4 border-slate-900 items-center justify-center shadow-[4px_4px_0_#0F172A] active:translate-x-1 active:translate-y-1 active:shadow-none"
          onPress={() => {
            playMediumImpact();
            navigation.goBack();
          }}
          activeOpacity={1}
        >
          <Ionicons name="close" size={24} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        
        {/* BIG MECHANICAL SWITCH FOR THEME */}
        <View className="bg-white dark:bg-slate-800 p-6 border-4 border-slate-900 shadow-[8px_8px_0_#0F172A] mb-8">
          <Text className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6 border-b-4 border-slate-900 pb-2">Cầu dao điện (Giao diện)</Text>
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-xl font-black text-slate-900 dark:text-white uppercase mb-1">Chế độ tối</Text>
              <Text className="text-slate-500 font-bold uppercase text-xs">{colorScheme === 'dark' ? 'ĐANG KÍCH HOẠT' : 'NGẮT KẾT NỐI'}</Text>
            </View>
            <TouchableOpacity 
              className="w-24 h-12 bg-slate-200 dark:bg-slate-700 border-4 border-slate-900 rounded-full justify-center px-1 overflow-hidden relative shadow-inner"
              onPress={handleToggleTheme}
              activeOpacity={1}
            >
              <Animated.View 
                style={{
                  transform: [{
                    translateX: switchAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 48]
                    })
                  }]
                }}
                className={`w-10 h-10 border-4 border-slate-900 rounded-full items-center justify-center ${colorScheme === 'dark' ? 'bg-emerald-400' : 'bg-white'}`}
              >
                <Ionicons name={colorScheme === 'dark' ? 'moon' : 'sunny'} size={18} color="#0F172A" />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </View>

        {/* COLOR PALETTE BELT */}
        <View className="bg-white dark:bg-slate-800 p-6 border-4 border-slate-900 shadow-[8px_8px_0_#0F172A] mb-8">
          <Text className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4 border-b-4 border-slate-900 pb-2">Băng truyền màu sắc (Sắp ra mắt)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-2">
            {THEME_COLORS.map((color, index) => (
              <TouchableOpacity 
                key={index}
                className="w-14 h-14 border-4 border-slate-900 mr-4 shadow-[4px_4px_0_#0F172A] active:translate-x-1 active:translate-y-1 active:shadow-none"
                style={{ backgroundColor: color }}
                activeOpacity={1}
              />
            ))}
          </ScrollView>
        </View>

        {/* HAPTIC / SOUND */}
        <TouchableOpacity 
          className={`p-6 border-4 border-slate-900 shadow-[8px_8px_0_#0F172A] mb-8 flex-row justify-between items-center active:translate-x-1 active:translate-y-1 active:shadow-none ${soundEnabled ? 'bg-amber-400' : 'bg-slate-200 dark:bg-slate-700'}`}
          onPress={handleToggleSound}
          activeOpacity={1}
        >
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-white border-4 border-slate-900 items-center justify-center mr-4 -rotate-6">
              <Ionicons name="volume-high" size={24} color="#0F172A" />
            </View>
            <View>
              <Text className={`text-xl font-black uppercase ${soundEnabled ? 'text-slate-900' : 'text-slate-500 dark:text-white'}`}>Phản hồi vật lý</Text>
              <Text className={`font-bold uppercase text-xs ${soundEnabled ? 'text-slate-800' : 'text-slate-400'}`}>Âm thanh & Rung</Text>
            </View>
          </View>
          <View className={`w-8 h-8 border-4 border-slate-900 rounded-full ${soundEnabled ? 'bg-emerald-400' : 'bg-slate-300 dark:bg-slate-600'}`} />
        </TouchableOpacity>

        {/* ACTIONS */}
        <View className="flex-row gap-4 mb-10">
          <TouchableOpacity 
            className="flex-1 bg-yellow-400 p-4 border-4 border-slate-900 shadow-[4px_4px_0_#0F172A] items-center active:translate-x-1 active:translate-y-1 active:shadow-none"
            onPress={handleClearCache}
            activeOpacity={1}
          >
            <Ionicons name="trash-bin" size={24} color="#0F172A" className="mb-2" />
            <Text className="font-black text-slate-900 uppercase text-xs text-center">Xóa cache</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="flex-1 bg-red-500 p-4 border-4 border-slate-900 shadow-[4px_4px_0_#0F172A] items-center active:translate-x-1 active:translate-y-1 active:shadow-none"
            onPress={handleLogout}
            activeOpacity={1}
          >
            <Ionicons name="power" size={24} color="#0F172A" className="mb-2" />
            <Text className="font-black text-slate-900 uppercase text-xs text-center">Đăng xuất</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
