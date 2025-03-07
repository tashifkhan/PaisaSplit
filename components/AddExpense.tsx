import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Animated,
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

// Sample groups data - in a real app, this would come from a proper data source
const sampleGroups = [
  { id: '1', name: 'Roommates', emoji: '🏠' },
  { id: '2', name: 'Trip to Bali', emoji: '✈️' },
  { id: '3', name: 'Dinner Club', emoji: '🍽️' },
];

interface Group {
  id: string;
  name: string;
  emoji: string;
}

interface AddExpenseProps {
  onClose: () => void;
}

export default function AddExpense({ onClose }: AddExpenseProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [selectedCurrency, setSelectedCurrency] =
    useState<Currency>(defaultCurrency);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showGroupPicker, setShowGroupPicker] = useState(false);

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

          <View
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
              <Text style={{ color: colors.tint, fontWeight: '600' }}>you</Text>{' '}
              and split{' '}
              <Text style={{ color: colors.tint, fontWeight: '600' }}>
                equally
              </Text>
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.text} />
          </View>

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
            >
              <Ionicons name="calendar" size={20} color={colors.tint} />
              <Text style={[styles.dateButtonText, { color: colors.tint }]}>
                Today
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
});
