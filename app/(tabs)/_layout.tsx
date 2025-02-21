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
              backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
              borderRightColor: colorScheme === 'dark' ? '#222' : '#eee',
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
          <View style={styles.sidebarNav}>
            {[
              { name: '', title: 'Balances', icon: 'pie-chart' },
              { name: 'groups', title: 'Groups', icon: 'people' },
              { name: 'add-expense', title: 'Add', icon: 'add-circle' },
              { name: 'activity', title: 'Activity', icon: 'list' },
              { name: 'profile', title: 'Profile', icon: 'person' },
            ].map((item) => (
              <Link href={`/(tabs)/${item.name}`} key={item.name} asChild>
                <Pressable
                  style={({ pressed }) => [
                    styles.sidebarItem,
                    pressed && [
                      styles.sidebarItemPressed,
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
          }}
          sceneContainerStyle={{
            backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Balances',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="pie-chart" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="groups"
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
            name="activity"
            options={{
              title: 'Activity',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="list" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="group/[id]"
            options={{
              href: null,
              tabBarStyle: { display: 'none' },
            }}
          />
          <Tabs.Screen
            name="group/settings"
            options={{
              href: null,
              tabBarStyle: { display: 'none' },
            }}
          />
          <Tabs.Screen
            name="user/[id]"
            options={{
              href: null,
              tabBarStyle: { display: 'none' },
            }}
          />
          <Tabs.Screen
            name="activity/[id]"
            options={{
              href: null,
              tabBarStyle: { display: 'none' },
            }}
          />
          <Tabs.Screen
            name="user/transaction/[id]"
            options={{
              href: null,
              tabBarStyle: { display: 'none' },
            }}
          />
          <Tabs.Screen
            name="group/transaction/[id]"
            options={{
              href: null,
              tabBarStyle: { display: 'none' },
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
    width: 240,
    paddingTop: 40,
  },
  content: {
    flex: 1,
  },
  logo: {
    padding: 20,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sidebarNav: {
    paddingHorizontal: 16,
    gap: 8,
  },
  sidebarItem: {
    padding: 8,
    opacity: 0.7,
  },
  sidebarItemPressed: {
    opacity: 0.7,
  },
  sidebarItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidebarItemText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
});
