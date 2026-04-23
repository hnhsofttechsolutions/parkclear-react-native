import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet } from 'react-native';
import SafeAreaWrapper from '../../components/safe-area-wrapper';
import { Colors } from '../../utils/colors';

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const scale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 1500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        onComplete();
      });
    });
  }, []);

  return (
    <SafeAreaWrapper style={styles.safe}>
      <Animated.View style={[styles.body, { opacity }]}>
        <Animated.View style={{ transform: [{ scale }], alignItems: 'center' }}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={{ width: 200, height: 200 }}
            resizeMode="contain"
          />
        </Animated.View>
      </Animated.View>
    </SafeAreaWrapper>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
});
