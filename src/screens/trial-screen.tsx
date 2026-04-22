import React from 'react';
import { StyleSheet, View } from 'react-native';
import SafeAreaWrapper from '../components/safe-area-wrapper';
import SubscriptionArt from '../assets/images/ic_subscription.svg';
import AppText from '../components/ui/app-text';
import { FlutterStrings } from '../constants/flutterStrings';
import { PATHS } from '../navigation/paths';
import { Colors } from '../utils/colors';
import {
  GradientButton,
  GreyPillButton,
  OutlineButton,
} from '../components/ui/gradient-button';
import { GradientText } from '../components/ui/gradient-text';

const TrialScreen = ({ navigation }: any) => {
  const handlerReset = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: PATHS.LoginRegister }],
    });
  };

  return (
    <SafeAreaWrapper style={styles.safe}>
      <View style={styles.pad}>
        <View style={styles.flex}>
          <View style={styles.center}>
            <SubscriptionArt width={300} height={300} />
            <View style={{ alignItems: 'center' }}>
              <GradientText fontSize={28}>Enjoy 30 Days </GradientText>
              <AppText font="semiBold" size={28}>
                With NO Ads!
              </AppText>
            </View>
            <AppText
              color={Colors.primary}
              align="center"
              style={{ paddingHorizontal: 8, marginTop: 10 }}
            >
              {FlutterStrings.subscriptionDesc}
            </AppText>
          </View>
        </View>
        <View style={{ gap: 10 }}>
          <OutlineButton
            label={FlutterStrings.noAdsTrial}
            onPress={handlerReset}
          />
          <GradientButton
            label={FlutterStrings.startSubscription}
            onPress={handlerReset}
          />
          <GreyPillButton onPress={handlerReset}>
            <AppText font="medium" size={18} color={Colors.primary}>
              {FlutterStrings.cancelAnytime}
            </AppText>
          </GreyPillButton>
        </View>
        <View style={{ height: 30 }} />
      </View>
    </SafeAreaWrapper>
  );
};

export default TrialScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  pad: { flex: 1, paddingHorizontal: 20 },
  flex: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
