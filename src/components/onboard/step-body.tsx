import React from 'react';
import {
  Image,
  StyleSheet,
  View
} from 'react-native';
import { StepProgressButton } from '../ui/gradient-button';
import StepDots from './step-dots';
import StepTitle from './step-title';


const StepBody = React.memo(({ step, onAdvance }: { step: 1 | 2 | 3; onAdvance: () => void; }) => {
  return (
    <View style={styles.stepFlex}>
      <View style={styles.stepCenter}>
        <View style={styles.illustrationWrap}>
          {step === 1 && (
            <Image
              source={require("../../assets/images/step/step1.png")}
              style={{ width: 320, height: 320 }}
            />
          )}
          {step === 2 && (
            <Image
              source={require('../../assets/images/step/step2.png')}
              style={{ width: 340, height: 340, resizeMode: 'contain' }}
            />
          )}
          {step === 3 && (
            <Image
              source={require("../../assets/images/step/step3.png")}
              style={{ width: 400, height: 400, resizeMode: 'contain' }}
            />
          )}
        </View>
        <View style={styles.titleWrap}>
          <StepTitle step={step} />
        </View>
      </View>
      <View style={styles.stepFooter}>
        <StepDots current={step} />
        <StepProgressButton currentStep={step} onAdvance={onAdvance} />
      </View>
    </View>
  );
});

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
  stepFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
});
