import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useState } from 'react';

export default function SecurityScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [settings, setSettings] = useState({
    twoFactor: true,
    biometric: false,
    notifications: true,
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
        <Text style={[styles.title, { color: colors.text }]}>Security</Text>
      </View>

      <View style={styles.settingsSection}>
        {Object.entries(settings).map(([key, value]) => (
          <View
            key={key}
            style={[
              styles.settingItem,
              {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7',
              },
            ]}
          >
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              {key
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, (str) => str.toUpperCase())}
            </Text>
            <Switch
              value={value}
              onValueChange={(newValue) =>
                setSettings((prev) => ({ ...prev, [key]: newValue }))
              }
              trackColor={{ false: '#767577', true: colors.tint }}
            />
          </View>
        ))}

        <Pressable
          style={({ pressed }) => [
            styles.changePasswordButton,
            {
              backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7',
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Text style={[styles.changePasswordText, { color: colors.text }]}>
            Change Password
          </Text>
          <Ionicons name="chevron-forward" size={24} color={colors.text} />
        </Pressable>
      </View>
    </View>
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
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  changePasswordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  changePasswordText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
