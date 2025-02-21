import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  TextInput,
} from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useState, useRef, useMemo } from 'react';
import { useRouter } from 'expo-router';

export default function ActivityScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const scrollY = useRef(new Animated.Value(0)).current;

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'expenses', label: 'Expenses' },
    { id: 'payments', label: 'Payments' },
    { id: 'groups', label: 'Groups' },
  ];

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const activities = [
    {
      date: 'Today',
      activities: [
        {
          type: 'expense',
          category: 'Food',
          amount: 600.0,
          paidBy: 'John',
          currency: 'INR',
          yourShare: 300.0,
          group: 'Lunch Group',
          status: 'pending',
          paymentMethod: 'UPI',
          notes: 'Team lunch at Big Chill',
        },
        {
          type: 'payment',
          amount: 120.0,
          from: 'You',
          to: 'Sarah',
          currency: 'INR',
          status: 'completed',
          paymentMethod: 'Bank Transfer',
          notes: 'Movie tickets settlement',
        },
      ],
    },
    {
      date: 'Yesterday',
      activities: [
        {
          type: 'expense',
          category: 'Movie',
          amount: 500.0,
          paidBy: 'You',
          currency: 'INR',
          yourShare: 250.0,
          group: 'Weekend Group',
          status: 'settled',
          paymentMethod: 'Cash',
          notes: 'Oppenheimer IMAX',
        },
      ],
    },
  ];

  const filteredActivities = useMemo(() => {
    return activities
      .map((day) => ({
        ...day,
        activities: day.activities.filter(
          (activity) =>
            activity.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            activity.category
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            activity.group?.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter((day) => day.activities.length > 0);
  }, [searchQuery]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <Text style={[styles.title, { color: colors.text }]}>Activity</Text>
      </Animated.View>

      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchBar,
            { backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7' },
          ]}
        >
          <Ionicons name="search" size={20} color={colors.text} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search activities..."
            placeholderTextColor={colorScheme === 'dark' ? '#666' : '#999'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.text} />
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filters.map((filter) => (
            <Pressable
              key={filter.id}
              onPress={() => setSelectedFilter(filter.id)}
              style={[
                styles.filterButton,
                selectedFilter === filter.id && {
                  backgroundColor: colors.tint,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter.id
                    ? styles.filterTextSelected
                    : { color: colors.text },
                ]}
              >
                {filter.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.scrollView} scrollEventThrottle={16}>
        <View style={styles.activityList}>
          {filteredActivities.map((day, dayIndex) => (
            <View key={dayIndex} style={styles.dayGroup}>
              <Text style={[styles.dateHeader, { color: colors.text }]}>
                {day.date}
              </Text>
              {day.activities
                .filter(
                  (activity) =>
                    selectedFilter === 'all' ||
                    (selectedFilter === 'expenses' &&
                      activity.type === 'expense') ||
                    (selectedFilter === 'payments' &&
                      activity.type === 'payment') ||
                    (selectedFilter === 'groups' && activity.group)
                )
                .map((activity, activityIndex) => (
                  <Pressable
                    key={activityIndex}
                    onPress={() => {
                      // TODO: Navigate to activity detail screen
                      router.push(`/activity/${activity.id}`);
                    }}
                    style={({ pressed }) => [
                      styles.activityItem,
                      {
                        backgroundColor:
                          colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7',
                        transform: [{ scale: pressed ? 0.98 : 1 }],
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.activityIcon,
                        { backgroundColor: `${colors.tint}20` },
                      ]}
                    >
                      <Ionicons
                        name={
                          activity.type === 'payment'
                            ? 'swap-horizontal'
                            : activity.category?.toLowerCase() === 'food'
                            ? 'restaurant'
                            : activity.category?.toLowerCase() === 'movie'
                            ? 'film'
                            : 'cart'
                        }
                        size={24}
                        color={colors.tint}
                      />
                    </View>
                    <View style={styles.activityDetails}>
                      <View style={styles.activityHeader}>
                        <View style={styles.activityTitleContainer}>
                          <Text
                            style={[
                              styles.activityTitle,
                              { color: colors.text },
                            ]}
                          >
                            {activity.type === 'payment'
                              ? `${activity.from} paid ${activity.to}`
                              : activity.category}
                          </Text>
                          {activity.group && (
                            <Text
                              style={[
                                styles.groupTag,
                                { backgroundColor: `${colors.tint}20` },
                              ]}
                            >
                              {activity.group}
                            </Text>
                          )}
                        </View>
                        <Text
                          style={[
                            styles.activityAmount,
                            {
                              color:
                                activity.type === 'payment'
                                  ? colors.positive
                                  : colors.text,
                            },
                          ]}
                        >
                          {activity.currency} {activity.amount.toFixed(2)}
                        </Text>
                      </View>
                      <View style={styles.activityMetaContainer}>
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
                            : `${activity.paymentMethod}`}
                        </Text>
                        <View
                          style={[
                            styles.statusIndicator,
                            {
                              backgroundColor:
                                activity.status === 'completed' ||
                                activity.status === 'settled'
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
                                  activity.status === 'completed' ||
                                  activity.status === 'settled'
                                    ? colors.positive
                                    : colors.negative,
                              },
                            ]}
                          >
                            {activity.status}
                          </Text>
                        </View>
                      </View>
                      {activity.notes && (
                        <Text
                          style={[
                            styles.notes,
                            { color: colorScheme === 'dark' ? '#666' : '#999' },
                          ]}
                        >
                          {activity.notes}
                        </Text>
                      )}
                    </View>
                  </Pressable>
                ))}
            </View>
          ))}
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
    padding: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  filterContainer: {
    paddingVertical: 8,
    zIndex: 1,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#00000010',
  },
  filterText: {
    fontSize: 15,
    fontWeight: '600',
  },
  filterTextSelected: {
    color: 'white',
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityDetails: {
    flex: 1,
    gap: 4,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  activityTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  activityTitle: {
    fontSize: 17,
    fontWeight: '500',
  },
  groupTag: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: '500',
    alignSelf: 'flex-start',
  },
  activityAmount: {
    fontSize: 17,
    fontWeight: '600',
  },
  activityMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityMeta: {
    fontSize: 13,
    flex: 1,
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  notes: {
    fontSize: 13,
    marginTop: 4,
  },
  searchContainer: {
    padding: 16,
    paddingTop: 0,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
});
