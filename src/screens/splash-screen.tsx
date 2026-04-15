import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import SafeAreaWrapper from '../components/safe-area-wrapper';
import SplashBrand from '../assets/images/ic_subscription.svg';
import { PATHS } from '../navigation/paths';
import { Colors } from '../utils/colors';
import { GradientButton } from '../components/ui/gradient-button';

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
          <SplashBrand width={200} height={200} />
        </Animated.View>
        <GradientButton
          label="Continue"
          onPress={() => navigation.replace(PATHS.Onboard)}
          style={{ marginTop: 48, alignSelf: 'stretch' }}
        />
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
