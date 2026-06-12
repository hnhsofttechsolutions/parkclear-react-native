import React from 'react';
import {
  ActivityIndicator,
  Modal,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import AppText from './app-text';
import { Colors } from '../../utils/colors';

interface PageLoaderProps {
  visible: boolean;
  message?: string;
}

const PageLoader = ({ visible, message }: PageLoaderProps) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.7)" translucent />
      <View style={styles.container}>
        <View style={styles.backdrop} />
        <ActivityIndicator size="large" color={Colors.white} />
        {message ? (
          <AppText
            size={15}
            color={Colors.white}
            align="center"
            style={styles.message}
          >
            {message}
          </AppText>
        ) : null}
      </View>
    </Modal>
  );
};

export default PageLoader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  message: {
    marginTop: 16,
    paddingHorizontal: 32,
  },
  content: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -120 }, { translateY: -80 }],
    width: 240,
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});
