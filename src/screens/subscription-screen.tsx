import React from 'react';
import { StyleSheet, View } from 'react-native';
import SubscriptionArt from '../assets/images/ic_subscription.svg';
import SafeAreaWrapper from '../components/safe-area-wrapper';
import AppText from '../components/ui/app-text';
import {
  GradientButton,
  OutlineButton,
} from '../components/ui/gradient-button';
import { GradientText } from '../components/ui/gradient-text';
import { FlutterStrings } from '../constants/flutterStrings';
import { PATHS } from '../navigation/paths';
import { Colors } from '../utils/colors';

const SubscriptionScreen = ({ navigation }: any) => {
  return (
    <SafeAreaWrapper style={styles.safe}>
      <View style={styles.pad}>
        <View style={styles.flex}>
          <View style={styles.center}>
            <SubscriptionArt width={300} height={300} />
            <View style={{ alignItems: 'center' }}>
              <View style={{ flexDirection: 'row' }}>
                <AppText font="semiBold" size={28}>
                  Join{' '}
                </AppText>
                <GradientText fontSize={28}>ParkClear</GradientText>
              </View>
              <AppText font="semiBold" size={28} align="center">
                for only Rs 1,400
              </AppText>
              <AppText
                color={Colors.primary}
                align="center"
                style={styles.mt10}
              >
                {FlutterStrings.subscriptionDesc}
              </AppText>
              <AppText
                color={Colors.primary}
                align="center"
                style={styles.mt10}
              >
                {FlutterStrings.subscriptionDesc}
              </AppText>
            </View>
          </View>
        </View>
        <View style={{ gap: 10 }}>
          <GradientButton
            label={FlutterStrings.startSubscription}
            onPress={() => navigation.navigate(PATHS.Dashboard)}
          />
          <OutlineButton
            label={FlutterStrings.cancelAnytime}
            onPress={() => navigation.goBack()}
          />
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

export default SubscriptionScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  pad: { flex: 1, paddingHorizontal: 20, paddingBottom: 28 },
  flex: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mt10: { marginTop: 10 },
});
