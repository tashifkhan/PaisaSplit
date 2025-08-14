import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Animated,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useState, useRef, useEffect } from 'react';
import {
  currencies,
  defaultCurrency,
  type Currency,
} from '@/constants/Currencies';

// Import additional components for calendar functionality
import DateTimePicker from '@react-native-community/datetimepicker';

// Sample groups data - in a real app, this would come from a proper data source
const sampleGroups = [
  { id: '1', name: 'Roommates', emoji: '🏠' },
  { id: '2', name: 'Trip to Bali', emoji: '✈️' },
  { id: '3', name: 'Dinner Club', emoji: '🍽️' },
];

// Sample friends data
const sampleFriends = [
  { id: '1', name: 'Tashif', emoji: '👨' },
  { id: '2', name: 'Harleen', emoji: '👩' },
  { id: '3', name: 'Pohi', emoji: '🧑' },
  { id: '4', name: 'Pookie', emoji: '👧' },
];

interface Friend {
  id: string;
  name: string;
  emoji: string;
  amount?: number;
  percentage?: number;
  isIncluded?: boolean;
}

interface Group {
  id: string;
  name: string;
  emoji: string;
}

interface AddExpenseProps {
  onClose: () => void;
}

type SplitMethod = 'equally' | 'unequally' | 'percentage' | 'shares' | 'exact';

interface Payer {
  id: string;
  name: string;
  emoji: string;
}

