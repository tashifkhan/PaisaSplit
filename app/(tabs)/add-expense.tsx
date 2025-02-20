import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useState } from 'react';
import { currencies, defaultCurrency, type Currency } from '@/constants/Currencies';

export default function AddExpenseScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(defaultCurrency);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable>
          <Text style={[styles.cancelButton, { color: colors.tint }]}>Cancel</Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>Add expense</Text>
        <Pressable>
          <Text style={[styles.saveButton, { color: colors.tint }]}>Save</Text>
        </Pressable>
      </View>

      <View style={styles.form}>
        <View style={styles.userSection}>
          <View style={[styles.avatar, { backgroundColor: colors.tint }]}>
            <Text style={styles.avatarText}>J</Text>
          </View>
          <Text style={[styles.addFriends, { color: colors.tint }]}>Add friends</Text>
        </View>

        <View style={[styles.inputGroup, { backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7' }]}>
          <Ionicons name="cart" size={24} color={colors.text} style={styles.inputIcon} />
          <TextInput
            placeholder="What was it for?"
            placeholderTextColor={colorScheme === 'dark' ? '#666' : '#999'}
            style={[styles.input, { color: colors.text }]}
          />
        </View>

        <View style={[styles.inputGroup, { backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7' }]}>
          <Pressable onPress={() => setShowCurrencyPicker(!showCurrencyPicker)} style={styles.currencyButton}>
            <Text style={[styles.currencyLabel, { color: colors.text }]}>{selectedCurrency.code}</Text>
          </Pressable>
          <TextInput
            placeholder="0.00"
            placeholderTextColor={colorScheme === 'dark' ? '#666' : '#999'}
            keyboardType="decimal-pad"
            style={[styles.input, styles.amountInput, { color: colors.text }]}
          />
        </View>

        {showCurrencyPicker && (
          <View style={[styles.currencyPicker, { backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7' }]}>
            {currencies.map((currency) => (
              <Pressable
                key={currency.code}
                style={styles.currencyItem}
                onPress={() => {
                  setSelectedCurrency(currency);
                  setShowCurrencyPicker(false);
                }}
              >
                <Text style={[styles.currencyItemText, { color: colors.text }]}>
                  {currency.symbol} {currency.code} - {currency.name}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        <View style={styles.splitSection}>
          <Text style={[styles.splitText, { color: colors.text }]}>
            Paid by <Text style={{ color: colors.tint }}>you</Text> and split <Text style={{ color: colors.tint }}>equally</Text>
          </Text>
        </View>

        <View style={styles.dateSection}>
          <Pressable style={[styles.dateButton, { backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7' }]}>
            <Ionicons name="calendar" size={24} color={colors.tint} />
            <Text style={[styles.dateButtonText, { color: colors.tint }]}>Today</Text>
          </Pressable>

          <Pressable style={[styles.imageButton, { backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7' }]}>
            <Ionicons name="image" size={24} color={colors.tint} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 17,
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
    gap: 24,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
  addFriends: {
    fontSize: 17,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 17,
    padding: 0,
  },
  currencyButton: {
    paddingRight: 8,
  },
  currencyLabel: {
    fontSize: 17,
    fontWeight: '600',
  },
  amountInput: {
    textAlign: 'right',
  },
  currencyPicker: {
    position: 'absolute',
    top: 180,
    left: 16,
    right: 16,
    borderRadius: 10,
    padding: 8,
    zIndex: 1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  currencyItem: {
    padding: 12,
  },
  currencyItemText: {
    fontSize: 17,
  },
  splitSection: {
    alignItems: 'center',
  },
  splitText: {
    fontSize: 17,
  },
  dateSection: {
    flexDirection: 'row',
    gap: 12,
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  dateButtonText: {
    fontSize: 17,
  },
  imageButton: {
    padding: 12,
    borderRadius: 10,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});