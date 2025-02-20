import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

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

      <View style={styles.groupsList}>
        {[
          { name: 'Family', amount: 250.0, type: 'lent', currency: 'INR' },
          {
            name: 'Thailand trip',
            amount: 7500.0,
            type: 'owe',
            currency: 'INR',
          },
          { name: 'Panchayat', amount: 0, type: 'settled' },
          { name: 'Dates', amount: 0, type: 'settled' },
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
              <View>
                <Text style={[styles.groupName, { color: colors.text }]}>
                  {group.name}
                </Text>
                <Text
                  style={[
                    styles.groupAmount,
                    {
                      color:
                        group.type === 'lent'
                          ? colors.positive
                          : group.type === 'owe'
                          ? colors.negative
                          : colors.text,
                    },
                  ]}
                >
                  {group.type === 'settled'
                    ? 'Settled up'
                    : `${group.type === 'owe' ? 'you owe' : 'you lent'} ${
                        group.currency
                      } ${group.amount.toFixed(2)}`}
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
  groupName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  groupAmount: {
    fontSize: 16,
  },
});
