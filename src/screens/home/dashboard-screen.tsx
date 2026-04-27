import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Sound from 'react-native-sound';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { LevelPlay, LevelPlayInitListener, LevelPlayInitRequest, LevelPlayInterstitialAd, LevelPlayInterstitialAdListener } from 'unity-levelplay-mediation';
import CameraIcon from '../../assets/images/camera.svg';
import GalleryFabIcon from '../../assets/images/gallery_circle.svg';
import HamburgerIcon from '../../assets/images/hamburger_menu.svg';
import ProfileIcon from '../../assets/images/my_profile_circle.svg';
import ShareIcon from '../../assets/images/share_img.svg';
import CurrentTime from '../../components/current-time';
import SafeAreaWrapper from '../../components/safe-area-wrapper';
import SideDrawer from '../../components/side-drawer';
import { GradientButton } from '../../components/ui/gradient-button';
import PageLoader from '../../components/ui/page-loader';
import { usePaywall } from '../../hooks/use-paywall';
import { PATHS } from '../../navigation/paths';
import { useScreenStatusMutation } from '../../store/api/uploadApi';
import { setCredentials } from '../../store/slices/authSlice';
import { RootState } from '../../store/store';
import { Colors } from '../../utils/colors';
import { shareApp } from '../../utils/helpers';

const { height } = Dimensions.get('window');
Sound.setCategory('Playback');

const DashboardScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [drawer, setDrawer] = useState(false);
  const carSource = require('../../assets/images/car.png');
  const { user, token } = useSelector((state: RootState) => state.auth);
  const isPaid = user?.is_paid;
  const isScreen = user?.is_screen;
  const [statusUpdate, { isLoading: isStatusLoading }] = useScreenStatusMutation();

  const onClose = () => setDrawer(false);

  const { openPaywall, isProfileLoading } = usePaywall({ onClose });

  const INTERSTITIAL_AD_UNIT_ID = 'qk7mr064p5s687st';
  const APP_KEY_ANDROID = '24f17192d'
  const APP_KEY_IOS = '24f16a61d';
  const appKey = Platform.select({
    android: APP_KEY_ANDROID,
    ios: APP_KEY_IOS,
  });

  const interstitialAd = useRef(
    new LevelPlayInterstitialAd(INTERSTITIAL_AD_UNIT_ID)
  ).current;

  useEffect(() => {
    // const adTimer = setTimeout(() => {
    //   adService.showInterstitial();
    // }, 1000);
    // return () => {
    //   clearTimeout(adTimer);
    // };
  }, []);

  useEffect(() => {

    const listener: LevelPlayInterstitialAdListener = {
      onAdLoaded: () => {
        console.log("Ad Loaded");
        interstitialAd.showAd();
      },
      onAdLoadFailed: (error) => {
        console.log("Ad Load Failed", error);
      },
      onAdDisplayed: () => {
        console.log("Ad Displayed");
      },
      onAdDisplayFailed: (error) => {
        console.log("Display Failed", error);
      },
      onAdClosed: () => {
        console.log("Ad Closed");
      }
    };

    interstitialAd.setListener(listener);

    const initListener: LevelPlayInitListener = {
      onInitFailed: (error) => {
        console.log("Init failed", error);
      },
      onInitSuccess: () => {
        console.log("Init success");
        interstitialAd.loadAd();
      }
    };

    const initRequest = LevelPlayInitRequest.builder(String(appKey)).build();

    LevelPlay.init(initRequest, initListener);

  }, []);

  const handlerCamera = async () => {
    if (isScreen) return navigation.navigate(PATHS.Camera);
    try {
      const response = await statusUpdate({}).unwrap();
      if (response?.status) {
        dispatch(
          setCredentials({
            token: token,
            user: { ...user, is_screen: true },
          }),
        );
        navigation.navigate(PATHS.FutureParking);
      } else {
        Toast.show({
          type: 'error',
          text1: response?.message || 'Something went wrong',
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.root}>
      <PageLoader visible={isProfileLoading || isStatusLoading} />
      <LinearGradient
        colors={[Colors.gradientStart, Colors.darkBlue]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaWrapper
        style={styles.safe}
        backgroundColor="transparent"
        statusBarStyle="light-content"
        ignoreStatusBar
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() => setDrawer(true)}
            activeOpacity={0.85}
          >
            <HamburgerIcon width={45} height={45} />
          </TouchableOpacity>
          {isPaid ? (
            <TouchableOpacity
              onPress={handlerCamera}
              activeOpacity={0.85}
            >
              <CameraIcon width={45} height={45} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={openPaywall} activeOpacity={0.85}>
              <GalleryFabIcon width={45} height={45} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.imageContainer}>
            <Image source={carSource} style={styles.car} resizeMode="contain" />
          </View>
          <CurrentTime />
        </ScrollView>
        <View style={styles.bottomCard}>
          <GradientButton
            label="Can I Park Here?"
            onPress={() => navigation.navigate(PATHS.CaptureInstruction, { from: 'Dashboard' })}
          />
          <View style={styles.profileBtnContainer}>
            <TouchableOpacity
              style={styles.btnWhiteBg}
              onPress={() => navigation.navigate(PATHS.MyProfile)}
              activeOpacity={0.85}
            >
              <ProfileIcon width={50} height={50} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnWhiteBg}
              onPress={shareApp}
              activeOpacity={0.85}
            >
              <ShareIcon width={50} height={50} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaWrapper>
      <SideDrawer
        drawer={drawer}
        setDrawer={setDrawer}
        navigation={navigation}
      />
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    zIndex: 10,
  },
  iconCircle: {
    backgroundColor: Colors.white,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scroll: {
    paddingBottom: height * 0.28,
    alignItems: 'center',
  },
  imageContainer: {
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  car: {
    width: Dimensions.get('window').width * 0.8,
    height: 250,
  },
  bottomCard: {
    backgroundColor: Colors.tabBg,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 25,
    paddingVertical: 25,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  profileBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  btnWhiteBg: {
    backgroundColor: Colors.white,
    borderRadius: 50,
  },
});
