import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../utils/colors';
import { FontFamily } from '../../utils/fonts';

const ITEM_HEIGHT = 44;
const VISIBLE_ROWS = 5;
const WHEEL_HEIGHT = ITEM_HEIGHT * VISIBLE_ROWS;
/** Vertical padding so first/last items can scroll to the center line (iOS wheel). */
const WHEEL_PAD = ((VISIBLE_ROWS - 1) / 2) * ITEM_HEIGHT;
const LOOP_COUNT = 5;
const AMPM_ITEMS: ('AM' | 'PM')[] = ['AM', 'PM'];

const IS_ANDROID = Platform.OS === 'android';

const IOS_WHEEL_SNAP = {
  snapToInterval: ITEM_HEIGHT,
  snapToAlignment: 'start' as const,
  disableIntervalMomentum: true,
};

const WHEEL_DECELERATION = IS_ANDROID ? ('fast' as const) : ('normal' as const);

const SNAP_LOCK_MS = 140;

const lockSnap = (
  locks: React.MutableRefObject<Record<string, number>>,
  key: string,
): boolean => {
  const t = Date.now();
  if (t - (locks.current[key] ?? 0) < SNAP_LOCK_MS) return false;
  locks.current[key] = t;
  return true;
};

const coerceScrollEvent = (
  y: number,
): NativeSyntheticEvent<NativeScrollEvent> =>
  ({
    nativeEvent: {
      contentOffset: { x: 0, y },
      layoutMeasurement: { height: WHEEL_HEIGHT, width: 0 },
      contentSize: { height: 0, width: 0 },
    },
  } as NativeSyntheticEvent<NativeScrollEvent>);

