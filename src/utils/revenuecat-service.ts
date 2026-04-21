import { Platform } from 'react-native';
import Purchases from 'react-native-purchases';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import Toast from 'react-native-toast-message';

const REVENUECAT_API_KEY = Platform.select({
  ios: 'appl_DqdhKMtYkQIUWXfGnvZjlrwdtIY',
  android: 'goog_QEsNqmtAzOJzkLobdZwIiVSEZpY',
});

export const initRevenueCat = async (userId?: string) => {
  try {
    if (!REVENUECAT_API_KEY) {
      throw new Error('RevenueCat key missing');
    }
    Purchases.configure({ apiKey: REVENUECAT_API_KEY });
    if (userId) {
      await Purchases.logIn(String(userId));
    }
  } catch (error) {
    console.log('RC Init Error:', error);
    throw error;
  }
};

export const getOffering = async () => {
  try {
    const offerings = await Purchases.getOfferings();
    if (!offerings?.all?.parkclear) {
      throw new Error('Offering not found');
    }
    return offerings.all.parkclear;
  } catch (error) {
    console.log('RC Offering Error:', error);
    throw error;
  }
};

export const showPaywall = async () => {
  try {
    const offering = await getOffering();
    const result = await RevenueCatUI.presentPaywallIfNeeded({
      offering,
      requiredEntitlementIdentifier: 'pro',
    });
    return result;
  } catch (error) {
    console.log('RC Paywall Error:', error);
    throw error;
  }
};

export const handlePaywallResult = async (result: PAYWALL_RESULT) => {
  switch (result) {
    case PAYWALL_RESULT.NOT_PRESENTED:
      Toast.show({
        type: 'success',
        text1: 'Already Active',
        text2: 'You already have access!',
      });
      break;
    case PAYWALL_RESULT.PURCHASED:
    case PAYWALL_RESULT.RESTORED:
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Pro unlocked',
      });
      break;
    case PAYWALL_RESULT.CANCELLED:
      console.log('Cancelled');
      // Toast.show({
      //   type: 'info',
      //   text1: 'Cancelled',
      // });
      break;
    case PAYWALL_RESULT.ERROR:
      Toast.show({
        type: 'error',
        text1: 'Error',
      });
      break;
  }
};
