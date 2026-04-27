import React, { useCallback, useRef, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import OnboardHero from '../../assets/images/onboard.svg';
import SlideToContinue from '../../components/onboard/slide-to-continue';
import StepBody from '../../components/onboard/step-body';
import SafeAreaWrapper from '../../components/safe-area-wrapper';
import { GradientText } from '../../components/ui/gradient-text';
import AppText from '../../components/ui/app-text';
import { FlutterStrings } from '../../constants/flutterStrings';
import { PATHS } from '../../navigation/paths';
import { Colors } from '../../utils/colors';
import { setHasSeenOnboard } from '../../store/slices/authSlice';
import { useDispatch } from 'react-redux';

const OnboardScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const [step, setStep] = useState(0);
  const isNavigatingRef = useRef(false);

  const handleSkip = useCallback(() => {
    if (isNavigatingRef.current) {
      return;
    }
    isNavigatingRef.current = true;
    dispatch(setHasSeenOnboard());
    navigation.replace(PATHS.LoginRegister);
  }, [dispatch, navigation]);

  const handleAdvance = useCallback(() => {
    if (step >= 3) {
      handleSkip();
    } else {
      setStep(prev => prev + 1);
    }
  }, [step, handleSkip]);

  return (
    <SafeAreaWrapper style={styles.safe}>
      <View style={styles.pad}>
        <TouchableOpacity style={styles.skip} onPress={handleSkip}>
          <AppText font="medium" size={16} color={Colors.darkBlue}>
            {FlutterStrings.skip}
          </AppText>
        </TouchableOpacity>

        {step === 0 ? (
          <View style={styles.centerCol}>
            <Image
              source={require("../../assets/images/step/welcome.png")}
              style={{ width: 320, height: 320 }}
            />
            <View style={styles.welcomeHead}>
              <AppText
                font="semiBold"
                size={28}
                color={Colors.primary}
                align="center"
                numberOfLines={1}
                style={{ marginTop: 25 }}
              >
                Welcome To
              </AppText>
              <GradientText fontSize={28}>ParkClear!</GradientText>
            </View>
            <AppText
              size={16}
              color={Colors.primary}
              align="center"
              style={{ marginTop: 10, paddingHorizontal: 8 }}
            >
              {FlutterStrings.onboardSubTitle}
            </AppText>
            <View style={{ marginTop: 40, alignSelf: 'stretch' }}>
              <SlideToContinue onComplete={() => setStep(1)} />
            </View>
          </View>
        ) : (
          <StepBody step={step as 1 | 2 | 3} onAdvance={handleAdvance} />
        )}
      </View>
    </SafeAreaWrapper>
  );
};

export default OnboardScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  pad: { flex: 1, paddingHorizontal: 30, paddingVertical: 20 },
  skip: { alignSelf: 'flex-end', padding: 8 },
  centerCol: { flex: 1, justifyContent: 'center' },
  welcomeHead: { alignItems: 'center', width: '100%' },
});
