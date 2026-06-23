import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform, Animated, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Accelerometer } from 'expo-sensors';
import * as ImagePicker from 'expo-image-picker';
import { playMediumImpact, playSuccess } from '../../utils/haptics';
import { GridBackground } from '../../components/GridBackground';

export function ProfileScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { currentStreak, updateStreak, user, profile, exp, updateProfile } = useAuthStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile?.displayName || '');
  const [editSchool, setEditSchool] = useState(profile?.school || '');
  const [editAddress, setEditAddress] = useState(profile?.address || '');
  const [editBirthday, setEditBirthday] = useState(profile?.birthday || '');
  const [editAvatarUrl, setEditAvatarUrl] = useState(profile?.avatarUrl || '');

  // 3D Hologram Tilt Effect
  const [tiltX] = useState(new Animated.Value(0));
  const [tiltY] = useState(new Animated.Value(0));

  useEffect(() => {
    updateStreak();
    
    // Subscribe to Accelerometer for Hologram effect
    Accelerometer.setUpdateInterval(50);
    const subscription = Accelerometer.addListener(data => {
      Animated.spring(tiltX, {
        toValue: data.y * 20, 
        friction: 4,
        useNativeDriver: true,
      }).start();
      Animated.spring(tiltY, {
        toValue: data.x * 20,
        friction: 4,
        useNativeDriver: true,
      }).start();
    });

    return () => subscription.remove();
  }, []);

  const level = Math.floor(exp / 100) + 1;
  const currentLevelExp = exp % 100;
  const expPercentage = (currentLevelExp / 100) * 100;

  const getRankName = (lvl: number) => {
    if (lvl < 5) return 'Tân binh';
    if (lvl < 10) return 'Học giả';
    if (lvl < 20) return 'Chuyên gia';
    return 'Bậc thầy';
  };

  const handlePickAvatar = async () => {
    playMediumImpact();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setEditAvatarUrl(result.assets[0].uri);
    }
  };

  const handleSaveProfile = () => {
    playSuccess();
    updateProfile({
      displayName: editName.trim(),
      school: editSchool.trim(),
      address: editAddress.trim(),
      birthday: editBirthday.trim(),
      avatarUrl: editAvatarUrl
    });
    setIsEditing(false);
    Alert.alert("Thành công", "Đã cập nhật thông tin cá nhân!");
  };

  const handleCancelEdit = () => {
    playMediumImpact();
    setEditName(profile?.displayName || '');
    setEditSchool(profile?.school || '');
    setEditAddress(profile?.address || '');
    setEditBirthday(profile?.birthday || '');
    setEditAvatarUrl(profile?.avatarUrl || '');
    setIsEditing(false);
  };

  return (
    <View className="flex-1 bg-[#F8FAFC] dark:bg-slate-900 relative">
      <GridBackground />
      {/* Header */}
      <View 
        className="px-5 pb-4 border-b-4 border-slate-900 bg-cyan-400 dark:bg-slate-800 flex-row justify-between items-center"
        style={{ paddingTop: Math.max(insets.top, 24) + 12 }}
      >
        <View>
          <Text className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Hồ Sơ</Text>
          <Text className="text-cyan-900 dark:text-cyan-400 font-bold uppercase tracking-widest text-xs">Căn cước công dân hệ thống</Text>
        </View>
        <TouchableOpacity 
          className="w-12 h-12 bg-white border-4 border-slate-900 items-center justify-center shadow-[4px_4px_0_#0F172A] active:translate-x-1 active:translate-y-1 active:shadow-none"
          onPress={() => {
            playMediumImpact();
            navigation.navigate('Settings');
          }}
          activeOpacity={1}
        >
          <Ionicons name="settings" size={24} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
          
          {/* HOLOGRAM BADGE */}
          <View className="items-center mb-10 mt-6 perspective-[1000px]">
            <Animated.View 
              style={{
                transform: [
                  { rotateX: tiltX.interpolate({ inputRange: [-20, 20], outputRange: ['20deg', '-20deg'] }) },
                  { rotateY: tiltY.interpolate({ inputRange: [-20, 20], outputRange: ['-20deg', '20deg'] }) }
                ]
              }}
              className="w-64 aspect-[3/4] bg-white border-8 border-slate-900 p-4 justify-between shadow-[16px_16px_0_#0F172A] relative overflow-hidden"
            >
              {/* Hologram gradient shine mock */}
              <View className="absolute top-0 left-[-50%] w-[200%] h-12 bg-cyan-300/40 -rotate-45" />
              <View className="absolute top-20 left-[-50%] w-[200%] h-4 bg-fuchsia-300/40 -rotate-45" />

              <View className="flex-row justify-between items-start">
                <View className="border-4 border-slate-900 px-2 py-1 bg-yellow-400 -rotate-3">
                  <Text className="font-black text-slate-900 text-xs uppercase tracking-widest">ID CARD</Text>
                </View>
                <Ionicons name="finger-print" size={32} color="#0F172A" />
              </View>

              <View className="items-center">
                {profile?.avatarUrl ? (
                  <View className="w-24 h-24 border-4 border-slate-900 items-center justify-center mb-4 overflow-hidden bg-slate-200">
                    <Image source={{ uri: profile.avatarUrl }} className="w-full h-full" resizeMode="cover" />
                  </View>
                ) : (
                  <View className="w-24 h-24 bg-slate-200 border-4 border-slate-900 items-center justify-center mb-4">
                    <Ionicons name="person" size={48} color="#0F172A" />
                  </View>
                )}
                <Text className="text-xl font-black text-slate-900 text-center uppercase tracking-tighter" numberOfLines={1}>
                  {profile?.displayName || user?.email?.split('@')[0] || 'Guest'}
                </Text>
                <View className="bg-slate-900 px-3 py-1 mt-2">
                  <Text className="text-white font-black text-xs uppercase tracking-widest">{getRankName(level)}</Text>
                </View>
              </View>

              <View className="flex-row justify-between items-end border-t-4 border-slate-900 pt-2">
                <View>
                  <Text className="text-slate-500 font-black text-[10px] uppercase">LEVEL</Text>
                  <Text className="text-3xl font-black text-slate-900 leading-none">{level}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-slate-500 font-black text-[10px] uppercase">EXP</Text>
                  <Text className="text-xl font-black text-slate-900 leading-none">{exp}</Text>
                </View>
              </View>
            </Animated.View>
            <Text className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-8 text-center">Nghiêng điện thoại để xem hiệu ứng 3D</Text>
          </View>

          {/* BRUTALIST RADAR / POWER STATS */}
          <View className="bg-white dark:bg-slate-800 p-6 rounded-none border-4 border-slate-900 shadow-[4px_4px_0_#0F172A] mb-8">
            <Text className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6 border-b-4 border-slate-900 pb-2">Mạng lưới kỹ năng</Text>
            
            <View className="space-y-4">
              <View>
                <View className="flex-row justify-between mb-1">
                  <Text className="font-black text-slate-700 dark:text-slate-300 uppercase text-xs">Chuyên cần (Streak)</Text>
                  <Text className="font-black text-red-500">{currentStreak}</Text>
                </View>
                <View className="w-full h-6 border-4 border-slate-900 bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <View className="h-full bg-red-500" style={{ width: `${Math.min((currentStreak / 30) * 100, 100)}%` }} />
                </View>
              </View>

              <View>
                <View className="flex-row justify-between mb-1 mt-4">
                  <Text className="font-black text-slate-700 dark:text-slate-300 uppercase text-xs">Tiến trình Level</Text>
                  <Text className="font-black text-yellow-500">{expPercentage.toFixed(0)}%</Text>
                </View>
                <View className="w-full h-6 border-4 border-slate-900 bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <View className="h-full bg-yellow-400" style={{ width: `${expPercentage}%` }} />
                </View>
              </View>
              
              <View>
                <View className="flex-row justify-between mb-1 mt-4">
                  <Text className="font-black text-slate-700 dark:text-slate-300 uppercase text-xs">Tốc độ (Mock)</Text>
                  <Text className="font-black text-blue-500">N/A</Text>
                </View>
                <View className="w-full h-6 border-4 border-slate-900 bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <View className="h-full bg-blue-500 w-1/2" />
                </View>
              </View>
            </View>
          </View>

          {/* PROFILE INFO EDITOR */}
          <View className="bg-white dark:bg-slate-800 p-6 rounded-none border-4 border-slate-900 shadow-[4px_4px_0_#0F172A] mb-6">
            <View className="flex-row justify-between items-center mb-6 border-b-4 border-slate-900 pb-4">
              <Text className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest">Dữ liệu cá nhân</Text>
              {!isEditing && (
                <TouchableOpacity 
                  onPress={() => {
                    playMediumImpact();
                    setIsEditing(true);
                  }}
                  className="bg-cyan-400 border-2 border-slate-900 p-2 shadow-[2px_2px_0_#0F172A] active:translate-y-1 active:translate-x-1 active:shadow-none"
                  activeOpacity={1}
                >
                  <Ionicons name="pencil" size={20} color="#0F172A" />
                </TouchableOpacity>
              )}
            </View>

            {isEditing ? (
              <View>
                <View className="mb-6 items-center">
                  <Text className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase mb-2">Ảnh đại diện</Text>
                  <TouchableOpacity 
                    className="w-24 h-24 border-4 border-slate-900 bg-slate-200 justify-center items-center overflow-hidden active:translate-x-1 active:translate-y-1 shadow-[4px_4px_0_#0F172A] active:shadow-none"
                    onPress={handlePickAvatar}
                    activeOpacity={1}
                  >
                    {editAvatarUrl ? (
                      <Image source={{ uri: editAvatarUrl }} className="w-full h-full" resizeMode="cover" />
                    ) : (
                      <Ionicons name="camera" size={32} color="#94A3B8" />
                    )}
                  </TouchableOpacity>
                </View>

                <View className="mb-4">
                  <Text className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase mb-2">Họ và tên</Text>
                  <TextInput 
                    className="bg-white dark:bg-slate-700 px-4 py-3 rounded-none border-4 border-slate-900 text-slate-900 dark:text-white font-bold"
                    placeholder="VD: Nguyễn Văn A"
                    placeholderTextColor="#94A3B8"
                    value={editName}
                    onChangeText={setEditName}
                  />
                </View>
                
                <View className="mb-4">
                  <Text className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase mb-2">Ngày tháng năm sinh</Text>
                  <TextInput 
                    className="bg-white dark:bg-slate-700 px-4 py-3 rounded-none border-4 border-slate-900 text-slate-900 dark:text-white font-bold"
                    placeholder="VD: 01/01/2000"
                    placeholderTextColor="#94A3B8"
                    value={editBirthday}
                    onChangeText={setEditBirthday}
                  />
                </View>

                <View className="mb-4">
                  <Text className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase mb-2">Căn cứ (Trường học / Công ty)</Text>
                  <TextInput 
                    className="bg-white dark:bg-slate-700 px-4 py-3 rounded-none border-4 border-slate-900 text-slate-900 dark:text-white font-bold"
                    placeholder="VD: ĐHQG Hà Nội"
                    placeholderTextColor="#94A3B8"
                    value={editSchool}
                    onChangeText={setEditSchool}
                  />
                </View>
                
                <View className="mb-6">
                  <Text className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase mb-2">Tọa độ (Địa chỉ)</Text>
                  <TextInput 
                    className="bg-white dark:bg-slate-700 px-4 py-3 rounded-none border-4 border-slate-900 text-slate-900 dark:text-white font-bold"
                    placeholder="VD: Hà Nội, VN"
                    placeholderTextColor="#94A3B8"
                    value={editAddress}
                    onChangeText={setEditAddress}
                  />
                </View>
                
                <View className="flex-row gap-4 mt-2">
                  <TouchableOpacity 
                    className="flex-1 bg-slate-300 dark:bg-slate-600 py-4 rounded-none border-4 border-slate-900 items-center active:translate-x-1 active:translate-y-1 shadow-[4px_4px_0_#0F172A] active:shadow-none"
                    onPress={handleCancelEdit}
                    activeOpacity={1}
                  >
                    <Text className="font-black text-slate-900 uppercase">Hủy Bỏ</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="flex-1 bg-cyan-400 py-4 rounded-none border-4 border-slate-900 items-center active:translate-x-1 active:translate-y-1 shadow-[4px_4px_0_#0F172A] active:shadow-none"
                    onPress={handleSaveProfile}
                    activeOpacity={1}
                  >
                    <Text className="font-black text-slate-900 uppercase">Ghi Đè</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View className="space-y-4">
                <View className="flex-row items-center mb-4">
                  <View className="w-12 h-12 bg-white border-4 border-slate-900 shadow-[2px_2px_0_#0F172A] items-center justify-center mr-4">
                    <Ionicons name="mail" size={24} color="#0F172A" />
                  </View>
                  <View>
                    <Text className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Email Liên Kết</Text>
                    <Text className="text-lg font-black text-slate-900 dark:text-white">{user?.email}</Text>
                  </View>
                </View>

                <View className="flex-row items-center mb-4">
                  <View className="w-12 h-12 bg-white border-4 border-slate-900 shadow-[2px_2px_0_#0F172A] items-center justify-center mr-4">
                    <Ionicons name="calendar" size={24} color="#0F172A" />
                  </View>
                  <View>
                    <Text className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Ngày Sinh</Text>
                    <Text className="text-lg font-black text-slate-900 dark:text-white">{profile?.birthday || 'CHƯA CẬP NHẬT'}</Text>
                  </View>
                </View>

                <View className="flex-row items-center mb-4">
                  <View className="w-12 h-12 bg-white border-4 border-slate-900 shadow-[2px_2px_0_#0F172A] items-center justify-center mr-4">
                    <Ionicons name="school" size={24} color="#0F172A" />
                  </View>
                  <View>
                    <Text className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Căn cứ (Trường học)</Text>
                    <Text className="text-lg font-black text-slate-900 dark:text-white">{profile?.school || 'CHƯA CẤP PHÉP'}</Text>
                  </View>
                </View>

                <View className="flex-row items-center">
                  <View className="w-12 h-12 bg-white border-4 border-slate-900 shadow-[2px_2px_0_#0F172A] items-center justify-center mr-4">
                    <Ionicons name="location" size={24} color="#0F172A" />
                  </View>
                  <View>
                    <Text className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Tọa độ</Text>
                    <Text className="text-lg font-black text-slate-900 dark:text-white">{profile?.address || 'VÔ ĐỊNH'}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
