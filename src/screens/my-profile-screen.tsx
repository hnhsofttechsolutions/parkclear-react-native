import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import SafeAreaWrapper from '../components/safe-area-wrapper';
import { AppBar } from '../components/ui/app-bar';
import AppText from '../components/ui/app-text';
import { GradientButton } from '../components/ui/gradient-button';
import { FlutterStrings } from '../constants/flutterStrings';
import { PATHS } from '../navigation/paths';
import { RootState } from '../store/store';
import { Colors, Gradient } from '../utils/colors';
import { usePaywall } from '../hooks/use-paywall';
import PageLoader from '../components/ui/page-loader';

const MyProfileScreen = ({ navigation }: any) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const fullName = `${user?.first_name || ''} ${user?.last_name || ''}`;
  const isPaid = user?.is_paid;

  const onClose = () => navigation.goBack();

  const { openPaywall, isProfileLoading } = usePaywall({ onClose });

  const handlerPaywall = () => {
    if (isPaid) {
      navigation.navigate(PATHS.Dashboard);
    } else {
      openPaywall();
    }
  }

  return (
    <SafeAreaWrapper style={styles.safe}>
      <PageLoader visible={isProfileLoading} />
      <View style={styles.appBarPad}>
        <AppBar
          title={FlutterStrings.myProfile}
          onBack={() => navigation.goBack()}
        />
      </View>
      <View style={styles.body}>
        <AppText font="semiBold" size={20}>{fullName || 'No Name'}</AppText>
        <View style={styles.starRow}>
          <Image
            source={require('../assets/images/star.png')}
            style={{ width: 40, height: 40 }}
          />
          <LinearGradient
            colors={[...Gradient.colors]}
            style={styles.pointsCircle}
          >
            <AppText font="semiBold" size={26} color={Colors.white}>
              {user?.parking_images_count}
            </AppText>
          </LinearGradient>
        </View>
        <AppText font="regular" color={Colors.grey} >
          Earn star points by submitting signs to the community.
        </AppText>
        <GradientButton
          label="Add To Gallery"
          onPress={handlerPaywall}
        />
      </View>
    </SafeAreaWrapper>
  );
};

export default MyProfileScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  appBarPad: { paddingHorizontal: 20 },
  body: { padding: 20, gap: 10 },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 10,
  },
  pointsCircle: {
    width: 72,
    height: 72,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
