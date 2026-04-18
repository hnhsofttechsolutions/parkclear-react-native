import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { useSelector } from 'react-redux';
import { ArrowLeft, Check } from 'lucide-react-native';

import SafeAreaWrapper from '../../components/safe-area-wrapper';
import AppText from '../../components/ui/app-text';
import { GradientButton } from '../../components/ui/gradient-button';
import { Colors } from '../../utils/colors';
import { RootState } from '../../store/store';

const REVENUECAT_API_KEY = Platform.select({
  ios: 'app3cf199ce50',
  android: 'appb0b01ef597',
});

const ENTITLEMENT_ID = 'pro_features';

const SubscriptionPackagesScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [isPro, setIsPro] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  const setupRevenueCat = useCallback(async () => {
    try {
      if (!REVENUECAT_API_KEY) {
        Alert.alert('Error', 'RevenueCat key missing.');
        return;
      }

      Purchases.configure({ apiKey: REVENUECAT_API_KEY });

      if (user?.id) {
        await Purchases.logIn(String(user.id));
      }

      const customerInfo = await Purchases.getCustomerInfo();
      setIsPro(Boolean(customerInfo.entitlements.active[ENTITLEMENT_ID]));

      const offerings = await Purchases.getOfferings();
      const availablePackages = offerings.current?.availablePackages ?? [];
      setPackages(availablePackages);
    } catch (error) {
      Alert.alert('Error', 'Packages fetch nahi ho sake.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    setupRevenueCat();
  }, [setupRevenueCat]);

  const handlePurchase = async (packageToBuy: PurchasesPackage) => {
    try {
      setPurchasingId(packageToBuy.identifier);
      const { customerInfo } = await Purchases.purchasePackage(packageToBuy);

      if (customerInfo.entitlements.active[ENTITLEMENT_ID]) {
        setIsPro(true);
        Alert.alert('Success', 'Subscription activated successfully.');
      }
    } catch (error: any) {
      if (!error?.userCancelled) {
        Alert.alert('Error', error?.message ?? 'Purchase failed.');
      }
    } finally {
      setPurchasingId(null);
    }
  };

  const renderPackage = ({ item }: { item: PurchasesPackage }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.packageCard}
      onPress={() => handlePurchase(item)}
      disabled={Boolean(purchasingId)}
    >
      <View style={styles.cardHeader}>
        <AppText font="semiBold" size={18} color={Colors.primary} style={styles.titleFlex}>
          {item.product.title}
        </AppText>
        <View style={styles.priceBadge}>
          <AppText font="bold" size={14} color={Colors.darkBlue}>
            {item.product.priceString}
          </AppText>
        </View>
      </View>

      <AppText size={14} color={Colors.greyIcon} style={styles.packageDescription}>
        {item.product.description || 'Premium access with smart parking insights.'}
      </AppText>

      <View style={styles.ctaRow}>
        <AppText font="medium" size={14} color={Colors.darkBlue}>
          {purchasingId === item.identifier ? 'Processing...' : 'Tap to purchase'}
        </AppText>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaWrapper style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
          style={styles.backBtn}
        >
          <ArrowLeft size={20} color={Colors.primary} />
        </TouchableOpacity>

        <AppText font="bold" size={28} align="center" style={styles.heading}>
          Choose Your Plan
        </AppText>
        <AppText size={15} align="center" color={Colors.greyIcon} style={styles.subHeading}>
          Select a package to unlock premium features.
        </AppText>

        {loading ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="large" color={Colors.darkBlue} />
          </View>
        ) : isPro ? (
          <View style={styles.proCard}>
            <View style={styles.proIconWrap}>
              <Check size={22} color={Colors.white} />
            </View>
            <AppText font="semiBold" size={18} align="center" color={Colors.white}>
              You are already a Pro member.
            </AppText>
          </View>
        ) : (
          <FlatList
            data={packages}
            renderItem={renderPackage}
            keyExtractor={item => item.identifier}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <AppText align="center" color={Colors.greyIcon}>
                No active plans found right now.
              </AppText>
            }
          />
        )}

        <GradientButton
          label="Restore Purchases"
          onPress={async () => {
            try {
              setLoading(true);
              const customerInfo = await Purchases.restorePurchases();
              const restored = Boolean(customerInfo.entitlements.active[ENTITLEMENT_ID]);
              setIsPro(restored);
              Alert.alert(
                restored ? 'Restored' : 'No Subscription',
                restored
                  ? 'Your subscription has been restored.'
                  : 'No active subscription found to restore.',
              );
            } catch (error) {
              Alert.alert('Error', 'Restore failed.');
            } finally {
              setLoading(false);
            }
          }}
          style={styles.restoreBtn}
          isLoading={loading}
        />
      </View>
    </SafeAreaWrapper>
  );
};

export default SubscriptionPackagesScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  heading: {
    marginTop: 14,
  },
  subHeading: {
    marginTop: 4,
    marginBottom: 18,
  },
  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    gap: 12,
    paddingBottom: 20,
  },
  packageCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    padding: 16,
    backgroundColor: Colors.white,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  titleFlex: {
    flex: 1,
  },
  priceBadge: {
    borderRadius: 999,
    backgroundColor: '#EAF4FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  packageDescription: {
    marginTop: 10,
  },
  ctaRow: {
    marginTop: 12,
  },
  proCard: {
    marginTop: 10,
    borderRadius: 16,
    backgroundColor: Colors.greenDark,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  proIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  restoreBtn: {
    marginTop: 10,
  },
});
