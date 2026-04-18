import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Colors, Gradient } from '../../utils/colors';
import AppText from '../ui/app-text';

const DayModal = ({
  day,
  setDay,
  isDayPickerVisible,
  setDayPickerVisibility,
}: any) => {
  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  return (
    <Modal
      visible={isDayPickerVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setDayPickerVisibility(false)}
      statusBarTranslucent
    >
      <Pressable
        style={styles.modalOverlay}
        onPress={() => setDayPickerVisibility(false)}
      >
        <Pressable style={styles.modalContent}>
          <AppText font="bold" size={18} color={Colors.header} align="center">
            Select a Day
          </AppText>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ marginVertical: 10 }}
          >
            {daysOfWeek.map(d => {
              const isSelected = day === d;
              return (
                <TouchableOpacity
                  key={d}
                  activeOpacity={0.7}
                  style={[
                    styles.dayOption,
                    isSelected && styles.selectedOption,
                  ]}
                  onPress={() => {
                    setDay(d);
                    setDayPickerVisibility(false);
                  }}
                >
                  <AppText
                    align="center"
                    font={isSelected ? 'bold' : 'medium'}
                    color={isSelected ? Colors.white : Colors.header}
                  >
                    {d}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity
            style={styles.cancelDayButton}
            onPress={() => setDayPickerVisibility(false)}
          >
            <AppText font="bold" color={Colors.settingsRed}>
              Cancel
            </AppText>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default DayModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxHeight: '70%',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
  },
  dayOption: {
    paddingVertical: 10,
    borderRadius: 10,
  },
  selectedOption: {
    backgroundColor: Gradient.colors[0],
  },
  cancelDayButton: {
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.divider,
  },
});
