import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, View } from 'react-native';
import Purchases from 'react-native-purchases';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import SafeAreaWrapper from '../../components/safe-area-wrapper';
import AppText from '../../components/ui/app-text';
import { CloseButton } from '../../components/ui/close-button';
import { GradientButton } from '../../components/ui/gradient-button';
import { GradientText } from '../../components/ui/gradient-text';
import { FlutterStrings } from '../../constants/flutterStrings';
import { PATHS } from '../../navigation/paths';
import { Colors } from '../../utils/colors';
import { useLazyGetProfileQuery } from '../../store/api/settingApi';
import { setCredentials } from '../../store/slices/authSlice';
import { CommonActions } from '@react-navigation/native';
import { RootState } from '../../store/store';

const { width, height } = Dimensions.get('screen');

const SubscriptionFeatureScreen = ({ navigation }: any) => {
  const [packages, setPackages] = useState<any | null>(null);
  const dispatch = useDispatch();
  const [btnLoader, setBtnLoader] = useState(false);
  const [triggerGetProfile, { isLoading: isProfileLoading }] =
    useLazyGetProfileQuery();
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    getPackages();
  }, []);

  const getPackages = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      if (
        offerings.current !== null &&
        offerings.current.availablePackages.length !== 0
      ) {
        setPackages(offerings.current.availablePackages[0]);
      }
    } catch (error) {
      console.log('error ----> getRevenue', error);
    }
  };

  const handleSubscribeApp = async (packageToPurchase: any) => {
    try {
      setBtnLoader(true);
      const { customerInfo } = await Purchases.purchasePackage(
        packageToPurchase,
      );
      console.log('customerInfo ======>', customerInfo);

      const activeEntitlement = customerInfo.entitlements.active['pro'];
      const allActiveSubs = customerInfo.activeSubscriptions ?? [];
      const isEntitlementActive = typeof activeEntitlement !== 'undefined';
      const hasAnySub = allActiveSubs.length > 0;

      if (isEntitlementActive || hasAnySub) {
        const activeProdId =
          activeEntitlement?.productIdentifier ?? allActiveSubs[0] ?? null;

        setBtnLoader(false);
        const profileR = await triggerGetProfile().unwrap();
        dispatch(setCredentials({ token, user: profileR?.data }));
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: PATHS.Dashboard }],
          }),
        );

        Toast.show({
          type: 'success',
          text1: 'Subscription Successful!',
          text2: 'You are now subscribed to the pro plan.',
        });

        console.log('Success! User is now subscribed to:', activeProdId);
      }
    } catch (e: any) {
      setBtnLoader(false);
      console.log('error ----> handleSubscribeApp', e);
      if (!e.userCancelled) {
        console.log('Purchase Error:', e.message);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: e?.data?.message || e?.message,
        });
      } else {
        console.log('User cancelled the purchase');
      }
    }
  };

  return (
    <SafeAreaWrapper style={styles.safe}>
      <ScrollView style={styles.pad} bounces={false}>
        <CloseButton
          onPress={() => navigation.goBack()}
          style={{ marginTop: 6 }}
        />
        <View style={styles.center}>
          <View style={styles.headingRow}>
            <AppText font="semiBold" size={24} align="center">
              Can I{' '}
            </AppText>
            <GradientText fontSize={24}>Park</GradientText>
            <AppText font="semiBold" size={24} align="center">
              {' '}
              here next week?
            </AppText>
          </View>
          <AppText size={16} align="center" font="medium">
            Choose any Day and Time!
          </AppText>
          <Image
            source={require('../../assets/images/step/step2.png')}
            style={{
              width: width,
              height: height * 0.55,
            }}
            resizeMode="contain"
          />
          <View style={styles.textWrap}>
            <View style={styles.headingRow}>
              <AppText font="semiBold" size={26}>
                Get Expiration{' '}
              </AppText>
              <GradientText fontSize={26}>Alerts!</GradientText>
            </View>
            <View
              style={{
                width: '88%',
                alignSelf: 'center',
                paddingVertical: 14,
              }}
            >
              <AppText
                font="medium"
                align="center"
                numberOfLines={2}
                adjustsFontSizeToFit={true}
              >
                Enjoying parking support for just{' '}
                {`${packages?.product?.priceString}/month. (auto-renewing monthly plan)`}
              </AppText>
            </View>
          </View>
        </View>
        <View style={styles.actions}>
          <GradientButton
            label={`Start Subscription For ${packages?.product?.priceString} Monthly`}
            onPress={() => handleSubscribeApp(packages)}
            isLoading={btnLoader}
            disabled={btnLoader}
            style={{}}
          />
          <AppText
            font="medium"
            size={18}
            color={Colors.primary}
            align="center"
            onPress={() => navigation.goBack()}
            style={styles.mt10}
          >
            {FlutterStrings.cancelAnytime}
          </AppText>
          <View style={styles.policyRow}>
            <AppText
              color={Colors.primary}
              onPress={() => navigation.navigate(PATHS.PrivacyPolicy)}
            >
              Privacy Policy
            </AppText>
            <AppText color={Colors.primary}> | </AppText>
            <AppText
              color={Colors.primary}
              onPress={() => navigation.navigate(PATHS.Terms)}
            >
              Terms of Use
            </AppText>
          </View>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default SubscriptionFeatureScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  pad: { flex: 1, paddingHorizontal: 20, paddingBottom: 20 },
  center: { alignItems: 'center', marginTop: 5 },
  textWrap: { alignItems: 'center' },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
