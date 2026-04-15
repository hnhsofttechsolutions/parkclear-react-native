import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import AppButton from './app-button';
import { Colors, Gradient } from '../../utils/colors';
import Svg, { Circle } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import { ChevronRight } from 'lucide-react-native';

export function GradientButton({
  label,
  onPress,
  style,
  leftIcon,
  rightIcon,
  isLoading,
}: {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}) {
  return (
    <AppButton
      title={label}
      onPress={onPress}
      variant="solid"
      style={style}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      isLoading={isLoading}
    />
  );
}

export function GreyPillButton({
  onPress,
  children,
}: {
  onPress?: () => void;
  children: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={greyPillStyles.outer}
    >
      <View style={greyPillStyles.inner}>{children}</View>
    </TouchableOpacity>
  );
}

const greyPillStyles = StyleSheet.create({
  outer: { marginBottom: 0 },
  inner: {
    height: 60,
    borderRadius: 40,
    backgroundColor: Colors.greyButton,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
});

export function OutlineButton({
  label,
  onPress,
  style,
  leftIcon,
  rightIcon,
  isLoading,
}: {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}) {
  return (
    <AppButton
      title={label}
      onPress={onPress}
      variant="outline"
      style={style}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      isLoading={isLoading}
    />
  );
}

export function StepProgressButton({
  currentStep,
  onAdvance,
}: {
  currentStep: number;
  onAdvance: () => void;
}) {
  const size = 80;
  const stroke = 5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (Math.min(currentStep, 3) / 3) * c;

  return (
    <TouchableOpacity
      onPress={onAdvance}
      activeOpacity={0.9}
      style={{ alignItems: 'center' }}
    >
      <View
        style={{
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={Colors.indicatorStroke}
            strokeWidth={stroke}
            fill="none"
            opacity={0.35}
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={Colors.completedStroke}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={`${dash} ${c}`}
            strokeLinecap="square"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
        <LinearGradient
          colors={[...Gradient.colors]}
          style={{
            width: 54,
            height: 54,
            borderRadius: 27,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChevronRight color={Colors.white} size={24} />
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
}
