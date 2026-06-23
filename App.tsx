import './global.css';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { DeckListScreen } from './src/screens/deck/DeckListScreen';
import { CreateDeckScreen } from './src/screens/deck/CreateDeckScreen';
import { DeckDetailScreen } from './src/screens/deck/DeckDetailScreen';
import { FlashcardScreen } from './src/screens/study/FlashcardScreen';
import { QuizScreen } from './src/screens/study/QuizScreen';
import { ResultScreen } from './src/screens/study/ResultScreen';
import { ProfileScreen } from './src/screens/social/ProfileScreen';
import { FlashcardHubScreen } from './src/screens/study/FlashcardHubScreen';
import { QuizHubScreen } from './src/screens/study/QuizHubScreen';
import { MistakeReviewScreen } from './src/screens/study/MistakeReviewScreen';
import { AuthScreen } from './src/screens/auth/AuthScreen';
import { useAuthStore } from './src/store/authStore';
import { ForgotPasswordScreen } from './src/screens/auth/ForgotPasswordScreen';
import { RegisterScreen } from './src/screens/auth/RegisterScreen';
import { ImportScreen } from './src/screens/deck/ImportScreen';
import { CommunityScreen } from './src/screens/social/CommunityScreen';
import { QuizSetupScreen } from './src/screens/study/QuizSetupScreen';
import { SettingsScreen } from './src/screens/social/SettingsScreen';
import { TouchableOpacity } from 'react-native';

export type RootStackParamList = {
  Auth: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  MainTabs: undefined;
  CreateDeck: undefined;
  DeckDetail: { deckId: string };
  Flashcard: { deckId: string };
  Quiz: { deckId: string };
  Result: { score: number; total: number; type: string; wrongCards?: any[] };
  MistakeReview: undefined;
  ImportScreen: { deckId: string };
  QuizSetupScreen: { deckId: string };
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tab.Navigator
      id="mainTabs"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'DeckList') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Community') {
            iconName = focused ? 'earth' : 'earth-outline';
          } else if (route.name === 'FlashcardHub') {
            iconName = focused ? 'albums' : 'albums-outline';
          } else if (route.name === 'QuizHub') {
            iconName = focused ? 'game-controller' : 'game-controller-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: isDark ? '#60A5FA' : '#2563EB',
        tabBarInactiveTintColor: isDark ? '#475569' : '#9CA3AF',
        tabBarStyle: { 
          backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
          borderTopColor: isDark ? '#1E293B' : '#E2E8F0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60
        },
        headerShown: true,
        headerStyle: { backgroundColor: isDark ? '#0F172A' : '#FFFFFF' },
        headerTitleStyle: { color: isDark ? '#F8FAFC' : '#1E293B' },
        headerShadowVisible: false,
      })}
    >
      <Tab.Screen name="DeckList" component={DeckListScreen} options={{ title: 'Trang chủ', headerShown: false }} />
      <Tab.Screen name="FlashcardHub" component={FlashcardHubScreen} options={{ title: 'Học thẻ', headerShown: false }} />
      <Tab.Screen name="QuizHub" component={QuizHubScreen} options={{ title: 'Kiểm tra', headerShown: false }} />
      <Tab.Screen name="Community" component={CommunityScreen} options={{ title: 'Khám phá', headerShown: false }} />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Hồ sơ', headerShown: false }} 
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const user = useAuthStore(s => s.user);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const MyTheme = isDark ? DarkTheme : DefaultTheme;

  const stackScreenOptions = {
    headerStyle: { backgroundColor: isDark ? '#0F172A' : '#FFFFFF' },
    headerTitleStyle: { color: isDark ? '#F8FAFC' : '#1E293B' },
    headerTintColor: isDark ? '#F8FAFC' : '#1E293B',
    contentStyle: { backgroundColor: isDark ? '#0F172A' : '#FFFFFF' }
  };

  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator id="root" screenOptions={stackScreenOptions}>
        {!user ? (
          <>
            <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="CreateDeck" component={CreateDeckScreen} options={{ title: 'Tạo Bộ Thẻ', presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="DeckDetail" component={DeckDetailScreen} options={{ title: 'Chi tiết Bộ Thẻ', headerShown: false }} />
            <Stack.Screen name="Flashcard" component={FlashcardScreen} options={{ title: 'Học Thẻ', presentation: 'fullScreenModal', headerShown: false }} />
            <Stack.Screen name="QuizSetupScreen" component={QuizSetupScreen} options={{ title: 'Chuẩn Bị Thi', presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: 'Làm Quiz', presentation: 'fullScreenModal', headerShown: false }} />
            <Stack.Screen name="Result" component={ResultScreen} options={{ title: 'Kết Quả', headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="MistakeReview" component={MistakeReviewScreen} options={{ title: 'Ôn Tập SRS', presentation: 'fullScreenModal', headerShown: false }} />
            <Stack.Screen name="ImportScreen" component={ImportScreen} options={{ title: 'Nhập Dữ Liệu', headerShown: false }} />
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false, presentation: 'modal' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
