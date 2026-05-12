import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { Colors } from '../utils/colors';

interface Props {
  visible: boolean;
  onClose: () => void;
  height?: number;
  disableBackdropClose?: boolean;
  children: React.ReactNode;
  sheetStyle?: ViewStyle;
}

const BottomSheetModal = ({
  visible,
  onClose,
  height = 420,
  children,
  disableBackdropClose,
  sheetStyle,
}: Props) => {
  const translateY = useRef(new Animated.Value(height)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const animateSheet = useCallback(
    (toValue: number, opacity: number, onEnd?: () => void) => {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue,
          useNativeDriver: true,
          damping: 20,
          stiffness: 180,
        }),
        Animated.timing(backdropOpacity, {
          toValue: opacity,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(() => onEnd?.());
    },
    [translateY, backdropOpacity],
  );

  useEffect(() => {
    if (visible) {
      translateY.setValue(height);
      backdropOpacity.setValue(0);
      animateSheet(0, 1);
    }
  }, [visible, height, animateSheet, translateY, backdropOpacity]);

  const close = useCallback(() => {
    animateSheet(height, 0, onClose);
  }, [animateSheet, height, onClose]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) =>
          Math.abs(g.dy) > 6 && Math.abs(g.dy) > Math.abs(g.dx),

        onPanResponderMove: (_, g) => {
          if (g.dy > 0) {
            translateY.setValue(g.dy);
            backdropOpacity.setValue(Math.max(0, 1 - g.dy / 260));
          }
        },

        onPanResponderRelease: (_, g) => {
          if (g.dy > 140 || g.vy > 1.2) {
            close();
          } else {
            animateSheet(0, 1);
          }
        },
      }),
    [translateY, backdropOpacity, close, animateSheet],
  );

  return (
    <Modal transparent visible={visible} animationType="none">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.root}
        >
          <View style={styles.root}>
            <Animated.View
              style={[styles.backdrop, { opacity: backdropOpacity }]}
            >
              <Pressable
                style={StyleSheet.absoluteFill}
                onPress={disableBackdropClose ? undefined : close}
              />
            </Animated.View>
            <Animated.View
              style={[
                styles.sheet,
                sheetStyle,
                { transform: [{ translateY }] },
              ]}
            >
              <View {...panResponder.panHandlers}>
                <View style={styles.handle} />
              </View>
              {children}
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default BottomSheetModal;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(25,29,49,0.35)',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
  },
  handle: {
    width: 58,
    height: 6,
    borderRadius: 999,
    backgroundColor: Colors.lightGrey,
    alignSelf: 'center',
    marginBottom: 14,
  },
});
