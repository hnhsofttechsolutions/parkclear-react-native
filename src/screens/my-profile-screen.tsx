import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import SafeAreaWrapper from '../components/safe-area-wrapper';
import { AppBar } from '../components/ui/app-bar';
import AppText from '../components/ui/app-text';
import { GradientButton } from '../components/ui/gradient-button';
import PageLoader from '../components/ui/page-loader';
import { FlutterStrings } from '../constants/flutterStrings';
import { PATHS } from '../navigation/paths';
import { useLazyGetProfileQuery } from '../store/api/settingApi';
import { setCredentials } from '../store/slices/authSlice';
import { RootState } from '../store/store';
import { Colors, Gradient } from '../utils/colors';

const MyProfileScreen = ({ navigation }: any) => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const fullName = `${user?.first_name || ''} ${user?.last_name || ''}`;
  const isPaid = user?.is_paid;
  const [triggerGetProfile, { isLoading }] = useLazyGetProfileQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    getUserProfile();
  }, []);

  const getUserProfile = async () => {
    try {
      const profileR = await triggerGetProfile().unwrap();
      dispatch(setCredentials({ token, user: profileR?.data }));
    } catch (error) {
      console.log('error ----- ', error);
    }
  };

  const handlerPaywall = () => {
    if (isPaid) {
      navigation.navigate(PATHS.Gallery);
    } else {
      navigation.navigate(PATHS.Subscription);
    }
  };

  return (
    <SafeAreaWrapper style={styles.safe}>
      <PageLoader visible={isLoading} />
      <View style={styles.appBarPad}>
        <AppBar
          title={FlutterStrings.myProfile}
          onBack={() => navigation.goBack()}
        />
      </View>
      <View style={styles.body}>
        <AppText font="semiBold" size={20}>
          {fullName || 'No Name'}
        </AppText>
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
        <AppText font="regular" color={Colors.grey}>
          Earn star points by submitting signs to the community.
        </AppText>
        <GradientButton label="Add To Gallery" onPress={handlerPaywall} />

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <AppText color={Colors.grey} size={16}>
              First Name
            </AppText>
            <AppText font="medium" size={16}>
              {user?.first_name || 'N/A'}
            </AppText>
          </View>
          <View style={styles.detailRow}>
            <AppText color={Colors.grey} size={16}>
              Last Name
            </AppText>
            <AppText font="medium" size={16}>
              {user?.last_name || 'N/A'}
            </AppText>
          </View>
          <View style={styles.detailRow}>
            <AppText color={Colors.grey} size={16}>
              Email
            </AppText>
            <AppText font="medium" size={16}>
              {user?.email || 'N/A'}
            </AppText>
          </View>
          <View style={styles.detailRow}>
            <AppText color={Colors.grey} size={16}>
              Status
            </AppText>
            <AppText
              font="medium"
              size={16}
              color={user?.is_active ? Colors.primary : Colors.grey}
            >
              {user?.is_active ? 'Active' : 'Inactive'}
            </AppText>
          </View>
        </View>
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
  detailsContainer: {
    marginTop: 40,
    gap: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
});
