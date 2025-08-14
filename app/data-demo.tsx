import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
} from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { DataService } from '@/services/DataService';
import { DataCreator } from '@/utils/DataCreator';
import { ProfileDataCreator } from '@/utils/ProfileDataCreator';
import AmountDisplay from '@/components/AmountDisplay';

export default function DataDemoScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Load all data from services
  const balanceData = DataService.getBalanceData();
  const groupData = DataService.getGroupData();
  const activityData = DataService.getActivityData();
  const profileData = DataService.getProfileData();
  const supportData = DataService.getSupportData();

  const handleSearchExample = () => {
    const searchResults = DataService.searchActivities('big chill');
    console.log('Search results for "big chill":', searchResults);
  };

  const handleFilterExample = () => {
    const expensesOnly = DataService.filterActivitiesByType('expenses');
    console.log('Expenses only:', expensesOnly);
  };

  const handleCreateSampleData = () => {
    const sampleUser = DataCreator.generateSampleUser();
    const sampleGroup = DataCreator.generateSampleGroup();
    const sampleExpense = DataCreator.generateSampleExpense();

    Alert.alert(
      'Sample Data Created',
      `Created:\n• User: ${sampleUser.name}\n• Group: ${sampleGroup.name}\n• Expense: ${sampleExpense.notes}\n\nCheck console for full data`,
      [{ text: 'OK' }]
    );

    console.log('Sample User:', sampleUser);
    console.log('Sample Group:', sampleGroup);
    console.log('Sample Expense:', sampleExpense);
  };

  const handleCreateProfileData = () => {
    const sampleProfile = ProfileDataCreator.generateSampleProfile();
    const sampleMenuItem = ProfileDataCreator.generateSampleMenuItem();
    const sampleFAQ = ProfileDataCreator.generateSampleFAQ();

    Alert.alert(
      'Profile Data Created',
      `Created:\n• Profile: ${sampleProfile.name}\n• Menu Item: ${
        sampleMenuItem.title
      }\n• FAQ: ${sampleFAQ.question.substring(
        0,
        30
      )}...\n\nCheck console for full data`,
      [{ text: 'OK' }]
    );

    console.log('Sample Profile:', sampleProfile);
    console.log('Sample Menu Item:', sampleMenuItem);
    console.log('Sample FAQ:', sampleFAQ);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.section}>
        <Text style={[styles.title, { color: colors.text }]}>
          Data Abstraction Demo
        </Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          All data is now loaded from JSON files
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Balance Summary
        </Text>
        <View style={styles.summaryRow}>
          <Text style={{ color: colors.text }}>You owe: </Text>
          <AmountDisplay
            amount={balanceData.summary.youOwe}
            style={{ color: colors.negative }}
          />
        </View>
        <View style={styles.summaryRow}>
          <Text style={{ color: colors.text }}>You get: </Text>
          <AmountDisplay
            amount={balanceData.summary.youGet}
            style={{ color: colors.positive }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Users ({balanceData.users.length})
        </Text>
        {balanceData.users.slice(0, 3).map((user) => (
          <View key={user.id} style={styles.listItem}>
            <Text style={{ color: colors.text }}>{user.name}</Text>
            <AmountDisplay
              amount={user.amount}
              style={{
                color: user.type === 'get' ? colors.positive : colors.negative,
              }}
            />
          </View>
        ))}
        <Text style={[styles.moreText, { color: colors.text }]}>
          ...and {balanceData.users.length - 3} more
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Groups ({groupData.groups.length})
        </Text>
        {groupData.groups.slice(0, 3).map((group) => (
          <View key={group.id} style={styles.listItem}>
            <Text style={{ color: colors.text }}>{group.name}</Text>
            <AmountDisplay
              amount={group.amount}
              style={{
                color: group.type === 'get' ? colors.positive : colors.negative,
              }}
            />
          </View>
        ))}
        <Text style={[styles.moreText, { color: colors.text }]}>
          ...and {groupData.groups.length - 3} more
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Total Activities
        </Text>
        <Text style={{ color: colors.text }}>
          {activityData.activities.reduce(
            (total, day) => total + day.activities.length,
            0
          )}{' '}
          activities across {activityData.activities.length} days
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Profile Information
        </Text>
        <Text style={{ color: colors.text }}>
          User: {profileData.user.name} ({profileData.user.email})
        </Text>
        <Text style={{ color: colors.text }}>
          Default Currency:{' '}
          {DataService.getCurrencySymbol(profileData.user.defaultCurrency)}{' '}
          {profileData.user.defaultCurrency}
        </Text>
        <Text style={{ color: colors.text }}>
          Menu Items: {profileData.menuItems.length}
        </Text>
        <Text style={{ color: colors.text }}>
          Settings Items: {profileData.settingsItems.length}
        </Text>
        <Text style={{ color: colors.text }}>
          FAQ Items: {supportData.faqs.length}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Test Data Service Functions
        </Text>
        <View style={styles.buttonContainer}>
          <Button title="Search Activities" onPress={handleSearchExample} />
          <Button title="Filter Activities" onPress={handleFilterExample} />
          <Button title="Create Sample Data" onPress={handleCreateSampleData} />
          <Button
            title="Create Profile Data"
            onPress={handleCreateProfileData}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          How to Add Data
        </Text>
        <Text style={[styles.instructions, { color: colors.text }]}>
          1. Edit JSON files in /data/ directory{'\n'}
          2. Add new entries following the existing structure{'\n'}
          3. Data will automatically appear in the app{'\n'}
          4. No need to restart - changes reflect immediately
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  moreText: {
    fontStyle: 'italic',
    opacity: 0.7,
    marginTop: 8,
  },
  instructions: {
    lineHeight: 20,
    opacity: 0.8,
  },
  buttonContainer: {
    gap: 10,
  },
});