interface CustomTimePickerProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (time: Date) => void;
  value?: string | Date;
}

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  visible,
  onClose,
  onConfirm,
  value,
}) => {
  const parseTimeValue = (val?: string | Date) => {
    if (!val) {
      const localNow = new Date();
      const h = localNow.getHours();
      const m = localNow.getMinutes();
      const ampm = h >= 12 ? 'PM' : 'AM';
      const hour12 = h % 12 || 12;
      return {
        hour: String(hour12),
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
        hour: String(hour12),
        minute: String(mm).padStart(2, '0'),
        ampm,
      };
    } else {
      const h = val.getHours();
      const m = val.getMinutes();
      const ampm = h >= 12 ? 'PM' : 'AM';
      const hour12 = h % 12 || 12;
      return {
        hour: String(hour12),
        minute: String(m).padStart(2, '0'),
        ampm,
      };
    }
  };

  const initial = parseTimeValue(value);

  const [selectedHour, setSelectedHour] = useState(initial.hour);
  const [selectedMinute, setSelectedMinute] = useState(initial.minute);
  const [amPm, setAmPm] = useState(initial.ampm);

  const baseHours = Array.from({ length: 12 }, (_, i) => String(i + 1));
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
  const ampmRef = useRef<FlatList | null>(null);

  const [hourLaidOut, setHourLaidOut] = useState(false);
  const [minuteLaidOut, setMinuteLaidOut] = useState(false);
  const [ampmLaidOut, setAmpmLaidOut] = useState(false);

  const [hourScrollY, setHourScrollY] = useState(0);
  const [minuteScrollY, setMinuteScrollY] = useState(0);
  const [ampmScrollY, setAmpmScrollY] = useState(0);

  const hourOffsetRef = useRef(0);
  const minuteOffsetRef = useRef(0);
  const ampmOffsetRef = useRef(0);

  const snapLocks = useRef<Record<string, number>>({});

  const shouldDeferSnapToMomentum = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const vy = e.nativeEvent.velocity?.y ?? 0;
      return Math.abs(vy) > 0.3;
    },
    [],
  );

  useEffect(() => {
    if (!visible) return;

    const parsed = parseTimeValue(value);
    setSelectedHour(parsed.hour);
    setSelectedMinute(parsed.minute);
    setAmPm(parsed.ampm);

    setHourLaidOut(false);
    setMinuteLaidOut(false);
    setAmpmLaidOut(false);
  }, [visible, value]);

  const scrollColumnToValue = (
    indexInBase: number,
    loopedLen: number,
    baseLen: number,
    ref: React.RefObject<FlatList | null>,
  ) => {
    if (indexInBase < 0) return;
    const midBlock = Math.floor(loopedLen / 2) - Math.floor(baseLen / 2);
    const targetIndex = midBlock + indexInBase;
    const offset = targetIndex * ITEM_HEIGHT;
    ref.current?.scrollToOffset?.({ offset, animated: false });
  };

  const snapColumn = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
    lockKey: string,
    loopedData: readonly string[],
    baseLen: number,
    setSelected: (v: string) => void,
    ref: React.RefObject<FlatList | null>,
    toBaseIndex: (item: string) => number,
  ) => {
    if (!lockSnap(snapLocks, lockKey)) return;

    const y = e.nativeEvent.contentOffset.y;
    let index = Math.round(y / ITEM_HEIGHT);
    index = Math.max(0, Math.min(index, loopedData.length - 1));
    const item = loopedData[index];

    const midBlock =
      Math.floor(loopedData.length / 2) - Math.floor(baseLen / 2);
    let targetIndex = index;
    if (index < baseLen || index >= loopedData.length - baseLen) {
      const newIdx = midBlock + toBaseIndex(item);
      targetIndex = Math.max(0, Math.min(newIdx, loopedData.length - 1));
    }
    const finalOffset = targetIndex * ITEM_HEIGHT;
    const animateSnap = Platform.OS === 'ios';
    ref.current?.scrollToOffset({
      offset: finalOffset,
      animated: animateSnap,
    });
    setSelected(item);
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

  const centerDistance = useCallback((index: number, scrollY: number) => {
    const itemCenter = WHEEL_PAD + index * ITEM_HEIGHT + ITEM_HEIGHT / 2;
    const viewportCenter = scrollY + WHEEL_HEIGHT / 2;
    return Math.abs(itemCenter - viewportCenter) / ITEM_HEIGHT;
  }, []);

  const renderWheelItem = useCallback(
    (
      item: string,
      index: number,
      scrollY: number,
      selected: string,
      monospace: boolean,
    ) => {
      if (IS_ANDROID) {
        const isSel = item === selected;
        return (
          <View style={[styles.wheelItem, { height: ITEM_HEIGHT }]}>
            <Text
              style={[
                styles.wheelItemText,
                monospace && styles.wheelItemTextMono,
                !isSel && styles.wheelItemTextDim,
                isSel && styles.wheelItemTextCenter,
              ]}
              numberOfLines={1}
            >
              {item}
            </Text>
          </View>
        );
      }

      const dist = centerDistance(index, scrollY);
      const opacity = Math.max(0.28, 1 - dist * 0.34);
      const scale = Math.max(0.86, 1 - Math.min(dist, 2.8) * 0.065);
      const isCenter = dist < 0.45;

      return (
        <View style={[styles.wheelItem, { height: ITEM_HEIGHT }]}>
          <Text
            style={[
              styles.wheelItemText,
              monospace && styles.wheelItemTextMono,
              {
                opacity,
                transform: [{ scale }],
              },
              isCenter && styles.wheelItemTextCenter,
            ]}
            numberOfLines={1}
          >
            {item}
          </Text>
        </View>
      );
    },
    [centerDistance],
  );

  const initScrollIndices = useCallback(() => {
    const p = parseTimeValue(value);
    const hourIdx = (() => {
      const n = parseInt(p.hour, 10);
      if (n >= 1 && n <= 12) return n - 1;
      return 0;
    })();
    const minuteIdx = Math.max(0, baseMinutes.indexOf(p.minute));
    scrollColumnToValue(hourIdx, loopedHours.length, baseHours.length, hourRef);
    scrollColumnToValue(
      minuteIdx,
      loopedMinutes.length,
      baseMinutes.length,
      minuteRef,
    );
    scrollColumnToValue(
      p.ampm === 'PM' ? 1 : 0,
      AMPM_ITEMS.length,
      AMPM_ITEMS.length,
      ampmRef,
    );

    const hourMid =
      Math.floor(loopedHours.length / 2) - Math.floor(baseHours.length / 2);
    hourOffsetRef.current = (hourMid + hourIdx) * ITEM_HEIGHT;
    const minuteMid =
      Math.floor(loopedMinutes.length / 2) - Math.floor(baseMinutes.length / 2);
    minuteOffsetRef.current = (minuteMid + minuteIdx) * ITEM_HEIGHT;
    ampmOffsetRef.current = (p.ampm === 'PM' ? 1 : 0) * ITEM_HEIGHT;
  }, [value, loopedHours.length, loopedMinutes.length]);

  const snapAmpmColumn = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!lockSnap(snapLocks, 'ampm')) return;
      const y = e.nativeEvent.contentOffset.y;
      let index = Math.round(y / ITEM_HEIGHT);
      index = Math.max(0, Math.min(index, AMPM_ITEMS.length - 1));
      const snapped = index * ITEM_HEIGHT;
      ampmRef.current?.scrollToOffset({
        offset: snapped,
        animated: Platform.OS === 'ios',
      });
      setAmPm(AMPM_ITEMS[index]);
    },
    [],
  );

  useEffect(() => {
    if (!visible) return;
    if (!(hourLaidOut && minuteLaidOut && ampmLaidOut)) return;
    requestAnimationFrame(() => initScrollIndices());
  }, [visible, hourLaidOut, minuteLaidOut, ampmLaidOut, initScrollIndices]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Select Time</Text>

          <View style={styles.wheelFrame}>
            <View
              pointerEvents="none"
              style={[
                styles.selectionRails,
                { top: WHEEL_PAD, height: ITEM_HEIGHT },
              ]}
            >
              <View style={styles.selectionLine} />
              <View style={styles.selectionLine} />
            </View>

            <View style={styles.pickerRow}>
              <View style={styles.wheelColumn}>
                <FlatList
                  ref={hourRef}
                  data={loopedHours}
                  keyExtractor={(_, i) => `h-${i}`}
                  renderItem={({ item, index }) =>
                    renderWheelItem(
                      item,
                      index,
                      hourScrollY,
                      selectedHour,
                      false,
                    )
                  }
                  getItemLayout={(_, i) => ({
                    length: ITEM_HEIGHT,
                    offset: ITEM_HEIGHT * i,
                    index: i,
                  })}
                  contentContainerStyle={styles.wheelContent}
                  // {...(IS_ANDROID ? {} : IOS_WHEEL_SNAP)}
                  decelerationRate={WHEEL_DECELERATION}
                  removeClippedSubviews={false}
                  bounces={false}
                  overScrollMode="never"
                  nestedScrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                  style={styles.wheelList}
                  onLayout={() => setHourLaidOut(true)}
                  onScroll={(ev: NativeSyntheticEvent<NativeScrollEvent>) => {
                    const y = ev.nativeEvent.contentOffset.y;
                    if (IS_ANDROID) {
                      hourOffsetRef.current = y;
                    } else {
                      setHourScrollY(y);
                    }
                  }}
                  scrollEventThrottle={16}
                  onMomentumScrollEnd={e =>
                    snapColumn(
                      e,
                      'hour',
                      loopedHours,
                      baseHours.length,
                      setSelectedHour,
                      hourRef,
                      item => parseInt(item, 10) - 1,
                    )
                  }
                  onScrollEndDrag={e => {
                    if (IS_ANDROID) {
                      if (shouldDeferSnapToMomentum(e)) return;
                      requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                          snapColumn(
                            coerceScrollEvent(hourOffsetRef.current),
                            'hour',
                            loopedHours,
                            baseHours.length,
                            setSelectedHour,
                            hourRef,
                            item => parseInt(item, 10) - 1,
                          );
                        });
                      });
                      return;
                    }
                    if (shouldDeferSnapToMomentum(e)) return;
                    snapColumn(
                      e,
                      'hour',
                      loopedHours,
                      baseHours.length,
                      setSelectedHour,
                      hourRef,
                      item => parseInt(item, 10) - 1,
                    );
                  }}
                />
                <LinearGradient
                  pointerEvents="none"
                  colors={[Colors.white, 'rgba(255,255,255,0)']}
                  style={styles.fadeTop}
                />
                <LinearGradient
                  pointerEvents="none"
                  colors={['rgba(255,255,255,0)', Colors.white]}
                  style={styles.fadeBottom}
                />
              </View>

              <Text style={styles.colon}>:</Text>

              <View style={styles.wheelColumn}>
                <FlatList
                  ref={minuteRef}
                  data={loopedMinutes}
                  keyExtractor={(_, i) => `m-${i}`}
                  renderItem={({ item, index }) =>
                    renderWheelItem(
                      item,
                      index,
                      minuteScrollY,
                      selectedMinute,
                      true,
                    )
                  }
                  getItemLayout={(_, i) => ({
                    length: ITEM_HEIGHT,
                    offset: ITEM_HEIGHT * i,
                    index: i,
                  })}
                  contentContainerStyle={styles.wheelContent}
                  // {...(IS_ANDROID ? {} : IOS_WHEEL_SNAP)}
                  decelerationRate={WHEEL_DECELERATION}
                  removeClippedSubviews={false}
                  bounces={false}
                  overScrollMode="never"
                  nestedScrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                  style={styles.wheelList}
                  onLayout={() => setMinuteLaidOut(true)}
                  onScroll={(ev: NativeSyntheticEvent<NativeScrollEvent>) => {
                    const y = ev.nativeEvent.contentOffset.y;
                    if (IS_ANDROID) {
                      minuteOffsetRef.current = y;
                    } else {
                      setMinuteScrollY(y);
                    }
                  }}
                  scrollEventThrottle={16}
                  onMomentumScrollEnd={e =>
                    snapColumn(
                      e,
                      'minute',
                      loopedMinutes,
                      baseMinutes.length,
                      setSelectedMinute,
                      minuteRef,
                      item => parseInt(item, 10),
                    )
                  }
                  onScrollEndDrag={e => {
                    if (IS_ANDROID) {
                      if (shouldDeferSnapToMomentum(e)) return;
                      requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                          snapColumn(
                            coerceScrollEvent(minuteOffsetRef.current),
                            'minute',
                            loopedMinutes,
                            baseMinutes.length,
                            setSelectedMinute,
                            minuteRef,
                            item => parseInt(item, 10),
                          );
                        });
                      });
                      return;
                    }
                    if (shouldDeferSnapToMomentum(e)) return;
                    snapColumn(
                      e,
                      'minute',
                      loopedMinutes,
                      baseMinutes.length,
                      setSelectedMinute,
                      minuteRef,
                      item => parseInt(item, 10),
                    );
                  }}
                />
                <LinearGradient
                  pointerEvents="none"
                  colors={[Colors.white, 'rgba(255,255,255,0)']}
                  style={styles.fadeTop}
                />
                <LinearGradient
                  pointerEvents="none"
                  colors={['rgba(255,255,255,0)', Colors.white]}
                  style={styles.fadeBottom}
                />
              </View>

              <View style={[styles.wheelColumn, styles.ampmWheelColumn]}>
                <FlatList
                  ref={ampmRef}
                  data={AMPM_ITEMS}
                  keyExtractor={item => `ap-${item}`}
                  renderItem={({ item, index }) =>
                    renderWheelItem(item, index, ampmScrollY, amPm, false)
                  }
                  getItemLayout={(_, i) => ({
                    length: ITEM_HEIGHT,
                    offset: ITEM_HEIGHT * i,
                    index: i,
                  })}
                  contentContainerStyle={styles.wheelContent}
                  {...(IS_ANDROID ? {} : IOS_WHEEL_SNAP)}
                  decelerationRate={WHEEL_DECELERATION}
                  removeClippedSubviews={false}
                  bounces={false}
                  overScrollMode="never"
                  nestedScrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                  style={styles.wheelList}
                  onLayout={() => setAmpmLaidOut(true)}
                  onScroll={(ev: NativeSyntheticEvent<NativeScrollEvent>) => {
                    const y = ev.nativeEvent.contentOffset.y;
                    if (IS_ANDROID) {
                      ampmOffsetRef.current = y;
                    } else {
                      setAmpmScrollY(y);
                    }
                  }}
                  scrollEventThrottle={16}
                  onMomentumScrollEnd={snapAmpmColumn}
                  onScrollEndDrag={e => {
                    if (IS_ANDROID) {
                      if (shouldDeferSnapToMomentum(e)) return;
                      requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                          snapAmpmColumn(
                            coerceScrollEvent(ampmOffsetRef.current),
                          );
                        });
                      });
                      return;
                    }
                    if (shouldDeferSnapToMomentum(e)) return;
                    snapAmpmColumn(e);
                  }}
                />
                <LinearGradient
                  pointerEvents="none"
                  colors={[Colors.white, 'rgba(255,255,255,0)']}
                  style={styles.fadeTop}
                />
                <LinearGradient
                  pointerEvents="none"
                  colors={['rgba(255,255,255,0)', Colors.white]}
                  style={styles.fadeBottom}
                />
              </View>
            </View>
          </View>

          <View style={styles.buttonRowOuter}>
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
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    backgroundColor: Colors.white,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 20,
    paddingBottom: 24,
  },
  title: {
    color: Colors.header,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 6,
    fontFamily: FontFamily.semiBold,
  },
  wheelFrame: {
    position: 'relative',
    marginVertical: 8,
  },
  selectionRails: {
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'space-between',
    zIndex: 4,
  },
  selectionLine: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.headerGrey,
    width: '100%',
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelColumn: {
    width: 52,
    height: WHEEL_HEIGHT,
    position: 'relative',
    overflow: 'hidden',
  },
  ampmWheelColumn: {
    width: 56,
    marginLeft: 6,
  },
  wheelList: {
    height: WHEEL_HEIGHT,
    width: '100%',
  },
  wheelContent: {
    paddingVertical: WHEEL_PAD,
  },
  wheelItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheelItemText: {
    color: Colors.black,
    fontSize: 20,
    fontFamily: FontFamily.regular,
  },
  wheelItemTextMono: {
    fontVariant: ['tabular-nums'],
  },
  wheelItemTextDim: {
    opacity: 0.38,
  },
  wheelItemTextCenter: {
    fontFamily: FontFamily.semiBold,
    fontSize: 22,
    color: Colors.blue,
  },
  colon: {
    color: Colors.black,
    fontSize: 22,
    marginHorizontal: 4,
    fontFamily: FontFamily.regular,
    marginTop: -4,
  },
  fadeTop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: WHEEL_PAD + 6,
    zIndex: 3,
  },
  fadeBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: WHEEL_PAD + 6,
    zIndex: 3,
  },
  buttonRowOuter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 0,
  },
  confirmBtn: {
    backgroundColor: Colors.blue,
    borderRadius: 10,
    alignItems: 'center',
    padding: 15,
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
    borderWidth: 1.5,
    borderColor: Colors.blue,
    width: '48%',
  },
  cancelText: {
    color: Colors.header,
    fontFamily: FontFamily.bold,
  },
});
