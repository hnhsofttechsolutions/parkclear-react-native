import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { FlutterStrings } from '../../constants/flutterStrings';
import StepTitle from './step-title';
import AppText from '../ui/app-text';
import { Colors } from '../../utils/colors';
import StepDots from './step-dots';
import { StepProgressButton } from '../ui/gradient-button';
import Step1 from '../../assets/images/step1_image.svg';
import Step2 from '../../assets/images/step2_image.svg';
import Step3 from '../../assets/images/Untitled.svg';

function StepBody({
  step,
  onAdvance,
}: {
  step: 1 | 2 | 3;
  onAdvance: () => void;
}) {
  const subtitle =
    step === 1
      ? FlutterStrings.step1Subtitle
      : step === 2
      ? FlutterStrings.step2Subtitle
      : FlutterStrings.step3Subtitle;

  const { width, height } = useWindowDimensions();
  const fade = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fade.setValue(0);
    translateY.setValue(18);

    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, step, translateY]);

  const illustrationSize = Math.min(
    width - 40,
    height * 0.34,
    step === 3 ? 280 : 320,
  );

  return (
    <View style={styles.stepFlex}>
      <Animated.View
        style={[
          styles.stepCenter,
          {
            opacity: fade,
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={styles.illustrationWrap}>
          {step === 3 ? (
            <Step3 width={illustrationSize} height={illustrationSize} />
          ) : step === 1 ? (
            <Step1 width={illustrationSize} height={illustrationSize} />
          ) : (
            <Step2 width={illustrationSize} height={illustrationSize} />
          )}
        </View>
        <View style={styles.titleWrap}>
          <StepTitle step={step} />
        </View>
        <AppText color={Colors.primary} align="center" style={styles.subtitle}>
          {subtitle}
        </AppText>
      </Animated.View>
      <View style={styles.stepFooter}>
        <StepDots current={step} />
        <StepProgressButton currentStep={step} onAdvance={onAdvance} />
      </View>
    </View>
  );
}

export default StepBody;

const styles = StyleSheet.create({
  stepFlex: { flex: 1 },
  stepCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  illustrationWrap: {
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    alignItems: 'center',
  },
  subtitle: {
    marginTop: 10,
    fontWeight: '400',
    paddingHorizontal: 8,
    lineHeight: 24,
  },
  stepFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
});