export default function AddExpense({ onClose }: AddExpenseProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [selectedCurrency, setSelectedCurrency] =
    useState<Currency>(defaultCurrency);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showGroupPicker, setShowGroupPicker] = useState(false);

  // New state variables
  const [showSplitOptions, setShowSplitOptions] = useState(false);
  const [totalAmount, setTotalAmount] = useState<string>('');
  const [splitMethod, setSplitMethod] = useState<SplitMethod>('equally');
  const [payer, setPayer] = useState<Payer>({
    id: 'self',
    name: 'you',
    emoji: '👤',
  });
  const [friends, setFriends] = useState<Friend[]>(
    sampleFriends.map((friend) => ({
      ...friend,
      isIncluded: true,
      amount: 0,
    }))
  );

  // Date selection states
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const groupPickerAnim = useRef(new Animated.Value(0)).current;

  // Handle animation on component mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Animate group picker appearance
  useEffect(() => {
    Animated.timing(groupPickerAnim, {
      toValue: showGroupPicker ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [showGroupPicker]);

  // Calculate per-person amounts when total or split method changes
  useEffect(() => {
    if (totalAmount && splitMethod === 'equally') {
      const amount = parseFloat(totalAmount);
      if (!isNaN(amount)) {
        // Count included friends
        const includedCount = friends.filter((f) => f.isIncluded).length + 1; // +1 for self
        if (includedCount > 0) {
          const perPersonAmount = amount / includedCount;

          // Update friends with equal amounts
          setFriends(
            friends.map((friend) => ({
              ...friend,
              amount: friend.isIncluded ? perPersonAmount : 0,
              percentage: friend.isIncluded ? 100 / includedCount : 0,
            }))
          );
        }
      }
    }
  }, [totalAmount, splitMethod, friends.filter((f) => f.isIncluded).length]);

  const inputBgColor = colorScheme === 'dark' ? '#2C2C2E' : '#F5F5F7';
  const shadowStyle = colorScheme === 'dark' ? darkShadow : lightShadow;

  // Toggle group picker and close currency picker if open
  const handleToggleGroupPicker = () => {
    if (showCurrencyPicker) setShowCurrencyPicker(false);
    setShowGroupPicker(!showGroupPicker);
  };

  // Toggle currency picker and close group picker if open
  const handleToggleCurrencyPicker = () => {
    if (showGroupPicker) setShowGroupPicker(false);
    setShowCurrencyPicker(!showCurrencyPicker);
  };

  // Toggle friend inclusion in the split
  const toggleFriendInclusion = (friendId: string) => {
    setFriends(
      friends.map((friend) =>
        friend.id === friendId
          ? { ...friend, isIncluded: !friend.isIncluded }
          : friend
      )
    );
  };

  // Update individual amount for a friend (for unequal splits)
  const updateFriendAmount = (friendId: string, amount: string) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return;

    setFriends(
      friends.map((friend) =>
        friend.id === friendId ? { ...friend, amount: numAmount } : friend
      )
    );
  };

  // Update individual percentage for a friend
  const updateFriendPercentage = (friendId: string, percentage: string) => {
    const numPercentage = parseFloat(percentage);
    if (isNaN(numPercentage)) return;

    // Update this friend's percentage
    setFriends(
      friends.map((friend) =>
        friend.id === friendId
          ? { ...friend, percentage: numPercentage }
          : friend
      )
    );

    // Calculate amounts based on percentages if we have a total
    if (totalAmount) {
      const totalAmt = parseFloat(totalAmount);
      if (!isNaN(totalAmt)) {
        setFriends((prev) =>
          prev.map((friend) => ({
            ...friend,
            amount:
              friend.id === friendId
                ? (numPercentage / 100) * totalAmt
                : friend.percentage
                ? (friend.percentage / 100) * totalAmt
                : friend.amount,
          }))
        );
      }
    }
  };

  // Calculate total percentage allocated
  const getTotalPercentage = () => {
    let selfPercentage = 0;
    // Find if user has a specific percentage set, otherwise calculate it
    const totalFriendsPercentage = friends.reduce((sum, friend) => {
      if (friend.isIncluded && friend.percentage !== undefined) {
        return sum + friend.percentage;
      }
      return sum;
    }, 0);

    // If total exceeds 100%, return the total as is
    if (totalFriendsPercentage >= 100) return totalFriendsPercentage;

    // Otherwise, assume self takes the remainder
    return totalFriendsPercentage + selfPercentage;
  };

  // Calculate the unallocated percentage
  const getRemainingPercentage = () => {
    const total = getTotalPercentage();
    return Math.max(0, 100 - total);
  };

  // Get split summary text
  const getSplitSummary = () => {
    const includedCount = friends.filter((f) => f.isIncluded).length + 1; // +1 for self

    switch (splitMethod) {
      case 'equally':
        if (includedCount === friends.length + 1) {
          return 'split equally';
        }
        return `split equally among ${includedCount} people`;
      case 'unequally':
        return 'split unequally';
      case 'percentage':
        return 'split by percentage';
      case 'shares':
        return 'split by shares';
      case 'exact':
        return 'split by exact amounts';
      default:
        return 'split equally';
    }
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year:
          today.getFullYear() !== date.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  // Handle date change from the date picker
  const handleDateChange = (event: any, date?: Date) => {
    // On Android, dismiss the modal on cancel
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (date) {
      setSelectedDate(date);
    }

    // On iOS the modal persists and needs to be manually dismissed
    if (Platform.OS === 'ios') {
      setShowDatePicker(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              styles.headerButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Text style={[styles.cancelButton, { color: colors.tint }]}>
              Cancel
            </Text>
          </Pressable>
          <Text style={[styles.title, { color: colors.text }]}>
            Add expense
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.headerButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Text style={[styles.saveButton, { color: colors.tint }]}>
              Save
            </Text>
          </Pressable>
        </View>

        <Animated.View
          style={[
            styles.form,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.userSection}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: colors.tint },
                shadowStyle,
              ]}
            >
              <Text style={styles.avatarText}>J</Text>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.addFriendsButton,
                {
                  backgroundColor: pressed
                    ? colorScheme === 'dark'
                      ? '#2C2C2E'
                      : '#E8E8ED'
                    : 'transparent',
                },
              ]}
            >
              <Text style={[styles.addFriends, { color: colors.tint }]}>
                Add friends
              </Text>
              <Ionicons
                name="add-circle-outline"
                size={20}
                color={colors.tint}
              />
            </Pressable>
          </View>

          {/* Group selector */}
          <Pressable
            onPress={handleToggleGroupPicker}
            style={[
              styles.groupSelector,
              {
                backgroundColor: inputBgColor,
                borderColor: showGroupPicker ? colors.tint : 'transparent',
                borderWidth: showGroupPicker ? 2 : 0,
              },
              shadowStyle,
            ]}
          >
            <View style={styles.groupIconContainer}>
              <Text style={styles.groupEmoji}>
                {selectedGroup ? selectedGroup.emoji : '👥'}
              </Text>
            </View>
            <View style={styles.groupTextContainer}>
              <Text style={[styles.groupSelectorLabel, { color: colors.text }]}>
                {selectedGroup
                  ? selectedGroup.name
                  : 'Select a group (optional)'}
              </Text>
            </View>
            <Ionicons
              name={showGroupPicker ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={colors.text}
              style={styles.groupSelectorIcon}
            />
          </Pressable>

          {/* Group picker dropdown */}
          {showGroupPicker && (
            <Animated.View
              style={[
                styles.groupPicker,
                {
                  backgroundColor: inputBgColor,
                  opacity: groupPickerAnim,
                  transform: [
                    {
                      translateY: groupPickerAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-10, 0],
                      }),
                    },
                  ],
                },
                shadowStyle,
              ]}
            >
              <Pressable
                style={({ pressed }) => [
                  styles.groupItem,
                  {
                    backgroundColor: pressed
                      ? colorScheme === 'dark'
                        ? '#3C3C40'
                        : '#E5E5EA'
                      : 'transparent',
                    borderBottomWidth: 1,
                    borderBottomColor:
                      colorScheme === 'dark' ? '#3C3C3E' : '#E5E5EA',
                  },
                ]}
                onPress={() => {
                  setSelectedGroup(null);
                  setShowGroupPicker(false);
                }}
              >
                <View style={styles.groupItemContent}>
                  <Text style={styles.groupEmoji}>👤</Text>
                  <Text style={[styles.groupItemText, { color: colors.text }]}>
                    No group (personal expense)
                  </Text>
                </View>
                {selectedGroup === null && (
                  <Ionicons name="checkmark" size={18} color={colors.tint} />
                )}
              </Pressable>

              {sampleGroups.map((group) => (
                <Pressable
                  key={group.id}
                  style={({ pressed }) => [
                    styles.groupItem,
                    {
                      backgroundColor: pressed
                        ? colorScheme === 'dark'
                          ? '#3C3C40'
                          : '#E5E5EA'
                        : 'transparent',
                      borderBottomWidth: 1,
                      borderBottomColor:
                        colorScheme === 'dark' ? '#3C3C3E' : '#E5E5EA',
                    },
                  ]}
                  onPress={() => {
                    setSelectedGroup(group);
                    setShowGroupPicker(false);
                  }}
                >
                  <View style={styles.groupItemContent}>
                    <Text style={styles.groupEmoji}>{group.emoji}</Text>
                    <Text
                      style={[styles.groupItemText, { color: colors.text }]}
                    >
                      {group.name}
                    </Text>
                  </View>
                  {selectedGroup?.id === group.id && (
                    <Ionicons name="checkmark" size={18} color={colors.tint} />
                  )}
                </Pressable>
              ))}
            </Animated.View>
          )}

          <View
            style={[
              styles.inputGroup,
              { backgroundColor: inputBgColor },
              shadowStyle,
            ]}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name="cart"
                size={24}
                color={colors.tint}
                style={styles.inputIcon}
              />
            </View>
            <TextInput
              placeholder="What was it for?"
              placeholderTextColor={
                colorScheme === 'dark' ? '#8E8E93' : '#A9A9B0'
              }
              style={[styles.input, { color: colors.text }]}
            />
          </View>

          <View
            style={[
              styles.inputGroup,
              { backgroundColor: inputBgColor },
              shadowStyle,
            ]}
          >
            <Pressable
              onPress={handleToggleCurrencyPicker}
              style={styles.currencyButton}
            >
              <Text style={[styles.currencyLabel, { color: colors.tint }]}>
                {selectedCurrency.code}
              </Text>
              <Ionicons
                name={showCurrencyPicker ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={colors.tint}
                style={styles.currencyIcon}
              />
            </Pressable>
            <TextInput
              placeholder="0.00"
              placeholderTextColor={
                colorScheme === 'dark' ? '#8E8E93' : '#A9A9B0'
              }
              keyboardType="decimal-pad"
              style={[styles.input, styles.amountInput, { color: colors.text }]}
              value={totalAmount}
              onChangeText={setTotalAmount}
            />
          </View>

          {showCurrencyPicker && (
            <Animated.View
              style={[
                styles.currencyPicker,
                {
                  backgroundColor: inputBgColor,
                },
                shadowStyle,
              ]}
            >
              {currencies.map((currency) => (
                <Pressable
                  key={currency.code}
                  style={({ pressed }) => [
                    styles.currencyItem,
                    {
                      backgroundColor: pressed
                        ? colorScheme === 'dark'
                          ? '#3C3C40'
                          : '#E5E5EA'
                        : 'transparent',
                      borderBottomWidth: 1,
                      borderBottomColor:
                        colorScheme === 'dark' ? '#3C3C3E' : '#E5E5EA',
                    },
                  ]}
                  onPress={() => {
                    setSelectedCurrency(currency);
                    setShowCurrencyPicker(false);
                  }}
                >
                  <Text
                    style={[styles.currencyItemText, { color: colors.text }]}
                  >
                    {currency.symbol} {currency.code} - {currency.name}
                  </Text>
                  {selectedCurrency.code === currency.code && (
                    <Ionicons name="checkmark" size={18} color={colors.tint} />
                  )}
                </Pressable>
              ))}
            </Animated.View>
          )}

          {/* Enhanced split section */}
          <Pressable
            onPress={() => setShowSplitOptions(true)}
            style={[
              styles.splitSection,
              { backgroundColor: inputBgColor },
              shadowStyle,
            ]}
          >
            <Ionicons
              name="people"
              size={20}
              color={colors.tint}
              style={styles.splitIcon}
            />
            <Text style={[styles.splitText, { color: colors.text }]}>
              Paid by{' '}
              <Text style={{ color: colors.tint, fontWeight: '600' }}>
                {payer.name === 'you' ? 'you' : payer.name}
              </Text>{' '}
              and {getSplitSummary()}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.text} />
          </Pressable>

          <View style={styles.dateSection}>
            <Pressable
              style={({ pressed }) => [
                styles.dateButton,
                {
                  backgroundColor: inputBgColor,
                  opacity: pressed ? 0.9 : 1,
                },
                shadowStyle,
              ]}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar" size={20} color={colors.tint} />
              <Text style={[styles.dateButtonText, { color: colors.tint }]}>
                {formatDate(selectedDate)}
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.imageButton,
                {
                  backgroundColor: inputBgColor,
                  opacity: pressed ? 0.9 : 1,
                },
                shadowStyle,
              ]}
            >
              <Ionicons name="image" size={20} color={colors.tint} />
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Split Options Modal */}
      <Modal
        visible={showSplitOptions}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSplitOptions(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : 'white',
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Split Options
              </Text>
              <Pressable onPress={() => setShowSplitOptions(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>

            <ScrollView
              style={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.modalSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Who paid?
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.payerList}
                >
                  <Pressable
                    style={[
                      styles.payerButton,
                      payer.id === 'self' && {
                        backgroundColor: colors.tint + '30',
                        borderColor: colors.tint,
                      },
                    ]}
                    onPress={() =>
                      setPayer({ id: 'self', name: 'you', emoji: '👤' })
                    }
                  >
                    <Text style={styles.payerEmoji}>👤</Text>
                    <Text
                      style={[
                        styles.payerName,
                        { color: colors.text },
                        payer.id === 'self' && {
                          color: colors.tint,
                          fontWeight: '600',
                        },
                      ]}
                    >
                      You
                    </Text>
                  </Pressable>

                  {friends.map((friend) => (
                    <Pressable
                      key={friend.id}
                      style={[
                        styles.payerButton,
                        payer.id === friend.id && {
                          backgroundColor: colors.tint + '30',
                          borderColor: colors.tint,
                        },
                      ]}
                      onPress={() =>
                        setPayer({
                          id: friend.id,
                          name: friend.name,
                          emoji: friend.emoji,
                        })
                      }
                    >
                      <Text style={styles.payerEmoji}>{friend.emoji}</Text>
                      <Text
                        style={[
                          styles.payerName,
                          { color: colors.text },
                          payer.id === friend.id && {
                            color: colors.tint,
                            fontWeight: '600',
                          },
                        ]}
                      >
                        {friend.name}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.modalSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  How should it be split?
                </Text>

                <View style={styles.splitMethodContainer}>
                  <Pressable
                    style={[
                      styles.splitMethodButton,
                      splitMethod === 'equally' && {
                        backgroundColor: colors.tint + '30',
                        borderColor: colors.tint,
                      },
                      {
                        borderColor:
                          colorScheme === 'dark' ? '#333' : '#E0E0E0',
                      },
                    ]}
                    onPress={() => setSplitMethod('equally')}
                  >
                    <Ionicons
                      name="people"
                      size={22}
                      color={
                        splitMethod === 'equally' ? colors.tint : colors.text
                      }
                    />
                    <Text
                      style={[
                        styles.splitMethodText,
                        { color: colors.text },
                        splitMethod === 'equally' && {
                          color: colors.tint,
                          fontWeight: '600',
                        },
                      ]}
                    >
                      Equally
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.splitMethodButton,
                      splitMethod === 'unequally' && {
                        backgroundColor: colors.tint + '30',
                        borderColor: colors.tint,
                      },
                      {
                        borderColor:
                          colorScheme === 'dark' ? '#333' : '#E0E0E0',
                      },
                    ]}
                    onPress={() => setSplitMethod('unequally')}
                  >
                    <Ionicons
                      name="pie-chart"
                      size={22}
                      color={
                        splitMethod === 'unequally' ? colors.tint : colors.text
                      }
                    />
                    <Text
                      style={[
                        styles.splitMethodText,
                        { color: colors.text },
                        splitMethod === 'unequally' && {
                          color: colors.tint,
                          fontWeight: '600',
                        },
                      ]}
                    >
                      Unequally
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.splitMethodButton,
                      splitMethod === 'percentage' && {
                        backgroundColor: colors.tint + '30',
                        borderColor: colors.tint,
                      },
                      {
                        borderColor:
                          colorScheme === 'dark' ? '#333' : '#E0E0E0',
                      },
                    ]}
                    onPress={() => setSplitMethod('percentage')}
                  >
                    <Ionicons
                      name="analytics"
                      size={22}
                      color={
                        splitMethod === 'percentage' ? colors.tint : colors.text
                      }
                    />
                    <Text
                      style={[
                        styles.splitMethodText,
                        { color: colors.text },
                        splitMethod === 'percentage' && {
                          color: colors.tint,
                          fontWeight: '600',
                        },
                      ]}
                    >
                      Percentage
                    </Text>
                  </Pressable>
                </View>

                {/* Add highlight info for current method */}
                <View style={styles.splitMethodInfo}>
                  {splitMethod === 'equally' && (
                    <Text
                      style={[
                        styles.splitMethodDescription,
                        { color: colors.text },
                      ]}
                    >
                      Everyone pays the same amount
                    </Text>
                  )}
                  {splitMethod === 'unequally' && (
                    <Text
                      style={[
                        styles.splitMethodDescription,
                        { color: colors.text },
                      ]}
                    >
                      Specify exact amount for each person
                    </Text>
                  )}
                  {splitMethod === 'percentage' && (
                    <Text
                      style={[
                        styles.splitMethodDescription,
                        { color: colors.text },
                      ]}
                    >
                      Split based on percentage contribution
                    </Text>
                  )}
                </View>

                {splitMethod === 'percentage' && (
                  <View
                    style={[
                      styles.percentageSummary,
                      { backgroundColor: inputBgColor },
                    ]}
                  >
                    <Text style={{ color: colors.text }}>
                      Total allocated: {getTotalPercentage().toFixed(1)}%
                    </Text>
                    <Text
                      style={{
                        color:
                          getRemainingPercentage() > 0
                            ? colors.positive
                            : colors.negative,
                        fontWeight: '600',
                      }}
                    >
                      {getRemainingPercentage() > 0
                        ? `Remaining: ${getRemainingPercentage().toFixed(1)}%`
                        : `Over-allocated: ${Math.abs(
                            getRemainingPercentage()
                          ).toFixed(1)}%`}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.modalSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Who's included in the split?
                </Text>

                <View style={styles.friendsListContainer}>
                  <View
                    style={[
                      styles.friendItem,
                      {
                        borderBottomColor:
                          colorScheme === 'dark' ? '#333' : '#E0E0E0',
                      },
                    ]}
                  >
                    <View style={styles.friendInfo}>
                      <Text style={styles.friendEmoji}>👤</Text>
                      <Text style={[styles.friendName, { color: colors.text }]}>
                        You
                      </Text>
                    </View>

                    {splitMethod === 'equally' && (
                      <View style={styles.amountContainer}>
                        <Text style={{ color: colors.text }}>
                          {selectedCurrency.symbol}{' '}
                          {(
                            parseFloat(totalAmount || '0') /
                            (friends.filter((f) => f.isIncluded).length + 1)
                          ).toFixed(2)}
                        </Text>
                      </View>
                    )}

                    {splitMethod === 'unequally' && (
                      <View style={styles.amountInputContainer}>
                        <Text style={{ color: colors.text, marginRight: 4 }}>
                          {selectedCurrency.symbol}
                        </Text>
                        <TextInput
                          style={[
                            styles.splitAmountInput,
                            { color: colors.text },
                          ]}
                          keyboardType="decimal-pad"
                          placeholder="0.00"
                          placeholderTextColor={
                            colorScheme === 'dark' ? '#8E8E93' : '#A9A9B0'
                          }
                          defaultValue={(
                            parseFloat(totalAmount || '0') /
                            (friends.filter((f) => f.isIncluded).length + 1)
                          ).toFixed(2)}
                        />
                      </View>
                    )}

                    {splitMethod === 'percentage' && (
                      <View style={styles.percentageInputContainer}>
                        <TextInput
                          style={[
                            styles.splitPercentageInput,
                            { color: colors.text },
                          ]}
                          keyboardType="decimal-pad"
                          placeholder="0"
                          placeholderTextColor={
                            colorScheme === 'dark' ? '#8E8E93' : '#A9A9B0'
                          }
                          defaultValue={`${(
                            100 /
                            (friends.filter((f) => f.isIncluded).length + 1)
                          ).toFixed(1)}`}
                        />
                        <Text style={{ color: colors.text, marginLeft: 2 }}>
                          %
                        </Text>
                      </View>
                    )}

                    <Ionicons
                      name="checkmark-circle-outline"
                      size={24}
                      color={colors.tint}
                    />
                  </View>

                  {friends.map((friend) => (
                    <Pressable
                      key={friend.id}
                      style={[
                        styles.friendItem,
                        {
                          borderBottomColor:
                            colorScheme === 'dark' ? '#333' : '#E0E0E0',
                        },
                      ]}
                      onPress={() => toggleFriendInclusion(friend.id)}
                    >
                      <View style={styles.friendInfo}>
                        <Text
                          style={[
                            styles.friendEmoji,
                            !friend.isIncluded && { opacity: 0.5 },
                          ]}
                        >
                          {friend.emoji}
                        </Text>
                        <Text
                          style={[
                            styles.friendName,
                            { color: colors.text },
                            !friend.isIncluded && { opacity: 0.5 },
                          ]}
                        >
                          {friend.name}
                        </Text>
                      </View>

                      {splitMethod === 'equally' && friend.isIncluded && (
                        <View style={styles.amountContainer}>
                          <Text style={{ color: colors.text }}>
                            {selectedCurrency.symbol}{' '}
                            {(
                              parseFloat(totalAmount || '0') /
                              (friends.filter((f) => f.isIncluded).length + 1)
                            ).toFixed(2)}
                          </Text>
                        </View>
                      )}

                      {splitMethod === 'unequally' && friend.isIncluded && (
                        <View style={styles.amountInputContainer}>
                          <Text style={{ color: colors.text, marginRight: 4 }}>
                            {selectedCurrency.symbol}
                          </Text>
                          <TextInput
                            style={[
                              styles.splitAmountInput,
                              { color: colors.text },
                            ]}
                            keyboardType="decimal-pad"
                            placeholder="0.00"
                            placeholderTextColor={
                              colorScheme === 'dark' ? '#8E8E93' : '#A9A9B0'
                            }
                            defaultValue={
                              friend.amount?.toFixed(2) ||
                              (
                                parseFloat(totalAmount || '0') /
                                (friends.filter((f) => f.isIncluded).length + 1)
                              ).toFixed(2)
                            }
                            onChangeText={(value) =>
                              updateFriendAmount(friend.id, value)
                            }
                          />
                        </View>
                      )}

                      {splitMethod === 'percentage' && friend.isIncluded && (
                        <View style={styles.percentageInputContainer}>
                          <TextInput
                            style={[
                              styles.splitPercentageInput,
                              { color: colors.text },
                            ]}
                            keyboardType="decimal-pad"
                            placeholder="0"
                            placeholderTextColor={
                              colorScheme === 'dark' ? '#8E8E93' : '#A9A9B0'
                            }
                            defaultValue={
                              friend.percentage?.toFixed(1) ||
                              `${(
                                100 /
                                (friends.filter((f) => f.isIncluded).length + 1)
                              ).toFixed(1)}`
                            }
                            onChangeText={(value) =>
                              updateFriendPercentage(friend.id, value)
                            }
                          />
                          <Text style={{ color: colors.text, marginLeft: 2 }}>
                            %
                          </Text>
                        </View>
                      )}

                      <Ionicons
                        name={
                          friend.isIncluded
                            ? 'checkmark-circle-outline'
                            : 'ellipse-outline'
                        }
                        size={24}
                        color={friend.isIncluded ? colors.tint : colors.text}
                      />
                    </Pressable>
                  ))}
                </View>
              </View>
            </ScrollView>

            <Pressable
              style={[styles.doneButton, { backgroundColor: colors.tint }]}
              onPress={() => setShowSplitOptions(false)}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Date Picker Modal */}
      {Platform.OS === 'ios' ? (
        <Modal
          visible={showDatePicker}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={styles.datePickerModalOverlay}>
            <View
              style={[
                styles.datePickerModalContent,
                {
                  backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : 'white',
                },
              ]}
            >
              <View style={styles.datePickerHeader}>
                <Pressable onPress={() => setShowDatePicker(false)}>
                  <Text style={{ color: colors.tint }}>Cancel</Text>
                </Pressable>
                <Text style={[styles.datePickerTitle, { color: colors.text }]}>
                  Select Date
                </Text>
                <Pressable
                  onPress={() => {
                    handleDateChange(null, selectedDate);
                  }}
                >
                  <Text style={{ color: colors.tint, fontWeight: '600' }}>
                    Done
                  </Text>
                </Pressable>
              </View>

              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                themeVariant={colorScheme === 'dark' ? 'dark' : 'light'}
                textColor={colors.text}
                style={styles.datePickerIOS}
              />
            </View>
          </View>
        </Modal>
      ) : (
        // On Android, DateTimePicker itself is shown as a modal
        showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )
      )}
    </View>
  );
}

