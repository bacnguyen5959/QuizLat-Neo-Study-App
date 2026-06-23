import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView, Animated, Dimensions, RefreshControl, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Deck, useDeckStore } from '../../store/deckStore';
import { useFlashcardStore } from '../../store/flashcardStore';
import { getPublicDecks, importDeckById, getLeaderboard } from '../../services/firestoreService';
import { auth } from '../../services/firebase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { playMediumImpact, playSuccess } from '../../utils/haptics';
import { GridBackground } from '../../components/GridBackground';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;
const CARD_SPACING = (width - CARD_WIDTH) / 2;

export function CommunityScreen() {
  const [activeTab, setActiveTab] = useState<'decks' | 'leaderboard'>('decks');
  const [publicDecks, setPublicDecks] = useState<Deck[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [importingDeckId, setImportingDeckId] = useState<string | null>(null);

  const { addDeck } = useDeckStore();
  const { addCard } = useFlashcardStore();
  const insets = useSafeAreaInsets();
  
  const scrollX = useRef(new Animated.Value(0)).current;

  const fetchData = async () => {
    try {
      const [decks, topUsers] = await Promise.all([
        getPublicDecks(),
        getLeaderboard()
      ]);
      setPublicDecks(decks);
      setLeaderboard(topUsers);
    } catch (error: any) {
      Alert.alert("Lỗi", "Không thể tải dữ liệu.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  const handleImport = async (deckId: string) => {
    playMediumImpact();
    setImportingDeckId(deckId);
    try {
      const { deck, flashcards } = await importDeckById(deckId);
      addDeck(deck);
      flashcards.forEach(c => addCard(c));
      playSuccess();
      Alert.alert("Thành công", `Đã tải bộ thẻ "${deck.name}" về máy!`);
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể tải bộ thẻ.");
    } finally {
      setImportingDeckId(null);
    }
  };

  const renderDeckItem = ({ item, index }: { item: Deck, index: number }) => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      (index + 1) * CARD_WIDTH,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp',
    });

    const rotate = scrollX.interpolate({
      inputRange,
      outputRange: ['-5deg', '0deg', '5deg'],
      extrapolate: 'clamp',
    });

    const currentUserEmail = auth.currentUser?.email;
    const isOwnDeck = item.creatorEmail && currentUserEmail && item.creatorEmail === currentUserEmail;

    return (
      <Animated.View 
        style={{ 
          width: CARD_WIDTH, 
          justifyContent: 'center',
          paddingVertical: 40,
          transform: [{ scale }, { rotate }] 
        }} 
      >
        <View style={styles.deckCard}>
          <View>
            <View style={[styles.deckBadge, isOwnDeck ? styles.ownDeckBadge : null]}>
              <Text style={[styles.deckBadgeText, isOwnDeck ? styles.ownDeckBadgeText : null]}>
                {isOwnDeck ? 'Bộ thẻ của bạn' : 'Bộ thẻ công khai'}
              </Text>
            </View>
            <Text style={styles.deckTitle}>{item.name}</Text>
            {item.description ? (
              <Text style={styles.deckDesc} numberOfLines={3}>{item.description}</Text>
            ) : null}
          </View>
          
          <View style={styles.deckFooter}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.deckAuthorLabel}>Tác giả</Text>
              <Text style={styles.deckAuthorValue} numberOfLines={1}>
                {isOwnDeck ? 'Bạn' : (item.creatorName || 'Hệ thống')}
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.importBtn, importingDeckId === item.deckId ? styles.importBtnDisabled : styles.importBtnActive]}
              onPress={() => handleImport(item.deckId)}
              disabled={importingDeckId === item.deckId}
              activeOpacity={1}
            >
              {importingDeckId === item.deckId ? (
                <ActivityIndicator size="small" color="#0F172A" />
              ) : (
                <>
                  <Ionicons name="download" size={20} color="#0F172A" />
                  <Text style={styles.importBtnText}>Tải Về</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderSimpleLeaderboard = () => {
    if (leaderboard.length === 0) {
      return (
        <View style={styles.emptyLb}>
          <Ionicons name="trophy-outline" size={60} color="#94A3B8" />
          <Text style={styles.emptyLbText}>Bảng Vàng Trống</Text>
        </View>
      );
    }

    return (
      <View>
        {leaderboard.map((item, index) => {
          const rank = index + 1;
          const level = Math.floor((item.exp || 0) / 100) + 1;
          const displayName = item.displayName || (item.email ? item.email.split('@')[0] : 'Ẩn danh');
          
          let iconName: any = "medal-outline";
          let iconColor = "#94A3B8";
          let bgColor = "#FFFFFF";

          if (rank === 1) { iconName = "trophy"; iconColor = "#EAB308"; bgColor = "#FEF08A"; }
          if (rank === 2) { iconName = "medal"; iconColor = "#9CA3AF"; bgColor = "#F3F4F6"; }
          if (rank === 3) { iconName = "medal"; iconColor = "#EA580C"; bgColor = "#FFEDD5"; }

          return (
            <View key={item.id || index.toString()} style={[styles.lbItem, { backgroundColor: bgColor }]}>
              <View style={[styles.lbRankBoxSimple, { backgroundColor: '#FFFFFF' }]}>
                {rank <= 3 ? <Ionicons name={iconName} size={24} color={iconColor} /> : <Text style={styles.lbRankText}>{rank}</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.lbName} numberOfLines={1}>{displayName}</Text>
                <Text style={styles.lbLevel}>Cấp {level}</Text>
              </View>
              <View style={styles.lbExpBox}>
                <Text style={styles.lbExpText}>{item.exp}</Text>
                <Text style={styles.lbExpLabel}>EXP</Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.safeArea}>
      <GridBackground />
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 24) + 12 }]}>
        <Text style={styles.headerTitle}>Cộng Đồng</Text>
        <Text style={styles.headerSub}>Khám phá & Cạnh tranh</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'decks' ? styles.tabBtnActive : styles.tabBtnInactive]}
          onPress={() => { playMediumImpact(); setActiveTab('decks'); }}
          activeOpacity={1}
        >
          <Text style={[styles.tabText, activeTab === 'decks' ? styles.tabTextActive : styles.tabTextInactive]}>Kho Thẻ</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'leaderboard' ? styles.tabBtnActiveLB : styles.tabBtnInactive, { flexDirection: 'row' }]}
          onPress={() => { playMediumImpact(); setActiveTab('leaderboard'); }}
          activeOpacity={1}
        >
          <Ionicons name="trophy" size={18} color={activeTab === 'leaderboard' ? '#0F172A' : '#64748B'} style={{ marginRight: 8 }} />
          <Text style={[styles.tabText, activeTab === 'leaderboard' ? styles.tabTextActive : styles.tabTextInactive]}>Bảng Vàng</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0F172A" />
        </View>
      ) : (
        <ScrollView 
          style={{ flex: 1, backgroundColor: '#F8FAFC' }}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#0F172A" />}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'decks' ? (
            /* DECKS VIEW */
            <View style={{ flex: 1, paddingVertical: 20 }}>
              {publicDecks.length === 0 ? (
                <View style={styles.emptyLb}>
                  <Ionicons name="earth" size={80} color="#94A3B8" />
                  <Text style={styles.emptyLbText}>Chưa có bộ thẻ nào</Text>
                </View>
              ) : (
                <Animated.FlatList
                  data={publicDecks}
                  keyExtractor={(item) => item.deckId}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  snapToInterval={CARD_WIDTH}
                  decelerationRate="fast"
                  contentContainerStyle={{ paddingHorizontal: CARD_SPACING, alignItems: 'center' }}
                  onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: true }
                  )}
                  scrollEventThrottle={16}
                  renderItem={renderDeckItem}
                />
              )}
            </View>
          ) : (
            /* LEADERBOARD VIEW */
            <View style={{ flex: 1, padding: 20 }}>
              {renderSimpleLeaderboard()}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16, borderBottomWidth: 4, borderColor: '#0F172A', backgroundColor: '#A855F7' },
  headerTitle: { fontSize: 30, fontWeight: '900', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: -0.5, marginBottom: 8 },
  headerSub: { color: '#F3E8FF', fontWeight: 'bold' },
  tabContainer: { flexDirection: 'row', padding: 16, gap: 16, borderBottomWidth: 4, borderColor: '#0F172A', backgroundColor: '#FFFFFF' },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#0F172A' },
  tabBtnActive: { backgroundColor: '#C084FC', shadowColor: '#0F172A', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, transform: [{ translateY: -4 }] },
  tabBtnActiveLB: { backgroundColor: '#FACC15', shadowColor: '#0F172A', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, transform: [{ translateY: -4 }] },
  tabBtnInactive: { backgroundColor: '#F1F5F9' },
  tabText: { fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  tabTextActive: { color: '#0F172A' },
  tabTextInactive: { color: '#64748B' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyLb: { alignItems: 'center', marginTop: 40, borderWidth: 4, borderColor: '#CBD5E1', borderStyle: 'dashed', padding: 32 },
  emptyLbText: { color: '#94A3B8', fontWeight: '900', marginTop: 16, textTransform: 'uppercase' },
  lbItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, marginBottom: 16, borderWidth: 4, borderColor: '#0F172A', shadowColor: '#0F172A', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4 },
  lbRankBoxSimple: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#0F172A', marginRight: 16 },
  lbRankBox: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 4, marginRight: 16, transform: [{ rotate: '-6deg' }], borderColor: '#0F172A', backgroundColor: '#E2E8F0' },
  lbRankText: { fontWeight: '900', fontSize: 20, color: '#0F172A' },
  lbName: { fontSize: 18, fontWeight: '900', color: '#0F172A', textTransform: 'uppercase', letterSpacing: -0.5 },
  lbLevel: { color: '#64748B', fontWeight: 'bold', textTransform: 'uppercase', fontSize: 12, letterSpacing: 1 },
  lbExpBox: { alignItems: 'flex-end', backgroundColor: '#0F172A', paddingHorizontal: 12, paddingVertical: 8, borderWidth: 2, borderColor: '#0F172A' },
  lbExpText: { fontSize: 20, fontWeight: '900', color: '#FFFFFF' },
  lbExpLabel: { color: '#94A3B8', fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  deckCard: { backgroundColor: '#FEF08A', marginHorizontal: 8, padding: 24, borderWidth: 4, borderColor: '#0F172A', shadowColor: '#0F172A', shadowOffset: { width: 8, height: 8 }, shadowOpacity: 1, shadowRadius: 0, aspectRatio: 0.75, justifyContent: 'space-between' },
  deckBadge: { backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#0F172A', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, marginBottom: 16, transform: [{ rotate: '3deg' }] },
  ownDeckBadge: { backgroundColor: '#4ADE80', transform: [{ rotate: '-3deg' }] },
  deckBadgeText: { color: '#0F172A', fontWeight: '900', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  ownDeckBadgeText: { color: '#0F172A' },
  deckTitle: { fontSize: 24, fontWeight: '900', color: '#0F172A', textTransform: 'uppercase', marginBottom: 8 },
  deckDesc: { color: '#334155', fontWeight: 'bold' },
  deckFooter: { borderTopWidth: 4, borderColor: '#0F172A', paddingTop: 16, marginTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  deckAuthorLabel: { color: '#64748B', fontWeight: '900', textTransform: 'uppercase', fontSize: 10, letterSpacing: 1 },
  deckAuthorValue: { color: '#0F172A', fontWeight: 'bold' },
  importBtn: { borderWidth: 4, borderColor: '#0F172A', paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center' },
  importBtnActive: { backgroundColor: '#22D3EE', shadowColor: '#0F172A', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0 },
  importBtnDisabled: { backgroundColor: '#CBD5E1' },
  importBtnText: { color: '#0F172A', fontWeight: '900', fontSize: 16, marginLeft: 8, textTransform: 'uppercase', letterSpacing: 1 }
});
