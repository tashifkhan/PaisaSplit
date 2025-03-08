import { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  TextInput,
  Modal,
} from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';
import AddExpense from '@/components/AddExpense';

function AmountDisplay({
  amount,
  style,
  showPrefix = true,
  type,
}: {
  amount: number;
  style?: any;
  showPrefix?: boolean;
  type?: 'get' | 'owe' | 'settled';
}) {
  const roundedAmount = Math.round(amount);
  const amountString = roundedAmount.toLocaleString('en-IN');
  const shouldSplit = amountString.length > 8;

  if (shouldSplit) {
    return (
      <View style={styles.amountContainer}>
        <Text style={[style, styles.amountText]}>₹{amountString}</Text>
      </View>
    );
  }

  return <Text style={[style]}>₹{amountString}</Text>;
}

export default function GroupTransactionScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const params = useLocalSearchParams();
  const groupId = params.id as string;

  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchAnimation = useMemo(() => new Animated.Value(0), []);
  const [showAddExpense, setShowAddExpense] = useState(false);

  const toggleSearch = () => {
    setIsSearching(!isSearching);
    Animated.spring(searchAnimation, {
      toValue: isSearching ? 0 : 1,
      useNativeDriver: true,
      friction: 12,
      tension: 100,
    }).start();
  };

  const groupData = {
    name: 'Chakna',
    totalAmount: 33.75,
    type: 'get',
    members: [{ name: 'Shashwat S.', amount: 33.75, type: 'owe' }],
    transactions: [
      {
        date: 'November 2024',
        items: [
          {
            description: 'Tashif A. paid Nipun P.',
            amount: 18.75,
            type: 'payment',
            date: 'Nov 19',
          },
        ],
      },
      {
        date: 'September 2024',
        items: [
          {
            description: 'Settle all balances',
            amount: 33.75,
            type: 'settlement',
            date: 'Sept 21',
          },
        ],
      },
      {
        date: 'July 2024',
        items: [
          {
            description: 'Settle all balances',
            amount: 33.75,
            type: 'settlement',
            date: 'Jul 31',
          },
        ],
      },
      {
        date: 'March 2024',
        items: [
          {
            description: 'Settle all balances',
            amount: 33.75,
            type: 'settlement',
            date: 'Mar 12',
          },
          {
            description: 'Chakna 2',
            amount: 210.0,
            type: 'expense',
            date: 'Mar 12',
            paidBy: 'Nipun P.',
          },
          {
            description: 'Chakna 1',
            amount: 135.0,
            type: 'expense',
            date: 'Mar 12',
            paidBy: 'You',
          },
        ],
      },
    ],
  };

  const filteredTransactions = useMemo(() => {
    if (!searchQuery) return groupData.transactions;

    return groupData.transactions
      .map((month) => ({
        date: month.date,
        items: month.items.filter((item) =>
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter((month) => month.items.length > 0);
  }, [groupData.transactions, searchQuery]);

  const handleSettingsPress = () => {
    router.push({
      pathname: '/group/settings',
      params: { groupId },
    });
  };

  const headerBackground = useMemo(() => {
    return colorScheme === 'dark'
      ? (['#00000000', colors.background] as const)
      : (['#ffffff00', colors.background] as const);
  }, [colorScheme]);

  const getDateTextColor = useMemo(() => {
    return colorScheme === 'dark'
      ? colors.text + 'E6' // Higher opacity (90%) in dark mode for better legibility
      : colors.text + '90'; // Original opacity in light mode
  }, [colorScheme, colors.text]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={headerBackground}
          style={styles.headerGradient}
          pointerEvents="none"
        />

        <View style={styles.header}>
          <Pressable
            onPress={() => (isSearching ? toggleSearch() : router.back())}
            style={({ pressed }) => [
              styles.backButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <BlurView intensity={80} style={styles.backButtonBlur}>
              <Ionicons
                name={isSearching ? 'close' : 'chevron-back'}
                size={24}
                color={colors.text}
              />
            </BlurView>
          </Pressable>

          <Animated.View
            style={[
              styles.searchContainer,
              {
                transform: [
                  {
                    translateX: searchAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0], // Update translation values
                    }),
                  },
                ],
                opacity: searchAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
              },
            ]}
          >
            <BlurView intensity={80} style={styles.searchBar}>
              <Ionicons name="search" size={20} color={colors.text} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Search transactions..."
                placeholderTextColor={colors.text + '80'}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </BlurView>
          </Animated.View>

          {!isSearching ? (
            <>
              <Pressable
                onPress={toggleSearch}
                style={({ pressed }) => [
                  styles.searchButton,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <BlurView intensity={80} style={styles.backButtonBlur}>
                  <Ionicons name="search" size={24} color={colors.text} />
                </BlurView>
              </Pressable>
              <Pressable
                onPress={handleSettingsPress}
                style={({ pressed }) => [
                  styles.settingsButton,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <BlurView intensity={80} style={styles.backButtonBlur}>
                  <Ionicons
                    name="settings-outline"
                    size={24}
                    color={colors.text}
                  />
                </BlurView>
              </Pressable>
            </>
          ) : null}
        </View>

        {!isSearching ? (
          <>
            <View style={styles.profileSection}>
              <View style={[styles.avatar, { backgroundColor: colors.tint }]}>
                <Text style={styles.avatarText}>{groupData.name[0]}</Text>
              </View>
              <Text style={[styles.name, { color: colors.text }]}>
                {groupData.name}
              </Text>
            </View>

            <BlurView
              intensity={40}
              style={[
                styles.balanceSection,
                styles.card,
                // {
                //   shadowColor: '#000',
                //   shadowOffset: { width: 0, height: 4 },
                //   shadowOpacity: colorScheme === 'dark' ? 0.3 : 0.15,
                //   shadowRadius: 12,
                //   elevation: 8,
                // },
              ]}
            >
              <LinearGradient
                colors={[colors.tint + '20', colors.tint + '05']}
                style={styles.cardGradient}
              />
              <View style={styles.cardHeader}>
                <Text style={[styles.balanceAmount, { color: colors.text }]}>
                  ₹{groupData.totalAmount.toFixed(2)}
                </Text>
                <Text style={[styles.balanceLabel, { color: colors.text }]}>
                  {groupData.type === 'get' ? 'You are owed' : 'You owe'}
                </Text>
              </View>
              <View style={styles.divider} />
              {groupData.members.map((member, index) => (
                <Text
                  key={index}
                  style={[styles.expenseBreakdown, { color: colors.text }]}
                >
                  {member.name} {member.type === 'owe' ? 'owes' : 'gets'} ₹
                  {member.amount}
                </Text>
              ))}
            </BlurView>

            <View style={styles.actionButtons}>
              <Pressable
                style={({ pressed }) => [
                  styles.settleButton,
                  {
                    backgroundColor: colors.tint,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: colorScheme === 'dark' ? 0.3 : 0.15,
                    shadowRadius: 12,
                    elevation: 8,
                  },
                ]}
              >
                <Text style={styles.settleButtonText}>Add expense</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.remindButton,
                  {
                    backgroundColor: colors.background,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: colorScheme === 'dark' ? 0.3 : 0.15,
                    shadowRadius: 12,
                    elevation: 8,
                  },
                ]}
              >
                <Text style={[styles.remindButtonText, { color: colors.tint }]}>
                  Settle up
                </Text>
              </Pressable>
            </View>
          </>
        ) : null}

        <View style={styles.transactionList}>
          {filteredTransactions.map((month, monthIndex) => (
            <View key={monthIndex} style={styles.monthGroup}>
              <Text
                style={[
                  styles.monthHeader,
                  {
                    color: colors.text,
                    opacity: colorScheme === 'dark' ? 0.9 : 1,
                  },
                ]}
              >
                {month.date}
              </Text>
              {month.items.map((transaction, transactionIndex) => (
                <Pressable
                  key={transactionIndex}
                  onPress={() =>
                    router.push(`/group/transaction/${transactionIndex}`)
                  }
                  style={({ pressed }) => [
                    styles.transactionItem,
                    {
                      backgroundColor:
                        colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7',
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: colorScheme === 'dark' ? 0.3 : 0.1,
                      shadowRadius: 8,
                      elevation: 3,
                    },
                  ]}
                >
                  <View style={styles.transactionIcon}>
                    <Ionicons
                      name={
                        transaction.type === 'payment'
                          ? 'swap-horizontal'
                          : transaction.type === 'settlement'
                          ? 'checkmark-circle'
                          : 'cart'
                      }
                      size={24}
                      color={colors.tint}
                    />
                  </View>
                  <View style={styles.transactionDetails}>
                    <View style={styles.transactionHeader}>
                      <Text
                        style={[
                          styles.transactionTitle,
                          { color: colors.text },
                        ]}
                      >
                        {transaction.description}
                      </Text>
                      <Text
                        style={[
                          styles.transactionAmount,
                          { color: colors.text },
                        ]}
                      >
                        <Text> ₹{transaction.amount.toFixed(2)}</Text>
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.transactionDate,
                        {
                          color:
                            colorScheme === 'dark'
                              ? '#9999AA80'
                              : getDateTextColor,
                        },
                      ]}
                    >
                      {transaction.type === 'expense' && transaction.paidBy
                        ? `${transaction.paidBy} paid · ${transaction.date}`
                        : transaction.date}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <Pressable
        style={({ pressed }) => [
          styles.floatingButton,
          {
            backgroundColor: colors.tint,
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          },
        ]}
        onPress={() => setShowAddExpense(true)}
      >
        <Ionicons name="add" size={28} color="white" />
        <Text style={styles.fabText}>Add expense</Text>
      </Pressable>

      {/* AddExpense Modal */}
      <Modal
        visible={showAddExpense}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <AddExpense onClose={() => setShowAddExpense(false)} />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: '#FFFFFF20',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
  },
  cardHeader: {
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#00000020',
    marginVertical: 12,
  },
  balanceLabel: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 12,
  },
  expenseBreakdown: {
    fontSize: 15,
    marginBottom: 8,
    opacity: 0.8,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '600',
    color: 'white',
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -1,
  },
  blurContainer: {
    padding: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  balanceSection: {
    overflow: 'hidden',
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    marginBottom: 8,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  settleButton: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  settleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  remindButton: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#2CC2BA40',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  remindButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionList: {
    padding: 16,
  },
  monthGroup: {
    marginBottom: 28,
  },
  monthHeader: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    paddingHorizontal: 4,
    letterSpacing: -0.5,
  },
  transactionItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2CC2BA20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionDate: {
    fontSize: 14,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    zIndex: 1,
  },
  backButton: {
    zIndex: 2,
  },
  settingsButton: {
    zIndex: 2,
    position: 'absolute',
    right: 16,
    top: 60,
  },
  backButtonBlur: {
    borderRadius: 20,
    padding: 8,
    overflow: 'hidden',
  },
  cardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF30',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FFFFFF20',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    paddingVertical: 4,
  },
  searchButton: {
    zIndex: 2,
    position: 'absolute',
    right: 62,
    top: 60,
    borderRadius: 20,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  fabText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
