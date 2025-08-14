import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  TextInputProps,
} from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useState } from 'react';

interface GroupModalProps {
  onClose: () => void;
}

// Sub-component: FormInputGroup
interface FormInputGroupProps extends TextInputProps {
  iconName: keyof typeof Ionicons.glyphMap;
  colors: typeof Colors.light | typeof Colors.dark;
  colorScheme: 'light' | 'dark' | null | undefined;
}

function FormInputGroup({
  iconName,
  colors,
  colorScheme,
  style,
  ...rest
}: FormInputGroupProps) {
  return (
    <View
      style={[
        styles.inputGroup,
        {
          backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7',
        },
      ]}
    >
      <Ionicons
        name={iconName}
        size={24}
        color={colors.text}
        style={styles.inputIcon}
      />
      <TextInput
        placeholderTextColor={colorScheme === 'dark' ? '#666' : '#999'}
        style={[styles.input, { color: colors.text }, style]}
        {...rest}
      />
    </View>
  );
}

// Sub-component: GroupTypeSelector
interface GroupTypeButtonProps {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}

interface GroupTypeSelectorProps {
  types: GroupTypeButtonProps[];
  selectedType: string;
  onSelectType: (typeId: string) => void;
  colors: typeof Colors.light | typeof Colors.dark;
}

function GroupTypeSelector({
  types,
  selectedType,
  onSelectType,
  colors,
}: GroupTypeSelectorProps) {
  return (
    <View style={styles.typeContainer}>
      {types.map((type) => (
        <Pressable
          key={type.id}
          style={[
            styles.typeButton,
            { borderColor: colors.textMuted },
            selectedType === type.id && styles.selectedType,
            !type.label && { flex: 0.4, paddingRight: 4 },
          ]}
          onPress={() => onSelectType(type.id)}
        >
          <Ionicons
            name={type.icon}
            size={24}
            color={selectedType === type.id ? 'white' : colors.text}
          />
          {type.label ? (
            <Text
              style={[
                styles.typeLabel,
                { color: selectedType === type.id ? 'white' : colors.text },
              ]}
            >
              {type.label}
            </Text>
          ) : null}
        </Pressable>
      ))}
    </View>
  );
}

// Sub-component: IconSelector
interface IconSelectorProps {
  icons: (keyof typeof Ionicons.glyphMap)[];
  selectedIcon: keyof typeof Ionicons.glyphMap;
  onSelectIcon: (iconName: keyof typeof Ionicons.glyphMap) => void;
  colors: typeof Colors.light | typeof Colors.dark;
}

function IconSelector({
  icons,
  selectedIcon,
  onSelectIcon,
  colors,
}: IconSelectorProps) {
  return (
    <View style={styles.iconSelector}>
      {icons.map((icon) => (
        <Pressable
          key={icon}
          style={[
            styles.iconButton,
            { borderColor: colors.textMuted },
            selectedIcon === icon && styles.selectedIcon,
          ]}
          onPress={() => onSelectIcon(icon)}
        >
          <Ionicons
            name={icon}
            size={24}
            color={selectedIcon === icon ? 'white' : colors.text}
          />
        </Pressable>
      ))}
    </View>
  );
}

// Sub-component: SettingsToggleRow
interface SettingsToggleRowProps {
  label: string;
  description: string;
  isOn: boolean;
  onToggle: () => void;
  colors: typeof Colors.light | typeof Colors.dark;
}

function SettingsToggleRow({
  label,
  description,
  isOn,
  onToggle,
  colors,
}: SettingsToggleRowProps) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingLabelContainer}>
        <Text style={[styles.settingLabel, { color: colors.text }]}>
          {label}
        </Text>
        <Text style={[styles.settingDescription, { color: colors.textMuted }]}>
          {description}
        </Text>
      </View>
      <Pressable
        style={[styles.toggle, isOn && styles.toggleOn]}
        onPress={onToggle}
      >
        <View style={[styles.toggleHandle, isOn && styles.toggleHandleOn]} />
      </Pressable>
    </View>
  );
}

// Sub-component: DateInput
interface DateInputProps {
  label: string;
  value: string;
  onPress: () => void;
  colors: typeof Colors.light | typeof Colors.dark;
  colorScheme: 'light' | 'dark' | null | undefined;
}

