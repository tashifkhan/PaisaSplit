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
import { DataService } from '@/services/DataService';
import AmountDisplay from '@/components/AmountDisplay';

export default function BalancesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const router = useRouter();

  // Load data from service
  const balanceData = DataService.getBalanceData();

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
          {
            label: 'You owe',
            amount: balanceData.summary.youOwe,
            type: 'negative',
          },
          {
            label: 'You get',
            amount: balanceData.summary.youGet,
            type: 'positive',
          },
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
        {balanceData.users.map((user, index) => (
          <Animated.View
            entering={FadeInUp.delay(200 * index).duration(800)}
            key={index}
          >
            <Pressable
              onPress={() => router.push(`/user/${user.id}`)}
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
