import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

export default function BalancesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Balances</Text>
      </View>
      
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryBox, { backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7' }]}>
          <Text style={[styles.summaryLabel, { color: colors.text }]}>You owe</Text>
          <Text style={[styles.summaryAmount, { color: colors.negative }]}>₹2,500.00</Text>
        </View>
        <View style={[styles.summaryBox, { backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7' }]}>
          <Text style={[styles.summaryLabel, { color: colors.text }]}>You get</Text>
          <Text style={[styles.summaryAmount, { color: colors.positive }]}>₹6,360.00</Text>
        </View>
      </View>

      <View style={styles.usersList}>
        {[
          { name: 'John Smith', amount: 6435.00, type: 'get' },
          { name: 'Sarah Wilson', amount: 2500.00, type: 'owe' },
          { name: 'Mike Johnson', amount: 75.00, type: 'owe' },
          { name: 'Emily Brown', amount: 0, type: 'settled' },
        ].map((user, index) => (
          <View 
            key={index}
            style={[
              styles.userItem,
              { borderBottomColor: colorScheme === 'dark' ? '#2C2C2E' : '#E5E5EA' }
            ]}
          >
            <View style={styles.userInfo}>
              <View style={[styles.avatar, { backgroundColor: colors.tint }]}>
                <Text style={styles.avatarText}>{user.name[0]}</Text>
              </View>
              <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
            </View>
            <Text
              style={[
                styles.userAmount,
                { color: user.type === 'get' ? colors.positive : user.type === 'owe' ? colors.negative : colors.text }
              ]}
            >
              {user.type === 'settled' ? 'Settled up' : `${user.type === 'owe' ? 'you owe' : 'you get'} ₹${user.amount.toFixed(2)}`}
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
    padding: 16,
    borderRadius: 12,
  },
  summaryLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  usersList: {
    padding: 16,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
  },
  userAmount: {
    fontSize: 16,
    fontWeight: '500',
  },
});