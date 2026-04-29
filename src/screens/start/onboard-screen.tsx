import React, { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { useDispatch } from 'react-redux';
import SlideToContinue from '../../components/onboard/slide-to-continue';
import StepBody from '../../components/onboard/step-body';
import SafeAreaWrapper from '../../components/safe-area-wrapper';
import AppText from '../../components/ui/app-text';
import { GradientText } from '../../components/ui/gradient-text';
import { FlutterStrings } from '../../constants/flutterStrings';
import { PATHS } from '../../navigation/paths';
import { setHasSeenOnboard } from '../../store/slices/authSlice';
import { Colors } from '../../utils/colors';

const { width, height } = Dimensions.get('screen');

const OnboardScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();

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
              source={require('../../assets/images/step/welcome.png')}
              style={{
                width: width,
                height: height * 0.5,
                alignSelf: 'center',
              }}
              resizeMode="contain"
            />
            <View style={styles.welcomeHead}>
              <AppText
                font="semiBold"
                size={34}
                color={Colors.primary}
                align="center"
                numberOfLines={1}
                style={{ marginTop: 25 }}
              >
                Welcome To
              </AppText>
              <GradientText fontSize={34}>ParkClear!</GradientText>
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
