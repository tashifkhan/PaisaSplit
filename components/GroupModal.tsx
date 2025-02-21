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

interface GroupModalProps {
  onClose: () => void;
}

export default function GroupModal({ onClose }: GroupModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [groupName, setGroupName] = useState('');
  const [selectedType, setSelectedType] = useState('home');
  const [showTripDates, setShowTripDates] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const [startDate, setStartDate] = useState('Today');
  const [endDate, setEndDate] = useState('');
  const [customTypeName, setCustomTypeName] = useState('');
  const [customTypeIcon, setCustomTypeIcon] =
    useState<keyof typeof Ionicons.glyphMap>('add');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable onPress={onClose}>
          <Text style={[styles.cancelButton, { color: colors.tint }]}>
            Cancel
          </Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>New Group</Text>
        <Pressable>
          <Text style={[styles.saveButton, { color: colors.tint }]}>
            Create
          </Text>
        </Pressable>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          <View style={styles.userSection}>
            <View style={[styles.avatar, { backgroundColor: colors.tint }]}>
              <Text style={styles.avatarText}>
                {groupName ? groupName[0] : '?'}
              </Text>
            </View>
            <Text style={[styles.addFriends, { color: colors.tint }]}>
              Add friends
            </Text>
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

          <Text style={[styles.sectionLabel, { color: colors.text }]}>
            Type
          </Text>
          <View style={styles.typeContainer}>
            {[
              { id: 'trip', icon: 'airplane', label: 'Trip' },
              { id: 'home', icon: 'home', label: 'Home' },
              { id: 'couple', icon: 'heart', label: 'Couple' },
              { id: 'custom', icon: 'add', label: '' },
            ].map((type) => (
              <Pressable
                key={type.id}
                style={[
                  styles.typeButton,
                  selectedType === type.id && styles.selectedType,
                  !type.label && { flex: 0.4, paddingRight: 4 },
                ]}
                onPress={() => setSelectedType(type.id)}
              >
                <Ionicons
                  name={type.icon as any}
                  size={24}
                  color={selectedType === type.id ? 'white' : colors.text}
                />
                <Text
                  style={[
                    styles.typeLabel,
                    { color: selectedType === type.id ? 'white' : colors.text },
                  ]}
                >
                  {type.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {selectedType === 'custom' && (
            <View style={styles.customTypeContainer}>
              <View
                style={[
                  styles.inputGroup,
                  {
                    backgroundColor:
                      colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7',
                  },
                ]}
              >
                <Ionicons
                  name={customTypeIcon}
                  size={24}
                  color={colors.text}
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Type name"
                  placeholderTextColor={
                    colorScheme === 'dark' ? '#666' : '#999'
                  }
                  style={[styles.input, { color: colors.text }]}
                  value={customTypeName}
                  onChangeText={setCustomTypeName}
                />
              </View>

              <View style={styles.iconSelector}>
                {[
                  'airplane',
                  'home',
                  'heart',
                  'business',
                  'car',
                  'restaurant',
                  'game-controller',
                  'gift',
                ].map((icon) => (
                  <Pressable
                    key={icon}
                    style={[
                      styles.iconButton,
                      customTypeIcon === icon && styles.selectedIcon,
                    ]}
                    onPress={() =>
                      setCustomTypeIcon(icon as keyof typeof Ionicons.glyphMap)
                    }
                  >
                    <Ionicons
                      name={icon as any}
                      size={24}
                      color={customTypeIcon === icon ? 'white' : colors.text}
                    />
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {selectedType === 'trip' && (
            <View style={styles.settingRow}>
              <View style={styles.settingLabelContainer}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  Add trip dates
                </Text>
                <Text
                  style={[styles.settingDescription, { color: colors.text }]}
                >
                  PaisaSplit will remind friends to join, add expenses, and
                  settle up.
                </Text>
              </View>
              <Pressable
                style={[styles.toggle, showTripDates && styles.toggleOn]}
                onPress={() => setShowTripDates(!showTripDates)}
              >
                <View
                  style={[
                    styles.toggleHandle,
                    showTripDates && styles.toggleHandleOn,
                  ]}
                />
              </Pressable>
            </View>
          )}

          {selectedType === 'trip' && showTripDates && (
            <View style={styles.dateContainer}>
              <View style={styles.dateField}>
                <Text style={[styles.dateLabel, { color: colors.text }]}>
                  Start
                </Text>
                <Pressable
                  style={[
                    styles.dateInput,
                    {
                      backgroundColor:
                        colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7',
                    },
                  ]}
                >
                  <Text style={[styles.dateText, { color: colors.text }]}>
                    {startDate}
                  </Text>
                  <Ionicons name="calendar" size={24} color={colors.text} />
                </Pressable>
              </View>
              <View style={styles.dateField}>
                <Text style={[styles.dateLabel, { color: colors.text }]}>
                  End
                </Text>
                <Pressable
                  style={[
                    styles.dateInput,
                    {
                      backgroundColor:
                        colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7',
                    },
                  ]}
                >
                  <Text style={[styles.dateText, { color: colors.text }]}>
                    {endDate || 'Select date'}
                  </Text>
                  <Ionicons name="calendar" size={24} color={colors.text} />
                </Pressable>
              </View>
            </View>
          )}

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
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
  addFriends: {
    fontSize: 17,
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
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    gap: 4,
  },
  selectedType: {
    backgroundColor: '#2CC2BA',
    borderColor: '#2CC2BA',
  },
  typeLabel: {
    fontSize: 15,
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
  dateContainer: {
    gap: 16,
  },
  dateField: {
    gap: 8,
  },
  dateLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 10,
  },
  dateText: {
    fontSize: 15,
  },
  customTypeContainer: {
    gap: 16,
  },
  iconSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedIcon: {
    backgroundColor: '#2CC2BA',
    borderColor: '#2CC2BA',
  },
});
