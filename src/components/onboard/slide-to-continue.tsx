import { StyleSheet, Text } from 'react-native';

import { useRef } from 'react';
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  PanResponder,
  View,
} from 'react-native';
import { Gradient } from '../../utils/colors';
import LinearGradient from 'react-native-linear-gradient';
import { FlutterStrings } from '../../constants/flutterStrings';
import SwipeArrow from '../../assets/images/swipe_arrow.svg';
import { Colors } from '../../utils/colors';
import { FontFamily } from '../../utils/fonts';

const SWIPE_LABEL_INSET = 56;

function SlideToContinue({ onComplete }: { onComplete: () => void }) {
  const trackWRef = useRef(0);
  const thumb = 50;
  const pad = 5;
  const x = useRef(new Animated.Value(0)).current;
  const dragStartX = useRef(0);

  const maxDrag = () => Math.max(0, trackWRef.current - thumb - pad * 2);

  const onLayout = (e: LayoutChangeEvent) => {
    trackWRef.current = e.nativeEvent.layout.width;
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: e => {
        const m = maxDrag();
        const lx = e.nativeEvent.locationX;
        const thumbLeft = Math.min(Math.max(0, lx - thumb / 2), m);
        dragStartX.current = thumbLeft;
        x.setValue(thumbLeft);
      },
      onPanResponderMove: (_, g) => {
        const m = maxDrag();
        const nx = Math.min(Math.max(0, dragStartX.current + g.dx), m);
        x.setValue(nx);
      },
      onPanResponderRelease: (_, g) => {
        const m = maxDrag();
        const nx = Math.min(Math.max(0, dragStartX.current + g.dx), m);
        const completed = nx >= m * 0.82 && m > 0;
        if (completed) {
          onComplete();
        }
        dragStartX.current = 0;
        if (completed) {
          x.setValue(0);
          return;
        }
        Animated.timing(x, {
          toValue: 0,
          duration: 320,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  return (
    <View
      style={slideStyles.track}
      onLayout={onLayout}
      collapsable={false}
      {...pan.panHandlers}
    >
      <LinearGradient
        colors={[...Gradient.colors]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFillObject, slideStyles.labelWrap]}
      >
        <Text style={slideStyles.slideLabelText} numberOfLines={1}>
          {FlutterStrings.swipeToContinue}
        </Text>
      </View>
      <Animated.View
        pointerEvents="none"
        style={[slideStyles.thumb, { transform: [{ translateX: x }] }]}
        collapsable={false}
      >
        <SwipeArrow width={22} height={22} />
      </Animated.View>
    </View>
  );
}

export default SlideToContinue;

const slideStyles = StyleSheet.create({
  track: {
    height: 60,
    borderRadius: 50,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  labelWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: SWIPE_LABEL_INSET,
    paddingRight: 12,
    zIndex: 1,
  },
  slideLabelText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
    fontFamily: FontFamily.medium,
    textAlign: 'center',
    includeFontPadding: false,
  },
  thumb: {
    zIndex: 2,
    position: 'absolute',
    left: 5,
    top: 5,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
