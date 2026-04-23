import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
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
import { RootState } from '../../store/store';
import { Colors } from '../../utils/colors';
import { shareApp } from '../../utils/helpers';
import Sound from 'react-native-sound';

const { height } = Dimensions.get('window');
Sound.setCategory('Playback');

const DashboardScreen = ({ navigation }: any) => {
  const [drawer, setDrawer] = useState(false);
  const carSource = require('../../assets/images/car.png');
  const { user } = useSelector((state: RootState) => state.auth);
  const isPaid = user?.is_paid;

  const onClose = () => setDrawer(false);

  const { openPaywall, isProfileLoading } = usePaywall({ onClose });

  return (
    <View style={styles.root}>
      <PageLoader visible={isProfileLoading} />
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
              onPress={() => navigation.navigate(PATHS.Camera)}
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
            onPress={() => navigation.navigate(PATHS.CaptureInstruction)}
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
