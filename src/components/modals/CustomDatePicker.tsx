import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Colors } from '../../utils/colors';
import { FontFamily } from '../../utils/fonts';
import BottomSheetModal from '../bottom-sheet-modal';
import CustomTimePicker from './CustomTimePicker';

/** Calendar YYYY-MM-DD in the device local timezone (not UTC). */
function localYmdFromDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Parse a calendar day string from react-native-calendars as a local Date.
 * Avoids `new Date('YYYY-MM-DD')` (UTC) which shifts the day in many zones.
 * Noon reduces DST boundary issues around midnight.
 */
function localDateFromYmd(dateString: string): Date {
  const [y, m, d] = dateString.split('-').map(Number);
  if (!y || !m || !d) return new Date(NaN);
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}

function ymdFromValue(
  value: CommonDatePickerProps['value'],
  fallbackYmd: string,
): string {
  if (value == null) return fallbackYmd;
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? fallbackYmd : localYmdFromDate(value);
  }
  if (typeof value === 'string') {
    if (/^\d{1,2}:\d{2}$/.test(value)) return fallbackYmd;
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? fallbackYmd : localYmdFromDate(parsed);
  }
  return fallbackYmd;
}

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
  const todayYmd = localYmdFromDate(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<String | any>(null);
  const isDate = ymdFromValue(value, todayYmd);

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

      <BottomSheetModal
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
        sheetStyle={{ paddingHorizontal: 0 }}
      >
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={day => {
              setSelectedDate(day.dateString);
              onDateChange?.(localDateFromYmd(day.dateString));
            }}
            current={isDate || todayYmd}
            minDate={minimumDate ? localYmdFromDate(minimumDate) : undefined}
            maxDate={maximumDate ? localYmdFromDate(maximumDate) : undefined}
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
                const ymd =
                  typeof selectedDate === 'string' ? selectedDate : isDate;
                const confirmed = localDateFromYmd(ymd);
                setSelectedDate(ymd);
                onDateChange?.(confirmed);
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
      </BottomSheetModal>

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
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  calendarContainer: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 12,
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
