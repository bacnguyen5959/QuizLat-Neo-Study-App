import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../services/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { getAuthErrorMessage } from '../../utils/authErrors';

export function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<any>();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }
    
    if (!validateEmail(email)) {
      Alert.alert('Lỗi', 'Địa chỉ email không hợp lệ.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu và Xác nhận mật khẩu không khớp.');
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Send verification email
      await sendEmailVerification(userCredential.user);
      
      Alert.alert(
        'Đăng ký thành công!',
        'Bạn có thể đăng nhập ngay bây giờ. (Tính năng xác thực email đang tạm thời được tắt để thuận tiện test app).',
        [{ text: 'Về Đăng Nhập', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      Alert.alert('Đăng ký thất bại', getAuthErrorMessage(error));
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
          <View className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl items-center justify-center mb-4 shadow-sm border border-gray-100 dark:border-slate-700">
            <Ionicons name="school" size={32} color="#3B82F6" />
          </View>
          <Text className="text-4xl font-bold text-slate-800 dark:text-white">QuizLat</Text>
          <Text className="text-gray-500 dark:text-gray-400 mt-2 text-base text-center">Tạo tài khoản để bắt đầu học</Text>
        </View>

        <View className="space-y-4">
          <View className="flex-row items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-4 border border-gray-100 dark:border-slate-700">
            <Ionicons name="mail-outline" size={20} color="#9CA3AF" className="mr-3" />
            <TextInput
              placeholder="Email của bạn"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              className="flex-1 text-slate-800 dark:text-white text-base ml-2"
              editable={!isLoading}
            />
          </View>

          <View className="flex-row items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-4 mt-4 border border-gray-100 dark:border-slate-700">
            <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" className="mr-3" />
            <TextInput
              placeholder="Mật khẩu (ít nhất 6 ký tự)"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              className="flex-1 text-slate-800 dark:text-white text-base ml-2"
              editable={!isLoading}
            />
          </View>

          <View className="flex-row items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-4 mt-4 border border-gray-100 dark:border-slate-700">
            <Ionicons name="checkmark-circle-outline" size={20} color="#9CA3AF" className="mr-3" />
            <TextInput
              placeholder="Xác nhận mật khẩu"
              placeholderTextColor="#9CA3AF"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              className="flex-1 text-slate-800 dark:text-white text-base ml-2"
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity 
            className={`bg-blue-600 py-4 rounded-xl items-center mt-8 shadow-sm flex-row justify-center ${isLoading ? 'opacity-70' : ''}`}
            onPress={handleRegister}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="person-add-outline" size={20} color="#FFFFFF" className="mr-2" />
                <Text className="text-white font-bold text-lg">Đăng Ký</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center mt-8">
          <Text className="text-gray-500 dark:text-gray-400 text-base">Đã có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.goBack()} disabled={isLoading}>
            <Text className="text-blue-600 dark:text-blue-400 font-bold text-base">Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
