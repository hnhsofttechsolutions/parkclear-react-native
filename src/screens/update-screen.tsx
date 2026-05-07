import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  Linking,
} from 'react-native';
import SpInAppUpdates, {
  IAUUpdateKind,
  StartUpdateOptions,
} from 'sp-react-native-in-app-updates';
import SafeAreaWrapper from '../components/safe-area-wrapper';
import AppText from '../components/ui/app-text';
import { CloseButton } from '../components/ui/close-button';
import { GradientButton } from '../components/ui/gradient-button';
import { GradientText } from '../components/ui/gradient-text';
import { Colors } from '../utils/colors';

const UpdateScreen = ({ navigation }: any) => {
  const inAppUpdates = new SpInAppUpdates(__DEV__ ?? false);

  const handleUpdate = async () => {
    try {
      if (__DEV__) {
        const storeUrl =
          Platform.OS === 'ios'
            ? 'itms-apps://itunes.apple.com/app/id6746191345'
            : 'market://details?id=com.app.parkclear';

        Linking.openURL(storeUrl).catch(err =>
          console.error('Link error', err),
        );
        return;
      }
      const updateOptions: StartUpdateOptions = Platform.select({
        ios: {
          title: 'Update available',
          message:
            'There is a new version of the app available on the App Store, do you want to update it?',
          buttonUpgradeText: 'Update',
          buttonCancelText: 'Cancel',
          updateType: IAUUpdateKind.FLEXIBLE,
        },
        android: {
          updateType: IAUUpdateKind.IMMEDIATE,
        },
      }) as StartUpdateOptions;

      await inAppUpdates.startUpdate(updateOptions as StartUpdateOptions);
    } catch (error) {
      console.log('Error starting update:', error);
    }
  };

  return (
    <SafeAreaWrapper style={styles.safe}>
      <View style={styles.pad}>
        <CloseButton onPress={() => navigation.goBack()} />

        <View style={styles.center}>
          <Image
            source={require('../assets/images/calendar.png')}
            style={styles.illustration}
          />
          <View style={styles.textWrap}>
            <View style={styles.headingRow}>
              <AppText font="semiBold" size={26} align="center">
                We Updated{' '}
              </AppText>
              <GradientText fontSize={26}>ParkClear</GradientText>
              <AppText font="semiBold" size={26} align="center">
                !
              </AppText>
            </View>
            <AppText
              size={18}
              color={Colors.primary}
              align="center"
              style={styles.mt10}
            >
              Please download the latest version to enjoy new features.
            </AppText>
          </View>
        </View>

        <View style={styles.actions}>
          <GradientButton label="Download Now" onPress={handleUpdate} />
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.mt20}
          >
            <AppText font="medium" size={18} color={Colors.blue} align="center">
              No Thanks
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

export default UpdateScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  pad: { flex: 1, paddingHorizontal: 20, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  illustration: {
    width: 320,
    height: 320,
    resizeMode: 'contain',
  },
  textWrap: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  mt10: { marginTop: 10 },
  mt20: { marginTop: 20 },
  actions: { marginTop: 20 },
});
