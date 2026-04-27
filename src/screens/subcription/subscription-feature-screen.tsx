import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { CloseButton } from '../../components/ui/close-button';
import { PATHS } from '../../navigation/paths';
import { Colors } from '../../utils/colors';
import SafeAreaWrapper from '../../components/safe-area-wrapper';
import AppText from '../../components/ui/app-text';
import { GradientText } from '../../components/ui/gradient-text';
import { GradientButton } from '../../components/ui/gradient-button';
import { FlutterStrings } from '../../constants/flutterStrings';

const SubscriptionFeatureScreen = ({ navigation }: any) => {
  return (
    <SafeAreaWrapper style={styles.safe}>
      <View style={styles.pad}>
        <CloseButton onPress={() => navigation.goBack()} />
        <View style={styles.center}>
          <View style={styles.headingRow}>
            <AppText font="semiBold" size={26} align="center">Can I </AppText>
            <GradientText fontSize={26}>Park</GradientText>
            <AppText font="semiBold" size={26} align="center"> here next week?</AppText>
          </View>
          <AppText size={16} align="center">
            Choose any Day and Time!
          </AppText>
          <Image
            source={require('../../assets/images/step/step2.png')}
            style={{ width: 340, height: 340, resizeMode: 'contain' }}
          />
          <View style={styles.textWrap}>
            <View style={styles.headingRow}>
              <AppText font="semiBold" size={26}>Get Expiration </AppText>
              <GradientText fontSize={26}>Alerts!</GradientText>
            </View>
            <AppText size={16} align="center" style={styles.mt20}>
              Enjoying parking support for just
            </AppText>
            <AppText size={16} align="center">
              $4.99/month. (auto-renewing monthly plan)
            </AppText>
          </View>
        </View>
        <View style={styles.actions}>
          <GradientButton
            label="Start Subscription For $4.99 Monthly"
            onPress={() => navigation.navigate(PATHS.SubscriptionPackages)}
          />
          <AppText
            font="medium"
            size={18}
            color={Colors.primary}
            align='center'
            onPress={() => navigation.goBack()}
            style={styles.mt10}
          >
            {FlutterStrings.cancelAnytime}
          </AppText>
          <View style={styles.policyRow}>
            <AppText
              color={Colors.primary}
              onPress={() => navigation.navigate(PATHS.PrivacyPolicy)}>
              Privacy Policy
            </AppText>
            <AppText color={Colors.primary}> | </AppText>
            <AppText
              color={Colors.primary}
              onPress={() => navigation.navigate(PATHS.Terms)}>
              Terms of Use
            </AppText>
          </View>
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

export default SubscriptionFeatureScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  pad: { flex: 1, paddingHorizontal: 20, paddingBottom: 20 },
  center: { alignItems: 'center', marginTop: 5 },
  textWrap: { alignItems: 'center', marginTop: 30 },
  headingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  mt20: { marginTop: 20 },
  mt10: { marginTop: 10 },
  actions: { gap: 8, marginTop: 10 },
  policyRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
});
