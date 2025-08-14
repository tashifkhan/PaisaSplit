import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useState } from 'react';
import { DataService } from '@/services/DataService';

export default function LanguageCurrencyScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Load data from service
  const languages = DataService.getLanguages();
  const currencies = DataService.getCurrencies();
  const currentUser = DataService.getCurrentUser();

  const [selectedLanguage, setSelectedLanguage] = useState(
    currentUser.defaultLanguage
  );
  const [selectedCurrency, setSelectedCurrency] = useState(
    currentUser.defaultCurrency
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <BlurView intensity={80} style={styles.backButtonBlur}>
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </BlurView>
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>
          Language & Currency
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Language
        </Text>
        {languages.map((lang) => (
          <Pressable
            key={lang.code}
            style={({ pressed }) => [
              styles.option,
              {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7',
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            onPress={() => setSelectedLanguage(lang.code)}
          >
            <Text style={[styles.optionText, { color: colors.text }]}>
              {lang.name}
            </Text>
            {selectedLanguage === lang.code && (
              <Ionicons name="checkmark" size={24} color={colors.tint} />
            )}
          </Pressable>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Currency
        </Text>
        {currencies.map((currency) => (
          <Pressable
            key={currency.code}
            style={({ pressed }) => [
              styles.option,
              {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7',
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            onPress={() => setSelectedCurrency(currency.code)}
          >
            <Text style={[styles.optionText, { color: colors.text }]}>
              {currency.symbol} - {currency.name}
            </Text>
            {selectedCurrency === currency.code && (
              <Ionicons name="checkmark" size={24} color={colors.tint} />
            )}
          </Pressable>
        ))}
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    flex: 1,
    marginLeft: 8,
  },
  backButton: {
    zIndex: 2,
    borderRadius: 16,
    overflow: 'hidden',
  },
  backButtonBlur: {
    padding: 6,
    borderRadius: 16,
  },
  section: {
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
  },
  optionText: {
    fontSize: 16,
  },
});
