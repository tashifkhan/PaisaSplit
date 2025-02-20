import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/300' }}
            style={styles.avatar}
          />
          <Pressable style={styles.editAvatarButton}>
            <Ionicons name="camera" size={20} color="white" />
          </Pressable>
        </View>
        <Text style={[styles.name, { color: colors.text }]}>Tashif</Text>
        <Text
          style={[
            styles.email,
            { color: colorScheme === 'dark' ? '#666' : '#999' },
          ]}
        >
          developor@tashif.codes
        </Text>
      </View>

      <View style={styles.menuSection}>
        {[
          { icon: 'person-outline' as const, title: 'Account Settings' },
          { icon: 'notifications-outline' as const, title: 'Notifications' },
          { icon: 'card-outline' as const, title: 'Payment Methods' },
          { icon: 'stats-chart-outline' as const, title: 'Spending Reports' },
          { icon: 'settings-outline' as const, title: 'Preferences' },
          { icon: 'help-circle-outline' as const, title: 'Help & Support' },
        ].map((item, index) => (
          <Pressable
            key={index}
            style={[
              styles.menuItem,
              {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7',
              },
            ]}
          >
            <View style={styles.menuItemContent}>
              <View
                style={[
                  styles.menuItemIcon,
                  { backgroundColor: `${colors.tint}20` },
                ]}
              >
                <Ionicons name={item.icon} size={24} color={colors.tint} />
              </View>
              <Text style={[styles.menuItemTitle, { color: colors.text }]}>
                {item.title}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={colorScheme === 'dark' ? '#666' : '#999'}
            />
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.logoutButton}>
        <Text style={[styles.logoutText, { color: colors.negative }]}>
          Log Out
        </Text>
      </Pressable>
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
  profileSection: {
    alignItems: 'center',
    padding: 16,
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#2CC2BA',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
  },
  menuSection: {
    padding: 16,
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemTitle: {
    fontSize: 17,
    fontWeight: '500',
  },
  logoutButton: {
    padding: 16,
    marginTop: 16,
    marginBottom: 32,
  },
  logoutText: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
});
