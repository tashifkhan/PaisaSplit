import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

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

export default function BalancesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const router = useRouter();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Animated.View entering={FadeInDown.duration(800)} style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Balances</Text>
      </Animated.View>

      <View
        style={[
          styles.summaryContainer,
          isDesktop && styles.summaryContainerDesktop,
        ]}
      >
        {[
          { label: 'You owe', amount: 2500.0, type: 'negative' },
          { label: 'You get', amount: 6360.0, type: 'positive' },
        ].map((item, index) => (
          <Animated.View
            key={index}
            entering={FadeInUp.delay(400 * index).duration(800)}
            style={[styles.summaryBox, isDesktop && styles.summaryBoxDesktop]}
          >
            <BlurView
              intensity={80}
              tint={colorScheme === 'dark' ? 'dark' : 'light'}
              style={styles.blurContainer}
            >
              <LinearGradient
                colors={
                  item.type === 'positive'
                    ? ['rgba(52, 199, 89, 0.1)', 'rgba(52, 199, 89, 0.05)']
                    : ['rgba(255, 59, 48, 0.1)', 'rgba(255, 59, 48, 0.05)']
                }
                style={styles.gradientOverlay}
              />
              <Text style={[styles.summaryLabel, { color: colors.text }]}>
                {item.label}
              </Text>
              <AmountDisplay
                amount={item.amount}
                style={[
                  styles.summaryAmount,
                  {
                    color:
                      item.type === 'positive'
                        ? colors.positive
                        : colors.negative,
                  },
                ]}
              />
            </BlurView>
          </Animated.View>
        ))}
      </View>

      <View style={[styles.usersList, isDesktop && styles.usersListDesktop]}>
        {[
          { name: 'Aarush', amount: 180.0, type: 'get' as const },
          { name: 'Adarsh S.', amount: 377.0, type: 'get' as const },
          { name: 'Arnav Vats', amount: 60.0, type: 'get' as const },
          {
            name: 'Harleen',
            amount: 2483.68,
            type: 'get' as const,
            transactions: [
              { description: 'Non-group expense', amount: 2135.88 },
              { description: 'The Big Chill', amount: 347.8 },
            ],
          },
          { name: 'mehul', amount: 250.0, type: 'get' as const },
          { name: 'Nipun PRAKASH', amount: 583.0, type: 'owe' as const },
          {
            name: 'Radhika',
            amount: 4206.0,
            type: 'get' as const,
            transactions: [
              { description: 'Non-group expense', amount: 3921.0 },
              { description: 'kattt gayaaaa night', amount: 285.0 },
            ],
          },
          { name: 'Shahzad', amount: 65.0, type: 'get' as const },
          { name: 'Shashwat Singh', amount: 542.75, type: 'owe' as const },
        ].map((user, index) => (
          <Animated.View
            entering={FadeInUp.delay(200 * index).duration(800)}
            key={index}
          >
            <Pressable
              onPress={() => router.push(`/user/${user.name}`)}
              style={({ pressed }) => [
                styles.userItem,
                {
                  backgroundColor:
                    colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7',
                  opacity: pressed ? 0.7 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: colorScheme === 'dark' ? 0.3 : 0.1,
                  shadowRadius: 8,
                  elevation: 3,
                },
              ]}
            >
              <View style={styles.userInfo}>
                <View style={[styles.avatar, { backgroundColor: colors.tint }]}>
                  <Text style={styles.avatarText}>{user.name[0]}</Text>
                </View>
                <View style={styles.userDetails}>
                  <View style={styles.userMainInfo}>
                    <Text style={[styles.userName, { color: colors.text }]}>
                      {user.name}
                    </Text>
                    <View style={styles.amountWithIcon}>
                      <AmountDisplay
                        amount={user.amount}
                        showPrefix={false}
                        style={[
                          styles.userAmount,
                          {
                            color:
                              user.type === 'get'
                                ? colors.positive
                                : colors.negative,
                          },
                        ]}
                      />
                      <Ionicons
                        name={
                          user.type === 'get'
                            ? 'arrow-up-circle'
                            : 'arrow-down-circle'
                        }
                        size={20}
                        color={
                          user.type === 'get'
                            ? colors.positive
                            : colors.negative
                        }
                      />
                    </View>
                  </View>
                  {user.transactions && (
                    <Text
                      style={[styles.transactionText, { color: colors.text }]}
                    >
                      {user.transactions
                        .map(
                          (t) => `${t.description} · ₹${t.amount.toFixed(2)}`
                        )
                        .join('\n')}
                    </Text>
                  )}
                </View>
              </View>
            </Pressable>
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  summaryContainerDesktop: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  summaryBoxDesktop: {
    padding: 24,
  },
  usersListDesktop: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  summaryBox: {
    flex: 1,
    height: 'auto',
    minHeight: 120,
    borderRadius: 20,
    overflow: 'hidden',
  },
  blurContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  summaryLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
    opacity: 0.8,
  },
  summaryAmount: {
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  usersList: {
    padding: 16,
    gap: 16,
  },
  userItem: {
    borderRadius: 12,
    padding: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  userMainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  amountWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userName: {
    fontSize: 17,
    fontWeight: '600',
  },
  userAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionText: {
    fontSize: 15,
    opacity: 0.6,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amountPrefix: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 2,
  },
  amountText: {
    lineHeight: 28,
  },
});
