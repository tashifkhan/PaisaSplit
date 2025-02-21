import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

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

export default function GroupsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Groups</Text>
        <Pressable style={styles.addButton}>
          <Ionicons name="person-add" size={24} color={colors.tint} />
        </Pressable>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryBox}>
          <BlurView
            intensity={80}
            tint={colorScheme === 'dark' ? 'dark' : 'light'}
            style={styles.blurContainer}
          >
            <LinearGradient
              colors={['rgba(52, 199, 89, 0.1)', 'rgba(52, 199, 89, 0.05)']}
              style={styles.gradientOverlay}
            />
            <Text style={[styles.summaryLabel, { color: colors.text }]}>
              Overall, you are owed
            </Text>
            <AmountDisplay
              amount={6736.62}
              style={[styles.summaryAmount, { color: colors.positive }]}
            />
          </BlurView>
        </View>
      </View>

      <View style={styles.groupsList}>
        {[
          {
            name: 'Chakna',
            amount: 33.75,
            type: 'get',
            members: ['Shashwat S.'],
          },
          {
            name: 'kattt gayaaaa night out',
            amount: 515.0,
            type: 'get',
            members: ['Radhika', 'Yash'],
          },
          {
            name: 'Panchayat',
            amount: 934.5,
            type: 'owe',
            members: ['Nipun P.', 'Shashwat S.'],
          },
          {
            name: 'Sector-18',
            amount: 30.0,
            type: 'owe',
            members: ['Shashwat S.'],
          },
          {
            name: 'The Big Chill',
            amount: 347.8,
            type: 'get',
            members: ['Harleen'],
          },
          {
            name: 'Triads',
            amount: 45.0,
            type: 'owe',
            members: ['Shashwat S.'],
          },
        ].map((group, index) => (
          <View
            key={index}
            style={[
              styles.groupItem,
              {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7',
              },
            ]}
          >
            <View style={styles.groupInfo}>
              <View
                style={[styles.groupIcon, { backgroundColor: colors.tint }]}
              >
                <Text style={styles.groupIconText}>{group.name[0]}</Text>
              </View>
              <View style={styles.groupDetails}>
                <View style={styles.groupMainInfo}>
                  <Text style={[styles.groupName, { color: colors.text }]}>
                    {group.name}
                  </Text>
                  <View style={styles.amountWithIcon}>
                    <AmountDisplay
                      amount={group.amount}
                      showPrefix={false}
                      style={[
                        styles.groupAmount,
                        {
                          color:
                            group.type === 'get'
                              ? colors.positive
                              : colors.negative,
                        },
                      ]}
                    />
                    <Ionicons
                      name={
                        group.type === 'get'
                          ? 'arrow-up-circle'
                          : 'arrow-down-circle'
                      }
                      size={20}
                      color={
                        group.type === 'get' ? colors.positive : colors.negative
                      }
                    />
                  </View>
                </View>
                <Text style={[styles.groupMembers, { color: colors.text }]}>
                  {group.members.join(' · ')}
                </Text>
              </View>
            </View>
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
    padding: 16,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 8,
  },
  summaryContainer: {
    padding: 16,
  },
  summaryBox: {
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
  groupsList: {
    padding: 16,
    gap: 16,
  },
  groupItem: {
    borderRadius: 12,
    padding: 16,
  },
  groupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  groupIconText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  groupDetails: {
    flex: 1,
  },
  groupMainInfo: {
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
  groupName: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  groupAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  groupMembers: {
    fontSize: 15,
    opacity: 0.6,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amountText: {
    lineHeight: 28,
  },
});