const lightShadow = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 3,
  elevation: 3,
};

const darkShadow = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    fontSize: 17,
  },
  saveButton: {
    fontSize: 17,
    fontWeight: '600',
  },
  form: {
    padding: 16,
    gap: 20,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  addFriendsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 6,
  },
  addFriends: {
    fontSize: 16,
    fontWeight: '500',
  },
  // Group selector styles
  groupSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginVertical: 4,
  },
  groupIconContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  groupEmoji: {
    fontSize: 22,
  },
  groupTextContainer: {
    flex: 1,
  },
  groupSelectorLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  groupSelectorIcon: {
    marginLeft: 4,
  },
  groupPicker: {
    position: 'absolute',
    top: 120,
    left: 16,
    right: 16,
    borderRadius: 12,
    maxHeight: 260,
    zIndex: 2,
  },
  groupItem: {
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  groupItemText: {
    fontSize: 16,
  },
  // Existing styles
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginVertical: 4,
  },
  iconContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 17,
    padding: 4,
  },
  currencyButton: {
    paddingRight: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#CCCCCC40',
    marginRight: 12,
  },
  currencyLabel: {
    fontSize: 17,
    fontWeight: '600',
  },
  currencyIcon: {
    marginLeft: 4,
  },
  amountInput: {
    textAlign: 'right',
    fontWeight: '600',
    fontSize: 20,
  },
  currencyPicker: {
    position: 'absolute',
    top: 180,
    left: 16,
    right: 16,
    borderRadius: 12,
    maxHeight: 300,
    zIndex: 1,
  },
  currencyItem: {
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currencyItemText: {
    fontSize: 16,
  },
  splitSection: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  splitIcon: {
    marginRight: 10,
  },
  splitText: {
    flex: 1,
    fontSize: 16,
  },
  dateSection: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  dateButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  imageButton: {
    padding: 14,
    borderRadius: 12,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // New styles for split options
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalScrollContent: {
    flexGrow: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  modalSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  payerList: {
    paddingVertical: 8,
    gap: 12,
  },
  payerButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    width: 80,
  },
  payerEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  payerName: {
    fontSize: 14,
    textAlign: 'center',
  },
  splitMethodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  splitMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    minWidth: '30%',
    gap: 8,
  },
  splitMethodText: {
    fontSize: 15,
    fontWeight: '500',
  },
  splitMethodInfo: {
    marginTop: 12,
    alignItems: 'center',
  },
  splitMethodDescription: {
    fontSize: 15,
    opacity: 0.8,
  },
  percentageSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    marginTop: 10,
    borderRadius: 8,
  },
  friendsListContainer: {
    marginTop: 8,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  friendEmoji: {
    fontSize: 22,
  },
  friendName: {
    fontSize: 16,
  },
  amountContainer: {
    marginRight: 12,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  splitAmountInput: {
    borderBottomWidth: 1,
    borderColor: '#CCCCCC50',
    paddingVertical: 2,
    minWidth: 60,
    textAlign: 'right',
    fontSize: 16,
  },
  percentageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  splitPercentageInput: {
    borderBottomWidth: 1,
    borderColor: '#CCCCCC50',
    paddingVertical: 2,
    width: 40,
    textAlign: 'right',
    fontSize: 16,
  },
  doneButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Date picker styles
  datePickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  datePickerModalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  datePickerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  datePickerIOS: {
    height: 200,
    marginBottom: 20,
  },
});
