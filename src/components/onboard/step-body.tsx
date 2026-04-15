import { useEffect, useLayoutEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
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

  const fade = useRef(new Animated.Value(1)).current;
  const prevStep = useRef(step);

  useLayoutEffect(() => {
    if (prevStep.current !== step) {
      prevStep.current = step;
      fade.setValue(0);
    }
  }, [step, fade]);

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 340,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [step, fade]);

  return (
    <View style={styles.stepFlex}>
      <Animated.View style={[styles.stepCenter, { opacity: fade }]}>
        {step === 3 ? (
          <Step3 width={300} height={300} />
        ) : step === 1 ? (
          <Step1 width={400} height={400} />
        ) : (
          <Step2 width={400} height={400} />
        )}
        <View style={{ alignItems: 'center' }}>
          <StepTitle step={step} />
        </View>
        <AppText
          color={Colors.primary}
          align="center"
          style={{ marginTop: 10, fontWeight: '400', paddingHorizontal: 8 }}
        >
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
  stepCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  stepFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
});
