import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

export default function ActivityScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Activity</Text>
      </View>

      <View style={styles.activityList}>
        {[
          {
            date: 'March 14',
            activities: [
              {
                type: 'expense',
                category: 'Food',
                amount: 600.0,
                paidBy: 'John',
                currency: 'INR',
                yourShare: 300.0,
              },
              {
                type: 'payment',
                amount: 120.0,
                from: 'You',
                to: 'Sarah',
                currency: 'INR',
              },
              {
                type: 'expense',
                category: 'Gas',
                amount: 100.0,
                paidBy: 'You',
                currency: 'INR',
                yourShare: 50.0,
              },
            ],
          },
          {
            date: 'March 13',
            activities: [
              {
                type: 'expense',
                category: 'Movie',
                amount: 500.0,
                paidBy: 'You',
                currency: 'INR',
                yourShare: 250.0,
              },
              {
                type: 'expense',
                category: 'Dinner',
                amount: 250.0,
                paidBy: 'Mike',
                currency: 'INR',
                yourShare: 125.0,
              },
            ],
          },
        ].map((day, dayIndex) => (
          <View key={dayIndex} style={styles.dayGroup}>
            <Text style={[styles.dateHeader, { color: colors.text }]}>
              {day.date}
            </Text>
            {day.activities.map((activity, activityIndex) => (
              <View
                key={activityIndex}
                style={[
                  styles.activityItem,
                  {
                    backgroundColor:
                      colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7',
                  },
                ]}
              >
                <View style={styles.activityIcon}>
                  <Ionicons
                    name={
                      activity.type === 'payment' ? 'swap-horizontal' : 'cart'
                    }
                    size={24}
                    color={colors.tint}
                  />
                </View>
                <View style={styles.activityDetails}>
                  <View style={styles.activityHeader}>
                    <Text
                      style={[styles.activityTitle, { color: colors.text }]}
                    >
                      {activity.type === 'payment'
                        ? `${activity.from} paid ${activity.to}`
                        : activity.category}
                    </Text>
                    <Text
                      style={[styles.activityAmount, { color: colors.text }]}
                    >
                      {activity.currency} {activity.amount.toFixed(2)}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.activityMeta,
                      { color: colorScheme === 'dark' ? '#666' : '#999' },
                    ]}
                  >
                    {activity.type === 'expense'
                      ? `${activity.paidBy} paid · your share ${
                          activity.currency
                        } ${(activity.yourShare ?? 0).toFixed(2)}`
                      : `${activity.currency} ${activity.amount.toFixed(2)}`}
                  </Text>
                </View>
              </View>
            ))}
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
  activityList: {
    padding: 16,
  },
  dayGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 12,
  },
  activityItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2CC2BA20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityDetails: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  activityTitle: {
    fontSize: 17,
    fontWeight: '500',
  },
  activityAmount: {
    fontSize: 17,
    fontWeight: '600',
  },
  activityMeta: {
    fontSize: 15,
  },
});
