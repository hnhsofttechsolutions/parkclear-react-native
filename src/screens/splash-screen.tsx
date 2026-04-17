import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import SafeAreaWrapper from '../components/safe-area-wrapper';
import { Colors } from '../utils/colors';

const SplashScreen = ({ navigation }: any) => {
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return (
    <SafeAreaWrapper style={styles.safe}>
      <View style={styles.body}>
        <Animated.View style={{ transform: [{ scale }], alignItems: 'center' }}>
          <Image
            source={require('../assets/images/logo.png')}
            style={{ width: 200, height: 200 }}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    </SafeAreaWrapper>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  body: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
});
