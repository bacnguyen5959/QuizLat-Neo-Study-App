import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../services/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { getAuthErrorMessage } from '../../utils/authErrors';

export function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<any>();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleReset = async () => {
    if (!email) {
      Alert.alert('Lỗi', 'Vui lòng nhập email của bạn.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Lỗi', 'Địa chỉ email không hợp lệ.');
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Kiểm tra email",
        "Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu vào email của bạn. Vui lòng kiểm tra hộp thư đến hoặc thư rác.",
        [{ text: "Về Đăng Nhập", onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      Alert.alert('Gửi thất bại', getAuthErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      <View className="absolute top-12 left-6 z-10">
        <TouchableOpacity 
          className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-full items-center justify-center border border-gray-100 dark:border-slate-700"
          onPress={() => navigation.goBack()}
          disabled={isLoading}
        >
          <Ionicons name="arrow-back" size={24} color="#64748B" />
        </TouchableOpacity>
      </View>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 px-6 justify-center"
      >
        <View className="items-center mb-10 mt-10">
          <View className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-full items-center justify-center mb-6">
            <Ionicons name="key-outline" size={40} color="#3B82F6" />
          </View>
          <Text className="text-3xl font-bold text-slate-800 dark:text-white text-center">Quên Mật Khẩu?</Text>
          <Text className="text-gray-500 dark:text-gray-400 mt-4 text-base text-center leading-6">
            Đừng lo lắng! Hãy nhập email bạn đã đăng ký để chúng tôi gửi link khôi phục.
          </Text>
        </View>

        <View className="space-y-4">
          <View className="flex-row items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-4 border border-gray-100 dark:border-slate-700">
            <Ionicons name="mail-outline" size={20} color="#9CA3AF" className="mr-3" />
            <TextInput
              placeholder="Email đã đăng ký"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              className="flex-1 text-slate-800 dark:text-white text-base ml-2"
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity 
            className={`bg-blue-600 py-4 rounded-xl items-center mt-6 shadow-sm flex-row justify-center ${isLoading ? 'opacity-70' : ''}`}
            onPress={handleReset}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="send-outline" size={20} color="#FFFFFF" className="mr-2" />
                <Text className="text-white font-bold text-lg">Gửi Link Khôi Phục</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
