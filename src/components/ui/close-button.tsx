import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import CloseGradientIcon from '../../assets/images/close-gradient.svg';
import { Colors } from '../../utils/colors';

interface CloseButtonProps {
  onPress: () => void;
  style?: any;
}

export const CloseButton = ({ onPress, style }: CloseButtonProps) => {
  return (
    <Pressable onPress={onPress} style={[styles.leadWrap, style]} hitSlop={12}>
      <View style={styles.leadCircle}>
        <CloseGradientIcon width={50} height={50} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  leadWrap: {
    alignSelf: 'flex-end',
    marginTop: 20,
    marginBottom: 10,
    zIndex: 999,
  },
  leadCircle: {
    backgroundColor: Colors.white,
    borderRadius: 360,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    height: 35,
    width: 35,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
