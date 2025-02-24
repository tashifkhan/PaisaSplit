import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useState } from 'react';

export default function PrivacyScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: true,
    activitySharing: false,
    dataCollection: true,
    locationServices: false,
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
        <Text style={[styles.title, { color: colors.text }]}>Privacy</Text>
      </View>

      <View style={styles.settingsSection}>
        {Object.entries(privacySettings).map(([key, value]) => (
          <View
            key={key}
            style={[
              styles.settingItem,
              {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7',
              },
            ]}
          >
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                {key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, (str) => str.toUpperCase())}
              </Text>
              <Text
                style={[
                  styles.settingDescription,
                  { color: colors.text + '99' },
                ]}
              >
                {getSettingDescription(key)}
              </Text>
            </View>
            <Switch
              value={value}
              onValueChange={(newValue) =>
                setPrivacySettings((prev) => ({ ...prev, [key]: newValue }))
              }
              trackColor={{ false: '#767577', true: colors.tint }}
            />
          </View>
        ))}
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.deleteButton,
          { opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <Text style={styles.deleteButtonText}>Delete Account</Text>
      </Pressable>
    </View>
  );
}

function getSettingDescription(key: string): string {
  const descriptions: Record<string, string> = {
    profileVisibility: 'Control who can see your profile information',
    activitySharing: 'Share your activity with friends',
    dataCollection: 'Allow us to collect usage data to improve the app',
    locationServices: 'Enable location-based features',
  };
  return descriptions[key] || '';
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
  backButton: {
    zIndex: 2,
    borderRadius: 16,
    overflow: 'hidden',
  },
  backButtonBlur: {
    padding: 6,
    borderRadius: 16,
  },
  settingsSection: {
    padding: 16,
    gap: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
  deleteButton: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
