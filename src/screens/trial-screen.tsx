import React from 'react';
import { StyleSheet, View } from 'react-native';
import SafeAreaWrapper from '../components/safe-area-wrapper';
import SubscriptionArt from '../assets/images/ic_subscription.svg';
import AppText from '../components/ui/app-text';
import { FlutterStrings } from '../constants/flutterStrings';
import { PATHS } from '../navigation/paths';
import { Colors } from '../utils/colors';
import { GradientButton } from '../components/ui/gradient-button';
import { GradientText } from '../components/ui/gradient-text';

const TrialScreen = ({ navigation }: any) => {
  return (
    <SafeAreaWrapper style={styles.safe}>
      <View style={styles.pad}>
        <View style={styles.flex}>
          <View style={styles.center}>
            <SubscriptionArt width={300} height={300} />
            <AppText
              color={Colors.primary}
              align="center"
              style={{ marginTop: 50, paddingHorizontal: 8, fontWeight: '400' }}
            >
              {FlutterStrings.subscriptionDesc}
            </AppText>
            <View style={{ marginTop: 30, alignItems: 'center' }}>
              <View style={{ flexDirection: 'row' }}>
                <AppText font="semiBold" size={28}>
                  Join{' '}
                </AppText>
                <GradientText fontSize={28}>ParkClear</GradientText>
              </View>
              <AppText font="semiBold" size={28} align="center">
                {FlutterStrings.freeFor30Days}
              </AppText>
            </View>
          </View>
        </View>
        <GradientButton
          label={FlutterStrings.availNow}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: PATHS.Dashboard }],
            })
          }
        />
        <View style={{ height: 30 }} />
      </View>
    </SafeAreaWrapper>
  );
};

export default TrialScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  pad: { flex: 1, paddingHorizontal: 20, paddingBottom: 28 },
  flex: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
