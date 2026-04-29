import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Colors } from '../../utils/colors';
import { FontFamily } from '../../utils/fonts';
import CustomTimePicker from './CustomTimePicker';

interface CommonDatePickerProps extends TouchableOpacityProps {
  value?: string | Date | undefined;
  onDateChange?: (date: Date) => void;
  mode?: 'date' | 'time';
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  textStyle?: TextStyle;
  iconColor?: string;
  iconSize?: number;
  customStyle?: object;
  disabled?: boolean;
}

const CustomDatePicker: React.FC<CommonDatePickerProps> = ({
  value,
  onDateChange,
  mode = 'date',
  placeholder = 'Select date',
  minimumDate,
  maximumDate,
  containerStyle,
  textStyle,
  iconColor = Colors.blue,
  iconSize = 22,
  customStyle,
  disabled,
  ...props
}) => {
  const today = new Date().toISOString().split('T')[0];
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<String | any>(null);
  const isDate = value ? String(value)?.split('T')[0] : today;

  const formatDate = (date: any) => {
    if (!date) return placeholder;

    let d: Date;

    if (date instanceof Date) {
      d = date;
    } else if (typeof date === 'string') {
      if (/^\d{1,2}:\d{2}$/.test(date)) {
        const [hours, minutes] = date.split(':').map(Number);
        d = new Date();
        d.setHours(hours || 0, minutes || 0, 0, 0);
      } else {
        d = new Date(date);
      }
    } else {
      return placeholder;
    }

    if (mode === 'date') {
      return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(
        d.getDate(),
      ).padStart(2, '0')}/${d.getFullYear()}`;
    } else {
      const hours = d.getHours();
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const h12 = hours % 12 || 12;
      return `${h12}:${minutes} ${ampm}`;
    }
  };

  const handleDateConfirm = (date: any) => {
    setShowTimePicker(false);
    if (onDateChange) {
      onDateChange(date);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        disabled={disabled}
        onPress={() =>
          mode === 'date' ? setShowCalendar(true) : setShowTimePicker(true)
        }
        style={[styles.inputStyle, customStyle]}
        {...props}
      >
        {mode === 'time' ? (
          <Clock size={iconSize} color={iconColor} />
        ) : (
          <CalendarDays size={iconSize} color={iconColor} />
        )}
        <Text
          style={[styles.textStyle, textStyle]}
          numberOfLines={1}
          adjustsFontSizeToFit={true}
        >
          {formatDate(value) || placeholder}
        </Text>
      </TouchableOpacity>

      {/* 📅 Calendar for Single Date */}
      <Modal
        visible={showCalendar}
        onRequestClose={() => setShowCalendar(false)}
        transparent
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.calendarContainer}>
            <Calendar
              onDayPress={day => {
                setSelectedDate(day.dateString);
                onDateChange?.(new Date(day.dateString));
              }}
              current={isDate ? isDate : today}
              minDate={minimumDate?.toISOString()}
              maxDate={maximumDate?.toISOString()}
              enableSwipeMonths
              markingType={'custom'}
              markedDates={{
                [isDate]: {
                  selected: true,
                  customStyles: {
                    container: {
                      backgroundColor: Colors.blue,
                      borderRadius: 360,
                    },
                    text: {
                      color: '#fff',
                      fontFamily: FontFamily.medium,
                    },
                  },
                },
                [selectedDate]: {
                  selected: true,
                  customStyles: {
                    container: {
                      backgroundColor: Colors.blue,
                      borderRadius: 360,
                    },
                    text: {
                      color: '#fff',
                      fontFamily: FontFamily.medium,
                    },
                  },
                },
              }}
              theme={{
                backgroundColor: Colors.white,
                calendarBackground: Colors.white,
                dayTextColor: Colors.header,
                todayTextColor: Colors.blue,
                selectedDayBackgroundColor: Colors.blue,
                monthTextColor: Colors.header,
                textMonthFontSize: 18,
                textMonthFontWeight: '700',
                textDayFontSize: 16,
                textDayFontWeight: '600',
                textDisabledColor: Colors.headerGrey,
              }}
              renderArrow={direction => (
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  {direction === 'left' ? (
                    <ChevronLeft size={25} color={Colors.header} />
                  ) : (
                    <ChevronRight size={25} color={Colors.header} />
                  )}
                </View>
              )}
            />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 10,
                paddingHorizontal: 10,
              }}
            >
              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={() => {
                  setSelectedDate(new Date(isDate));
                  onDateChange?.(new Date(isDate));
                  setShowCalendar(false);
                }}
              >
                <Text style={styles.confirmText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setSelectedDate(null);
                  setShowCalendar(false);
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ⏰ Time Picker */}

      <CustomTimePicker
        visible={showTimePicker}
        onClose={() => setShowTimePicker(false)}
        onConfirm={handleDateConfirm}
        value={value}
      />
    </View>
  );
};

export default CustomDatePicker;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputStyle: {
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  textStyle: {
    color: Colors.blue,
    fontFamily: FontFamily.medium,
    width: '80%',
    textAlign: 'center',
    fontSize: 15,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  calendarContainer: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingVertical: 10,
    paddingBottom: 20,
  },
  closeButton: {
    marginTop: 10,
    alignSelf: 'center',
    backgroundColor: Colors.blue,
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 8,
  },
  authBtn: {
    backgroundColor: Colors.blue,
    borderRadius: 10,
    alignItems: 'center',
    padding: 15,
    marginTop: 0,
  },
  authCancelBtn: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#fff',
    marginTop: 0,
  },
  confirmBtn: {
    backgroundColor: Colors.blue,
    borderRadius: 10,
    alignItems: 'center',
    padding: 15,
    marginTop: 0,
    width: '48%',
  },
  confirmText: {
    color: Colors.white,
    fontFamily: FontFamily.bold,
  },
  cancelBtn: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    alignItems: 'center',
    padding: 15,
    marginTop: 0,
    borderWidth: 1.5,
    borderColor: Colors.blue,
    width: '48%',
  },
  cancelText: {
    color: Colors.header,
    fontFamily: FontFamily.bold,
  },
});
