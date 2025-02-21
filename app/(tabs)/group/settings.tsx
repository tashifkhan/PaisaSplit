import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function GroupSettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [groupName, setGroupName] = useState('Chakna');
  const [showTripDates, setShowTripDates] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const [startDate, setStartDate] = useState('Today');
  const [endDate, setEndDate] = useState('');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.title, { color: colors.text }]}>
            Group settings
          </Text>
          <Pressable
            onPress={() => {
              // TODO: Save changes
              router.back();
            }}
          >
            <Text style={[styles.saveButton, { color: colors.tint }]}>
              Save
            </Text>
          </Pressable>
        </View>

        <View style={styles.form}>
          <View style={styles.userSection}>
            <View style={[styles.avatar, { backgroundColor: colors.tint }]}>
              <Text style={styles.avatarText}>{groupName[0]}</Text>
            </View>
          </View>

          <View
            style={[
              styles.inputGroup,
              {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7',
              },
            ]}
          >
            <Ionicons
              name="people"
              size={24}
              color={colors.text}
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Group name"
              placeholderTextColor={colorScheme === 'dark' ? '#666' : '#999'}
              style={[styles.input, { color: colors.text }]}
              value={groupName}
              onChangeText={setGroupName}
            />
          </View>

          <View style={styles.membersList}>
            <Text style={[styles.sectionLabel, { color: colors.text }]}>
              Members
            </Text>
            {[
              { email: 'nipunprakash6803@gmail.com', name: 'Nipun PRAKASH' },
              { email: 'shashwat2704@gmail.com', name: 'Shashwat Singh' },
              { email: 'tashifkhan010@gmail.com', name: 'Tashif Ahmad Khan' },
              { email: 'sanatshree1@gmail.com', name: 'sanat' },
            ].map((member, index) => (
              <View
                key={index}
                style={[
                  styles.memberItem,
                  {
                    backgroundColor:
                      colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7',
                  },
                ]}
              >
                <View style={styles.memberInfo}>
                  <Text style={[styles.memberName, { color: colors.text }]}>
                    {member.name}
                  </Text>
                  <Text
                    style={[
                      styles.memberEmail,
                      { color: colorScheme === 'dark' ? '#666' : '#999' },
                    ]}
                  >
                    {member.email}
                  </Text>
                </View>
                <Pressable>
                  <Ionicons
                    name="close-circle"
                    size={24}
                    color={colorScheme === 'dark' ? '#666' : '#999'}
                  />
                </Pressable>
              </View>
            ))}
            <Pressable
              style={[styles.addMemberButton, { borderColor: colors.tint }]}
            >
              <Ionicons name="add" size={24} color={colors.tint} />
              <Text style={[styles.addMemberText, { color: colors.tint }]}>
                Add member
              </Text>
            </Pressable>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Add settle up reminders
              </Text>
              <Text style={[styles.settingDescription, { color: colors.text }]}>
                When on, PaisaSplit will remind group members to settle up.
              </Text>
            </View>
            <Pressable
              style={[styles.toggle, showReminders && styles.toggleOn]}
              onPress={() => setShowReminders(!showReminders)}
            >
              <View
                style={[
                  styles.toggleHandle,
                  showReminders && styles.toggleHandleOn,
                ]}
              />
            </Pressable>
          </View>

          <View style={styles.dangerZone}>
            <Text style={[styles.dangerTitle, { color: colors.negative }]}>
              Danger Zone
            </Text>
            <Pressable
              style={[styles.deleteButton, { borderColor: colors.negative }]}
            >
              <Text
                style={[styles.deleteButtonText, { color: colors.negative }]}
              >
                Delete group
              </Text>
            </Pressable>
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  cancelButton: {
    fontSize: 17,
  },
  saveButton: {
    fontSize: 17,
    fontWeight: '600',
  },
  form: {
    padding: 16,
    gap: 24,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    alignSelf: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 32,
    fontWeight: '600',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 17,
    padding: 0,
  },
  membersList: {
    gap: 12,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    justifyContent: 'space-between',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 17,
    fontWeight: '500',
    marginBottom: 4,
  },
  memberEmail: {
    fontSize: 15,
  },
  addMemberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    gap: 8,
  },
  addMemberText: {
    fontSize: 17,
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  settingLabelContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    opacity: 0.7,
  },
  toggle: {
    width: 51,
    height: 31,
    borderRadius: 15.5,
    backgroundColor: '#E9E9EA',
    padding: 2,
  },
  toggleOn: {
    backgroundColor: '#2CC2BA',
  },
  toggleHandle: {
    width: 27,
    height: 27,
    borderRadius: 13.5,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  toggleHandleOn: {
    transform: [{ translateX: 20 }],
  },
  dangerZone: {
    gap: 12,
  },
  dangerTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 17,
    fontWeight: '600',
  },
});
