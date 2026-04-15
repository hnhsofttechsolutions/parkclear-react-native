import React from 'react';
import { StyleSheet } from 'react-native';
import AppText from './app-text';

interface ErrorTextProps {
  error?: string;
  visible?: boolean;
}

const ErrorText = ({ error, visible }: ErrorTextProps) => {
  if (!visible || !error) return null;

  return (
    <AppText size={12} color="red" style={styles.error}>
      {error}
    </AppText>
  );
};

const styles = StyleSheet.create({
  error: {
    marginTop: 4,
    marginLeft: 5,
    fontWeight: '400',
  },
});

export default ErrorText;
