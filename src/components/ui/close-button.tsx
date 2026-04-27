import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import CloseGradientIcon from "../../assets/images/close-gradient.svg";
import { Colors } from '../../utils/colors';

interface CloseButtonProps {
  onPress: () => void;
  style?: any;
}

export const CloseButton = ({ onPress, style }: CloseButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.leadWrap, style]}
      hitSlop={12}
    >
      <View style={styles.leadCircle}>
        <CloseGradientIcon width={50} height={50} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  leadWrap: { alignItems: 'flex-end', paddingTop: 20, zIndex: 10 },
  leadCircle: {
    backgroundColor: Colors.white,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
});
