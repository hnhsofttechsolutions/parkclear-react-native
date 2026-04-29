import { CommonActions } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Purchases from 'react-native-purchases';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import SubscriptionArt from '../assets/images/ic_subscription.svg';
import SafeAreaWrapper from '../components/safe-area-wrapper';
import AppText from '../components/ui/app-text';
import {
  GradientButton,
  OutlineButton,
} from '../components/ui/gradient-button';
import { GradientText } from '../components/ui/gradient-text';
import PageLoader from '../components/ui/page-loader';
import { FlutterStrings } from '../constants/flutterStrings';
import { PATHS } from '../navigation/paths';
import { useLazyGetProfileQuery } from '../store/api/settingApi';
import { setCredentials } from '../store/slices/authSlice';
import { RootState } from '../store/store';
import { Colors } from '../utils/colors';

const TrialScreen = ({ navigation }: any) => {
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

  const handlerReset = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: PATHS.Dashboard }],
      }),
    );
  };

  return (
    <SafeAreaWrapper style={styles.safe}>
      <PageLoader visible={isProfileLoading} />
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
            label={`Start Subscription For ${packages?.product?.priceString} Monthly`}
            onPress={() => handleSubscribeApp(packages)}
            isLoading={btnLoader}
            disabled={btnLoader}
          />
          <AppText
            font="medium"
            size={18}
            color={Colors.primary}
            align="center"
            onPress={handlerReset}
          >
            {FlutterStrings.cancelAnytime}
          </AppText>
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
