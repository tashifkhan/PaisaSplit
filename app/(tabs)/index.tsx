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
          { name: 'John Smith', amount: 6435, type: 'get' as const },
          { name: 'Sarah Wilson', amount: 2500, type: 'owe' as const },
          { name: 'Mike Johnson', amount: 75.0, type: 'owe' as const },
          { name: 'Emily Brown', amount: 0, type: 'settled' as const },
        ].map((user, index) => (
          <Animated.View
            entering={FadeInUp.delay(200 * index).duration(800)}
            key={index}
          >
            <Pressable
              style={({ pressed }) => [
                styles.userItem,
                { opacity: pressed ? 0.8 : 1 },
                {
                  backgroundColor:
                    colorScheme === 'dark'
                      ? 'rgba(255,255,255,0.05)'
                      : 'rgba(0,0,0,0.02)',
                },
              ]}
            >
              <View style={styles.userInfo}>
                <LinearGradient
                  colors={[colors.tint, colors.tabIconSelected]}
                  style={styles.avatar}
                >
                  <Text style={styles.avatarText}>{user.name[0]}</Text>
                </LinearGradient>
                <Text
                  style={[styles.userName, { color: colors.text }]}
                  numberOfLines={1}
                >
                  {user.name}
                </Text>
              </View>
              <View style={styles.amountWithIcon}>
                <AmountDisplay
                  amount={user.amount}
                  showPrefix={false}
                  type={user.type}
                  style={[
                    styles.userAmount,
                    {
                      color:
                        user.type === 'get'
                          ? colors.positive
                          : user.type === 'owe'
                          ? colors.negative
                          : colors.text,
                    },
                  ]}
                />
                <Ionicons
                  name={
                    user.type === 'get'
                      ? 'arrow-up-circle'
                      : user.type === 'owe'
                      ? 'arrow-down-circle'
                      : 'checkmark-circle'
                  }
                  size={24}
                  color={
                    user.type === 'get'
                      ? colors.positive
                      : user.type === 'owe'
                      ? colors.negative
                      : colors.text
                  }
                  style={styles.icon}
                />
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
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginVertical: 6,
    borderRadius: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  userName: {
    fontSize: 17,
    fontWeight: '600',
    flex: 1,
  },
  amountWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    marginLeft: 4,
  },
  userAmount: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
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