function DateInput({
  label,
  value,
  onPress,
  colors,
  colorScheme,
}: DateInputProps) {
  return (
    <View style={styles.dateField}>
      <Text style={[styles.dateLabel, { color: colors.text }]}>{label}</Text>
      <Pressable
        style={[
          styles.dateInput,
          {
            backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7',
          },
        ]}
        onPress={onPress}
      >
        <Text style={[styles.dateText, { color: colors.text }]}>{value}</Text>
        <Ionicons name="calendar" size={24} color={colors.text} />
      </Pressable>
    </View>
  );
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

  const groupTypes: GroupTypeButtonProps[] = [
    { id: 'trip', icon: 'airplane', label: 'Trip' },
    { id: 'home', icon: 'home', label: 'Home' },
    { id: 'couple', icon: 'heart', label: 'Couple' },
    { id: 'custom', icon: 'add', label: '' },
  ];

  const customTypeIcons: (keyof typeof Ionicons.glyphMap)[] = [
    'airplane',
    'home',
    'heart',
    'business',
    'car',
    'restaurant',
    'game-controller',
    'gift',
  ];

  // Dummy onPress handlers for date inputs
  const handleStartDatePress = () => console.log('Start Date Pressed');
  const handleEndDatePress = () => console.log('End Date Pressed');

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
                {groupName ? groupName[0].toUpperCase() : '?'}
              </Text>
            </View>
            <Text style={[styles.addFriends, { color: colors.tint }]}>
              Add friends
            </Text>
          </View>

          <FormInputGroup
            iconName="people"
            colors={colors}
            colorScheme={colorScheme}
            placeholder="Group name"
            value={groupName}
            onChangeText={setGroupName}
          />

          <Text style={[styles.sectionLabel, { color: colors.text }]}>
            Type
          </Text>
          <GroupTypeSelector
            types={groupTypes}
            selectedType={selectedType}
            onSelectType={setSelectedType}
            colors={colors}
          />

          {selectedType === 'custom' && (
            <View style={styles.customTypeContainer}>
              <FormInputGroup
                iconName={customTypeIcon}
                colors={colors}
                colorScheme={colorScheme}
                placeholder="Type name"
                value={customTypeName}
                onChangeText={setCustomTypeName}
              />
              <IconSelector
                icons={customTypeIcons}
                selectedIcon={customTypeIcon}
                onSelectIcon={setCustomTypeIcon}
                colors={colors}
              />
            </View>
          )}

          {selectedType === 'trip' && (
            <SettingsToggleRow
              label="Add trip dates"
              description="PaisaSplit will remind friends to join, add expenses, and settle up."
              isOn={showTripDates}
              onToggle={() => setShowTripDates(!showTripDates)}
              colors={colors}
            />
          )}

          {selectedType === 'trip' && showTripDates && (
            <View style={styles.dateContainer}>
              <DateInput
                label="Start"
                value={startDate}
                onPress={handleStartDatePress}
                colors={colors}
                colorScheme={colorScheme}
              />
              <DateInput
                label="End"
                value={endDate || 'Select date'}
                onPress={handleEndDatePress}
                colors={colors}
                colorScheme={colorScheme}
              />
            </View>
          )}

          <SettingsToggleRow
            label="Add settle up reminders"
            description="When on, PaisaSplit will remind group members to settle up."
            isOn={showReminders}
            onToggle={() => setShowReminders(!showReminders)}
            colors={colors}
          />
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
    paddingTop: 60, // Consider using SafeAreaView or equivalent for status bar height
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
    padding: 0, // Ensure no extra padding inside TextInput
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    // marginBottom: 8, // Removed as gap in form handles spacing
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
    paddingVertical: 12,
    paddingHorizontal: 8, // Adjusted for better spacing with icon
    borderRadius: 20,
    borderWidth: 1.5, // Made slightly thicker for better visibility
    // borderColor: "#ccc", // Will be set by colors prop
    gap: 6, // Increased gap
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
    // opacity: 0.7, // Will be set by colors.textMuted
    lineHeight: 18, // Improved readability
  },
  toggle: {
    width: 51,
    height: 31,
    borderRadius: 15.5,
    backgroundColor: '#E9E9EA', // Default off state
    justifyContent: 'center', // Center the handle
    padding: 2, // Padding for the handle to move within
  },
  toggleOn: {
    backgroundColor: '#2CC2BA', // Active state color
  },
  toggleHandle: {
    width: 27,
    height: 27,
    borderRadius: 13.5,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, // Adjusted shadow
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2, // For Android shadow
  },
  toggleHandleOn: {
    transform: [{ translateX: 20 }], // Move handle to the right when on
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
    justifyContent: 'flex-start', // Align items to start
  },
  iconButton: {
    width: 48, // Standardized size
    height: 48,
    borderRadius: 24, // Make it circular
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    // borderColor: "#ccc", // Will be set by colors prop
  },
  selectedIcon: {
    backgroundColor: '#2CC2BA',
    borderColor: '#2CC2BA',
  },
});
