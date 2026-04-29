import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  LayoutChangeEvent,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../utils/colors';
import { FontFamily } from '../../utils/fonts';

const ITEM_HEIGHT = 40;
const LOOP_COUNT = 5;

interface CustomTimePickerProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (time: Date) => void;
  value?: string | Date; // "HH:mm" or Date
}

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  visible,
  onClose,
  onConfirm,
  value,
}) => {
  // parse time (safe for "HH:mm", Date or undefined)
  const parseTimeValue = (val?: string | Date) => {
    if (!val) {
      const now = new Date();
      // normalize to local time explicitly
      const localNow = new Date();
      const h = localNow.getHours();
      const m = localNow.getMinutes();
      const ampm = h >= 12 ? 'PM' : 'AM';
      const hour12 = h % 12 || 12;
      return {
        hour: String(hour12).padStart(2, '0'),
        minute: String(m).padStart(2, '0'),
        ampm,
      };
    }

    if (typeof val === 'string') {
      const parts = val.split(':').map(v => parseInt(v, 10));
      const hh = isNaN(parts[0]) ? 0 : parts[0];
      const mm = isNaN(parts[1]) ? 0 : parts[1];
      const ampm = hh >= 12 ? 'PM' : 'AM';
      const hour12 = hh % 12 || 12;
      return {
        hour: String(hour12).padStart(2, '0'),
        minute: String(mm).padStart(2, '0'),
        ampm,
      };
    } else {
      // Date provided — use local getters
      const h = val.getHours();
      const m = val.getMinutes();
      const ampm = h >= 12 ? 'PM' : 'AM';
      const hour12 = h % 12 || 12;
      return {
        hour: String(hour12).padStart(2, '0'),
        minute: String(m).padStart(2, '0'),
        ampm,
      };
    }
  };

  const initial = parseTimeValue(value);

  const [selectedHour, setSelectedHour] = useState(initial.hour);
  const [selectedMinute, setSelectedMinute] = useState(initial.minute);
  const [amPm, setAmPm] = useState(initial.ampm);

  const baseHours = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, '0'),
  );
  const baseMinutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, '0'),
  );

  const loopedHours = Array.from(
    { length: LOOP_COUNT },
    () => baseHours,
  ).flat();
  const loopedMinutes = Array.from(
    { length: LOOP_COUNT },
    () => baseMinutes,
  ).flat();

  const hourRef = useRef<FlatList | null>(null);
  const minuteRef = useRef<FlatList | null>(null);

  // layout flags so we only attempt scroll when both lists are rendered
  const [hourLaidOut, setHourLaidOut] = useState(false);
  const [minuteLaidOut, setMinuteLaidOut] = useState(false);

  // Update selected values whenever modal opens or value prop changes
  useEffect(() => {
    if (!visible) return;

    const parsed = parseTimeValue(value);
    setSelectedHour(parsed.hour);
    setSelectedMinute(parsed.minute);
    setAmPm(parsed.ampm);

    // reset layout flags so we re-scroll after layout
    setHourLaidOut(false);
    setMinuteLaidOut(false);
  }, [visible, value]);

  // try to scroll when both lists are laid out
  useEffect(() => {
    if (!visible) return;
    if (hourLaidOut && minuteLaidOut) {
      const parsed = parseTimeValue(value);
      // small delay to ensure content size is stable
      requestAnimationFrame(() => {
        scrollToMiddle(parsed.hour, loopedHours, baseHours, hourRef);
        scrollToMiddle(parsed.minute, loopedMinutes, baseMinutes, minuteRef);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hourLaidOut, minuteLaidOut, visible, value]);

  const onHourLayout = (_e: LayoutChangeEvent) => {
    // mark hour list ready
    setHourLaidOut(true);
  };
  const onMinuteLayout = (_e: LayoutChangeEvent) => {
    // mark minute list ready
    setMinuteLaidOut(true);
  };

  const scrollToMiddle = (
    val: string,
    loopedData: string[],
    baseData: string[],
    ref: React.RefObject<FlatList | null>,
  ) => {
    const indexInBase = baseData.indexOf(val);
    if (indexInBase === -1) return; // safety
    const midIndex =
      Math.floor(loopedData.length / 2) - Math.floor(baseData.length / 2);
    const targetIndex = midIndex + indexInBase;

    try {
      // prefer scrollToIndex if available
      ref.current?.scrollToIndex?.({
        index: targetIndex,
        animated: false,
        viewPosition: 0.5, // center it
      });
    } catch (err) {
      // fallback to offset (more tolerant)
      const offset = targetIndex * ITEM_HEIGHT;
      ref.current?.scrollToOffset?.({ offset, animated: false });
    }
  };

  const handleScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
    loopedData: string[],
    baseData: string[],
    setSelected: (v: string) => void,
    ref: React.RefObject<FlatList | null>,
  ) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const centerIndex = index + 2;
    const realItem = loopedData[centerIndex % loopedData.length];
    setSelected(realItem);

    if (
      index < baseData.length ||
      index > loopedData.length - baseData.length
    ) {
      const midIndex =
        Math.floor(loopedData.length / 2) - Math.floor(baseData.length / 2);
      ref.current?.scrollToOffset({
        offset: midIndex * ITEM_HEIGHT,
        animated: false,
      });
    }
  };

  const handleConfirm = () => {
    let h = parseInt(selectedHour, 10);
    if (amPm === 'PM' && h < 12) h += 12;
    if (amPm === 'AM' && h === 12) h = 0;

    const d = new Date();
    d.setHours(h);
    d.setMinutes(parseInt(selectedMinute, 10));
    d.setSeconds(0);

    onConfirm(d);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Select Time</Text>

          <View
            style={[
              styles.highlightLine,
              {
                top: (ITEM_HEIGHT * 5) / 2 - ITEM_HEIGHT / 2 + 63,
                height: ITEM_HEIGHT,
              },
            ]}
          />

          <View style={styles.pickerRow}>
            {/* Hours */}
            <FlatList
              ref={hourRef}
              data={loopedHours}
              keyExtractor={(_, i) => `h-${i}`}
              renderItem={({ item }) => (
                <View style={styles.option}>
                  <Text
                    style={[
                      styles.optionText,
                      item === selectedHour && styles.selectedText,
                    ]}
                  >
                    {item}
                  </Text>
                </View>
              )}
              getItemLayout={(_, i) => ({
                length: ITEM_HEIGHT,
                offset: ITEM_HEIGHT * i,
                index: i,
              })}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate="fast"
              onMomentumScrollEnd={e =>
                handleScrollEnd(
                  e,
                  loopedHours,
                  baseHours,
                  setSelectedHour,
                  hourRef,
                )
              }
              showsVerticalScrollIndicator={false}
              style={styles.list}
              onLayout={onHourLayout}
            />

            <Text style={styles.colon}>:</Text>

            {/* Minutes */}
            <FlatList
              ref={minuteRef}
              data={loopedMinutes}
              keyExtractor={(_, i) => `m-${i}`}
              renderItem={({ item }) => (
                <View style={styles.option}>
                  <Text
                    style={[
                      styles.optionText,
                      item === selectedMinute && styles.selectedText,
                    ]}
                  >
                    {item}
                  </Text>
                </View>
              )}
              getItemLayout={(_, i) => ({
                length: ITEM_HEIGHT,
                offset: ITEM_HEIGHT * i,
                index: i,
              })}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate="fast"
              onMomentumScrollEnd={e =>
                handleScrollEnd(
                  e,
                  loopedMinutes,
                  baseMinutes,
                  setSelectedMinute,
                  minuteRef,
                )
              }
              showsVerticalScrollIndicator={false}
              style={styles.list}
              onLayout={onMinuteLayout}
            />

            {/* AM/PM */}
            <View style={styles.ampmContainer}>
              {['AM', 'PM'].map(val => (
                <TouchableOpacity
                  key={val}
                  onPress={() => setAmPm(val)}
                  style={[
                    styles.ampmButton,
                    amPm === val && styles.ampmButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.ampmText,
                      amPm === val && styles.ampmTextActive,
                    ]}
                  >
                    {val}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 10,
              paddingHorizontal: 10,
            }}
          >
            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomTimePicker;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    backgroundColor: Colors.white,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 20,
    position: 'relative',
  },
  title: {
    color: Colors.header,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: FontFamily.semiBold,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  list: { height: ITEM_HEIGHT * 5 },
  option: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    color: '#aaa',
    fontSize: 20,
    fontFamily: FontFamily.regular,
  },
  selectedText: {
    color: Colors.blue,
    fontSize: 22,
    fontFamily: FontFamily.bold,
  },
  colon: {
    color: Colors.black,
    fontSize: 24,
    marginHorizontal: 8,
    fontFamily: FontFamily.regular,
  },
  highlightLine: {
    position: 'absolute',
    left: 42,
    right: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.blue,
    zIndex: 2,
    width: '70%',
    alignSelf: 'center',
  },
  ampmContainer: { marginLeft: 10 },
  ampmButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: Colors.headerGrey,
  },
  ampmButtonActive: { backgroundColor: Colors.blue, borderColor: Colors.blue },
  ampmText: {
    color: Colors.black,
    fontSize: 16,
    fontFamily: FontFamily.regular,
  },
  ampmTextActive: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FontFamily.regular,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  authBtn: {
    backgroundColor: Colors.blue,
    borderRadius: 10,
    alignItems: 'center',
    padding: 15,
  },
  authCancelBtn: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: Colors.white,
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
