import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import Colors from '@/constants/Colors';
import { DataService } from '@/services/DataService';

export default function SpendingReportScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const screenWidth = Dimensions.get('window').width;
  const [isAnnual, setIsAnnual] = useState(false);
  const router = useRouter();

  // Load data from service
  const spendingReportData = DataService.getSpendingReportData();
  const currentUser = DataService.getCurrentUser();
  const defaultCurrency = currentUser.defaultCurrency;
  const [currency, setCurrency] = useState<string>(defaultCurrency);

  const currentData = isAnnual
    ? spendingReportData.spendingData.annual
    : spendingReportData.spendingData.monthly;
  const recentTransactions = spendingReportData.recentTransactions;

  const chartConfig = {
    backgroundGradientFrom: colors.background,
    backgroundGradientTo: colors.background,
    color: (opacity = 1) =>
      `rgba(${
        colorScheme === 'dark' ? '255, 255, 255' : '0, 0, 0'
      }, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.7,
  };

  const renderPieChart = (data: any[], title: string) => (
    <View style={styles.chartSection}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      <PieChart
        data={data.map((item) => ({
          name: item.name,
          amount: item.amount,
          color: item.color,
          legendFontColor: colors.text,
          legendFontSize: 12,
        }))}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </View>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <BlurView intensity={80} style={styles.backButtonBlur}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </BlurView>
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>
          Spending Report
        </Text>
      </View>
      <View style={{ marginTop: 20, paddingBottom: 12 }}>
        <View style={styles.controlsContainer}>
          <View
            style={[
              styles.toggleContainer,
              {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7',
              },
            ]}
          >
            <Pressable
              style={[
                styles.toggleOption,
                isAnnual && styles.toggleOptionInactive,
              ]}
              onPress={() => setIsAnnual(false)}
            >
              <Text
                style={[
                  styles.toggleText,
                  { color: !isAnnual ? colors.background : colors.text },
                ]}
              >
                Monthly
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.toggleOption,
                !isAnnual && styles.toggleOptionInactive,
              ]}
              onPress={() => setIsAnnual(true)}
            >
              <Text
                style={[
                  styles.toggleText,
                  { color: isAnnual ? colors.background : colors.text },
                ]}
              >
                Annual
              </Text>
            </Pressable>
          </View>

          <View
            style={[
              styles.toggleContainer,
              {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7',
              },
            ]}
          >
            <Pressable
              style={[
                styles.toggleOption,
                currency === 'INR' && styles.toggleOptionInactive,
              ]}
              onPress={() => setCurrency('USD')}
            >
              <Text
                style={[
                  styles.toggleText,
                  {
                    color: currency === 'USD' ? colors.background : colors.text,
                  },
                ]}
              >
                USD
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.toggleOption,
                currency === 'USD' && styles.toggleOptionInactive,
              ]}
              onPress={() => setCurrency('INR')}
            >
              <Text
                style={[
                  styles.toggleText,
                  {
                    color: currency === 'INR' ? colors.background : colors.text,
                  },
                ]}
              >
                INR
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.totalSection}>
        <Text style={[styles.totalLabel, { color: colors.text }]}>
          Total Spending
        </Text>
        <Text style={[styles.totalAmount, { color: colors.text }]}>
          {DataService.getCurrencySymbol(currency)}
          {DataService.formatAmount(
            DataService.convertCurrency(currentData.total, 'INR', currency),
            currency
          )}
        </Text>
      </View>

      {renderPieChart(currentData.categories, 'Spending by Category')}
      {renderPieChart(currentData.people, 'Spending by Person')}
      {renderPieChart(currentData.groups, 'Spending by Group')}

      <View style={styles.transactionsSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Recent Transactions
        </Text>
        {recentTransactions.map((transaction) => (
          <View
            key={transaction.id}
            style={[
              styles.transactionItem,
              {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7',
              },
            ]}
          >
            <View style={styles.transactionInfo}>
              <Text style={[styles.transactionTitle, { color: colors.text }]}>
                {transaction.title}
              </Text>
              <Text
                style={[styles.transactionDate, { color: colors.text + '99' }]}
              >
                {new Date(transaction.date).toLocaleDateString()}
              </Text>
            </View>
            <Text style={[styles.transactionAmount, { color: colors.text }]}>
              -{DataService.getCurrencySymbol(currency)}
              {DataService.formatAmount(
                DataService.convertCurrency(
                  transaction.amount,
                  'INR',
                  currency
                ),
                currency
              )}
            </Text>
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
  subtitle: {
    fontSize: 17,
    marginTop: 4,
  },
  totalSection: {
    padding: 16,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 42,
    fontWeight: 'bold',
  },
  chartSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  transactionsSection: {
    padding: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  controlsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 'auto',
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 2,
    gap: 2,
  },
  toggleOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.light.tint,
  },
  toggleOptionInactive: {
    backgroundColor: 'transparent',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
  },
  currencyToggle: {
    marginLeft: 'auto',
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
});
