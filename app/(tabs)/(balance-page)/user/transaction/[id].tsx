import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

export default function TransactionDetailScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Mock transaction data - in real app, fetch based on id
  const transaction = {
    id: '1',
    description: 'big chill Khan markwt',
    amount: 2200.0,
    yourAmount: 1100.0,
    type: 'borrowed',
    date: '14-Apr-2024',
    time: '12:08',
    category: 'Food & Drink',
    notes: 'Lunch with friends',
    participants: [
      { name: 'Harleen', amount: 2200.0, status: 'settled' },
      { name: 'You', amount: 1100.0, status: 'pending' },
    ],
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.title, { color: colors.text }]}>Details</Text>
          <Pressable>
            <Ionicons
              name="ellipsis-horizontal"
              size={24}
              color={colors.text}
            />
          </Pressable>
        </View>

        <View style={styles.content}>
          <View
            style={[
              styles.amountCard,
              {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: colorScheme === 'dark' ? 0.3 : 0.15,
                shadowRadius: 12,
                elevation: 8,
              },
            ]}
          >
            <View style={styles.amountHeader}>
              <View
                style={[
                  styles.categoryIcon,
                  { backgroundColor: `${colors.tint}20` },
                ]}
              >
                <Ionicons
                  name={
                    transaction.type === 'borrowed' ? 'arrow-down' : 'arrow-up'
                  }
                  size={24}
                  color={colors.tint}
                />
              </View>
              <Text style={[styles.category, { color: colors.text }]}>
                {transaction.description}
              </Text>
            </View>
            <Text style={[styles.amount, { color: colors.text }]}>
              ₹{transaction.amount.toFixed(2)}
            </Text>
            <Text style={[styles.date, { color: colors.text }]}>
              {transaction.date}
            </Text>
          </View>

          <View
            style={[
              styles.section,
              {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: colorScheme === 'dark' ? 0.3 : 0.1,
                shadowRadius: 8,
                elevation: 3,
              },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Split Details
            </Text>
            <View style={styles.splitList}>
              {transaction.participants.map((participant, index) => (
                <View key={index} style={styles.splitItem}>
                  <View style={styles.personInfo}>
                    <View
                      style={[styles.avatar, { backgroundColor: colors.tint }]}
                    >
                      <Text style={styles.avatarText}>
                        {participant.name[0]}
                      </Text>
                    </View>
                    <Text style={[styles.personName, { color: colors.text }]}>
                      {participant.name}
                    </Text>
                  </View>
                  <View style={styles.amountInfo}>
                    <Text style={[styles.splitAmount, { color: colors.text }]}>
                      ₹{participant.amount.toFixed(2)}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            participant.status === 'settled'
                              ? colors.positive + '20'
                              : colors.negative + '20',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color:
                              participant.status === 'settled'
                                ? colors.positive
                                : colors.negative,
                          },
                        ]}
                      >
                        {participant.status}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View
            style={[
              styles.section,
              {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: colorScheme === 'dark' ? 0.3 : 0.1,
                shadowRadius: 8,
                elevation: 3,
              },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Additional Info
            </Text>
            <View style={styles.infoList}>
              <View style={styles.infoItem}>
                <Text style={[styles.infoLabel, { color: colors.text }]}>
                  Group
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  Non-group expense
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={[styles.infoLabel, { color: colors.text }]}>
                  Paid by
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  Harleen
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={[styles.infoLabel, { color: colors.text }]}>
                  Payment Method
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  UPI
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable
              style={[
                styles.actionButton,
                {
                  backgroundColor: colors.tint,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  elevation: 4,
                },
              ]}
            >
              <Text style={styles.actionButtonText}>Mark as Settled</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

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
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  amountCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  amountHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  category: {
    fontSize: 17,
    fontWeight: '600',
  },
  amount: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  date: {
    fontSize: 15,
  },
  section: {
    padding: 16,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 16,
  },
  splitList: {
    gap: 16,
  },
  splitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  personInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  personName: {
    fontSize: 17,
    fontWeight: '500',
  },
  amountInfo: {
    alignItems: 'flex-end',
    gap: 4,
  },
  splitAmount: {
    fontSize: 17,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  infoList: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 15,
    opacity: 0.7,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  actions: {
    marginTop: 8,
  },
  actionButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
});
