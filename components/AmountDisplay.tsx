import { View, Text, StyleSheet } from 'react-native';
import { DataService } from '@/services/DataService';

interface AmountDisplayProps {
  amount: number;
  style?: any;
  showPrefix?: boolean;
  type?: 'get' | 'owe' | 'settled';
  currency?: string;
}

export default function AmountDisplay({
  amount,
  style,
  showPrefix = true,
  type,
  currency = 'INR',
}: AmountDisplayProps) {
  const currencySymbol = DataService.getCurrencySymbol(currency);
  const formattedAmount = DataService.formatAmount(amount);
  const shouldSplit = formattedAmount.length > 8;

  if (shouldSplit) {
    return (
      <View style={styles.amountContainer}>
        <Text style={[style, styles.amountText]}>
          {currencySymbol}
          {formattedAmount}
        </Text>
      </View>
    );
  }

  return (
    <Text style={[style]}>
      {currencySymbol}
      {formattedAmount}
    </Text>
  );
}

const styles = StyleSheet.create({
  amountContainer: {
    alignItems: 'flex-end',
  },
  amountText: {
    lineHeight: 28,
  },
});
