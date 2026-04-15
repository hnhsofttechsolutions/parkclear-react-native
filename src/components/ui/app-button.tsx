import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AppText from './app-text';
import { Colors, Gradient } from '../../utils/colors';
import { FontFamily } from '../../utils/fonts';

interface Props {
  title: string;
  onPress?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'solid' | 'outline';
  style?: ViewStyle;
  isLoading?: boolean;
}

const AppButton = ({
  title,
  onPress,
  leftIcon,
  rightIcon,
  variant = 'solid',
  style,
  isLoading,
}: Props) => {
  const isOutline = variant === 'outline';
  const accent = Gradient.colors[0];

  if (isOutline) {
    return (
      <TouchableOpacity
        style={[styles.outlineOuter, { borderColor: accent }, style]}
        onPress={onPress}
        activeOpacity={0.85}
        disabled={isLoading}
      >
        {leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}
        {isLoading ? (
          <ActivityIndicator color={accent} size="small" />
        ) : (
          <AppText
            font="medium"
            size={16}
            color={Colors.primary}
            style={{ fontFamily: FontFamily.medium, lineHeight: 22 }}
          >
            {title}
          </AppText>
        )}
        {rightIcon ? <View style={styles.icon}>{rightIcon}</View> : null}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.solidTouch, style]}
      onPress={onPress}
      activeOpacity={0.92}
      disabled={isLoading}
    >
      <LinearGradient
        colors={[...Gradient.colors]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.solidGradient}
      >
        {leftIcon && !isLoading ? (
          <View style={styles.icon}>{leftIcon}</View>
        ) : null}
        {isLoading ? (
          <ActivityIndicator color={Colors.white} size="small" />
        ) : (
          <AppText
            font="medium"
            size={16}
            color={Colors.white}
            style={{ fontFamily: FontFamily.medium, lineHeight: 22 }}
          >
            {title}
          </AppText>
        )}
        {rightIcon && !isLoading ? (
          <View style={styles.icon}>{rightIcon}</View>
        ) : null}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  solidTouch: {
    borderRadius: 40,
    overflow: 'hidden',
  },
  solidGradient: {
    minHeight: 60,
    borderRadius: 40,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  outlineOuter: {
    minHeight: 60,
    borderRadius: 40,
    paddingHorizontal: 20,
    borderWidth: 2,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
