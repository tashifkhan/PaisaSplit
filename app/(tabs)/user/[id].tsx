import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  TextInput,
} from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

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

export default function UserTransactionScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const userData = {
    name: 'Harleen',
    totalOwed: 2483.68,
    nonGroupExpenses: 2135.88,
    groupExpenses: [{ name: 'The Big Chill', amount: 347.8 }],
    transactions: [
      {
        date: 'April 2024',
        items: [
          {
            description: 'big chill Khan markwt',
            amount: 2200.0,
            type: 'borrowed',
            date: 'Apr 14',
            yourAmount: 1100.0,
          },
        ],
      },
      {
        date: 'February 2024',
        items: [
          {
            description: 'nov to feb',
            amount: 600.0,
            type: 'borrowed',
            date: 'Feb 13',
            yourAmount: 600.0,
          },
        ],
      },
      {
        date: 'November 2023',
        items: [
          {
            description: 'bet',
            amount: 500.0,
            type: 'lent',
            date: 'Nov 13',
            yourAmount: 500.0,
          },
          {
            description: 'Bell bottoms',
            amount: 700.0,
            type: 'lent',
            date: 'Nov 13',
            yourAmount: 700.0,
          },
        ],
      },
      {
        date: 'August 2023',
        items: [
          {
            description: 'movie',
            amount: 2143.6,
            type: 'lent',
            date: 'Aug 10',
            yourAmount: 1071.8,
          },
        ],
      },
    ],
  };

  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchAnimation = useMemo(() => new Animated.Value(0), []);

  const toggleSearch = () => {
    setIsSearching(!isSearching);
    Animated.spring(searchAnimation, {
      toValue: isSearching ? 0 : 1,
      useNativeDriver: true,
    }).start();
  };

  const filteredTransactions = useMemo(() => {
    if (!searchQuery) return userData.transactions;

    return userData.transactions
      .map((month) => ({
        date: month.date,
        items: month.items.filter((item) =>
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter((month) => month.items.length > 0);
  }, [userData.transactions, searchQuery]);

  const headerBackground = useMemo(() => {
    return colorScheme === 'dark'
      ? (['#00000000', colors.background] as const)
      : (['#ffffff00', colors.background] as const);
  }, [colorScheme]);

  const getDateTextColor = useMemo(() => {
    return colorScheme === 'dark'
      ? colors.text + 'E6' // Higher opacity (90%) in dark mode for better legibility
      : colors.text + '10'; // Original opacity in light mode
  }, [colorScheme, colors.text]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
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
              opacity: searchAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
              transform: [
                {
                  translateX: searchAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
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

        {!isSearching && (
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
        )}
      </View>

      {!isSearching ? (
        <>
          {/* Existing profile section */}
          <View style={styles.profileSection}>
            <View style={[styles.avatar, { backgroundColor: colors.tint }]}>
              <Text style={styles.avatarText}>{userData.name[0]}</Text>
            </View>
            <Text style={[styles.name, { color: colors.text }]}>
              {userData.name}
            </Text>
          </View>

          {/* Existing balance section */}
          <BlurView intensity={40} style={[styles.balanceSection, styles.card]}>
            <LinearGradient
              colors={[colors.tint + '20', colors.tint + '05']}
              style={styles.cardGradient}
            />
            <View style={styles.cardHeader}>
              <Text style={[styles.balanceAmount, { color: colors.text }]}>
                ₹{userData.totalOwed.toFixed(2)}
              </Text>
              <Text style={[styles.balanceLabel, { color: colors.text }]}>
                You are owed overall
              </Text>
            </View>
            <View style={styles.divider} />
            <Text style={[styles.expenseBreakdown, { color: colors.text }]}>
              Harleen owes you ₹{userData.nonGroupExpenses} in non-group
              expenses
            </Text>
            {userData.groupExpenses.map((expense, index) => (
              <Text
                key={index}
                style={[styles.expenseBreakdown, { color: colors.text }]}
              >
                Harleen owes you ₹{expense.amount} in "{expense.name}"
              </Text>
            ))}
          </BlurView>

          {/* Existing action buttons */}
          <View style={styles.actionButtons}>
            <Pressable
              style={({ pressed }) => [
                styles.settleButton,
                {
                  backgroundColor: colors.tint,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <Text style={styles.settleButtonText}>Settle up</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.remindButton,
                {
                  backgroundColor: colors.background,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <Text style={[styles.remindButtonText, { color: colors.tint }]}>
                Remind
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
                  router.push(
                    `/user/transaction/${monthIndex}-${transactionIndex}`
                  )
                }
                style={({ pressed }) => [
                  styles.transactionItem,
                  {
                    backgroundColor:
                      colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7',
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  },
                ]}
              >
                <View style={styles.transactionIcon}>
                  <Ionicons
                    name={
                      transaction.type === 'borrowed'
                        ? 'arrow-down'
                        : 'arrow-up'
                    }
                    size={24}
                    color={
                      transaction.type === 'borrowed'
                        ? colors.negative
                        : colors.positive
                    }
                  />
                </View>
                <View style={styles.transactionDetails}>
                  <View style={styles.transactionHeader}>
                    <Text
                      style={[styles.transactionTitle, { color: colors.text }]}
                    >
                      {transaction.description}
                    </Text>
                    <Text
                      style={[
                        styles.transactionAmount,
                        {
                          color:
                            transaction.type === 'borrowed'
                              ? colors.negative
                              : colors.positive,
                        },
                      ]}
                    >
                      <Text> ₹{transaction.yourAmount.toFixed(2)}</Text>
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.transactionDate,
                      {
                        color:
                          colorScheme === 'dark'
                            ? '#9999AA80' // Added 80 for 50% opacity in dark mode
                            : getDateTextColor,
                      },
                    ]}
                  >
                    {transaction.date}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
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
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  transactionTitle: {
    fontSize: 17,
    fontWeight: '600',
    flex: 1,
    marginRight: 16,
    letterSpacing: -0.2,
  },
  transactionAmount: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'right',
  },
  transactionDate: {
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amountText: {
    lineHeight: 34,
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
    borderRadius: 20,
    overflow: 'hidden',
  },
  backButtonBlur: {
    padding: 8,
    borderRadius: 20,
  },
  cardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  searchContainer: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
    opacity: 0, // ensure it's invisible by default
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF50',
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
    right: 16, // use 52 for group/[id].tsx
    top: 60,
    borderRadius: 20,
    overflow: 'hidden',
  },
});
