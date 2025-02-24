import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';

export default function AccountSettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <BlurView intensity={80} style={styles.backButtonBlur}>
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </BlurView>
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      </View>

      <View style={styles.settingsSection}>
        {[
          {
            icon: 'person-outline',
            title: 'Personal Information',
            subtitle: 'Update your name, email, and phone number',
          },
          {
            icon: 'lock-closed-outline',
            title: 'Security',
            subtitle: 'Password and authentication settings',
          },
          {
            icon: 'globe-outline',
            title: 'Language / Currency',
            subtitle: 'Choose your preferred language / currency',
          },
          {
            icon: 'shield-checkmark-outline',
            title: 'Privacy',
            subtitle:
              'Control your data and privacy settings. ps. our app is open sourced',
          },
        ].map((item, index) => (
          <Pressable
            key={index}
            style={({ pressed }) => [
              styles.settingsItem,
              {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7',
                transform: [{ scale: pressed ? 0.98 : 1 }],
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: colorScheme === 'dark' ? 0.3 : 0.1,
                shadowRadius: 8,
                elevation: 3,
              },
            ]}
          >
            <View style={styles.settingsItemContent}>
              <View
                style={[
                  styles.settingsItemIcon,
                  { backgroundColor: `${colors.tint}20` },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={24}
                  color={colors.tint}
                />
              </View>
              <View style={styles.settingsItemText}>
                <Text
                  style={[styles.settingsItemTitle, { color: colors.text }]}
                >
                  {item.title}
                </Text>
                <Text
                  style={[
                    styles.settingsItemSubtitle,
                    { color: colorScheme === 'dark' ? '#666' : '#999' },
                  ]}
                >
                  {item.subtitle}
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={colorScheme === 'dark' ? '#666' : '#999'}
            />
          </Pressable>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    flex: 1,
    marginLeft: 8,
  },
  settingsSection: {
    padding: 16,
    gap: 12,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
  },
  settingsItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsItemText: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 17,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingsItemSubtitle: {
    fontSize: 14,
  },
  backButton: {
    zIndex: 2,
    borderRadius: 16,
    overflow: 'hidden',
  },
  backButtonBlur: {
    padding: 6,
    borderRadius: 16,
  },
});
