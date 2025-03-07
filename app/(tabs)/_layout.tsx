import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  useColorScheme,
  useWindowDimensions,
  View,
  StyleSheet,
  Text,
  Pressable,
  Platform,
} from 'react-native';
import { Link } from 'expo-router';
import Colors from '@/constants/Colors';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  return (
    <View style={styles.container}>
      {isDesktop && (
        <View
          style={[
            styles.sidebar,
            {
              backgroundColor: colorScheme === 'dark' ? '#0A0A0A' : '#fff',
              borderRightColor: colorScheme === 'dark' ? '#222' : '#E5E7EB',
              borderRightWidth: 1,
            },
          ]}
        >
          <View style={styles.logo}>
            <Text
              style={[
                styles.logoText,
                { color: Colors[colorScheme ?? 'light'].text },
              ]}
            >
              PaisaSplit
            </Text>
          </View>
          <View
            style={[
              styles.divider,
              { backgroundColor: colorScheme === 'dark' ? '#222' : '#E5E7EB' },
            ]}
          />
          <View style={styles.sidebarNav}>
            {[
              { name: '', title: 'Balances', icon: 'pie-chart' },
              { name: 'groups', title: 'Groups', icon: 'people' },
              { name: 'add-expense', title: 'Add', icon: 'add-circle' },
              { name: 'activity', title: 'Activity', icon: 'list' },
              {
                name: '(profile-page)/profile',
                title: 'Profile',
                icon: 'person',
              },
            ].map((item) => (
              <Link href={`/(tabs)/${item.name}`} key={item.name} asChild>
                <Pressable
                  style={({ pressed, hovered }) => [
                    styles.sidebarItem,
                    pressed && styles.sidebarItemPressed,
                    hovered && [
                      styles.sidebarItemHovered,
                      {
                        backgroundColor:
                          colorScheme === 'dark' ? '#1E293B' : '#F1F5F9',
                      },
                    ],
                  ]}
                >
                  <View style={styles.sidebarItemContent}>
                    <View style={styles.iconContainer}>
                      <Ionicons
                        name={item.icon}
                        size={20}
                        color={Colors[colorScheme ?? 'light'].tint}
                      />
                    </View>
                    <Text
                      style={[
                        styles.sidebarItemText,
                        { color: Colors[colorScheme ?? 'light'].text },
                      ]}
                    >
                      {item.title}
                    </Text>
                  </View>
                </Pressable>
              </Link>
            ))}
          </View>
        </View>
      )}
      <View style={styles.content}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              display: isDesktop ? 'none' : 'flex',
              backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
              borderTopWidth: 0,
              height: Platform.OS === 'ios' ? 90 : 70,
              paddingTop: 12,
            },
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            tabBarInactiveTintColor: colorScheme === 'dark' ? '#666' : '#999',
            tabBarBackground: () => (
              <View
                style={{
                  flex: 1,
                  backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
                }}
              />
            ),
          }}
        >
          <Tabs.Screen
            name="(balance-page)"
            options={{
              title: 'Balances',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="pie-chart" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="(groups-page)"
            options={{
              title: 'Groups',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="people" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="add-expense"
            options={{
              title: 'Add',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="add-circle" size={size * 1.2} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="(activity-page)"
            options={{
              title: 'Activity',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="list" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="(profile-page)"
            options={{
              title: 'Profile',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person" size={size} color={color} />
              ),
            }}
          />
        </Tabs>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 280,
    paddingTop: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  logo: {
    padding: 24,
    paddingBottom: 20,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  divider: {
    height: 1,
    marginHorizontal: 24,
    marginBottom: 16,
  },
  sidebarNav: {
    paddingHorizontal: 12,
    gap: 4,
  },
  sidebarItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 2,
  },
  sidebarItemPressed: {
    opacity: 0.8,
  },
  sidebarItemHovered: {
    opacity: 1,
  },
  sidebarItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  sidebarItemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
});
