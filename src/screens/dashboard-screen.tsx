import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import SafeAreaWrapper from '../components/safe-area-wrapper';
import GalleryFabIcon from '../assets/images/gallery_circle.svg';
import HamburgerIcon from '../assets/images/hamburger_menu.svg';
import ProfileIcon from '../assets/images/my_profile_circle.svg';
import ShareIcon from '../assets/images/share_img.svg';
import SideDrawer from '../components/side-drawer';
import AppText from '../components/ui/app-text';
import { PATHS } from '../navigation/paths';
import { Colors } from '../utils/colors';
import { GradientButton } from '../components/ui/gradient-button';

const DashboardScreen = ({ navigation }: any) => {
  const [drawer, setDrawer] = useState(false);
  const carSource = require('../assets/images/car.png');

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.darkBlue]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaWrapper
        style={styles.safe}
        backgroundColor="transparent"
        statusBarStyle="dark-content"
      >
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => setDrawer(true)}
          activeOpacity={0.85}
        >
          <HamburgerIcon width={50} height={50} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.galleryFab}
          onPress={() => navigation.navigate(PATHS.Gallery)}
        >
          <GalleryFabIcon width={50} height={50} />
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Image source={carSource} style={styles.car} resizeMode="contain" />
          <AppText
            font="bold"
            size={28}
            color={Colors.white}
            align="center"
            style={{ marginTop: 20 }}
          >
            12:00 PM
          </AppText>
        </ScrollView>
        <View style={styles.bottomCard}>
          <GradientButton
            label="Can I Park Here?"
            onPress={() =>
              navigation.navigate(PATHS.Result, {
                variant: 'resolve',
                summarize_message: '**Demo** — Flutter dashboard CTA.',
              })
            }
          />
          <View style={styles.profileBtnContainer}>
            <TouchableOpacity
              style={styles.btnWhiteBg}
              onPress={() => setDrawer(true)}
              activeOpacity={0.85}
            >
              <ProfileIcon width={50} height={50} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnWhiteBg}
              onPress={() => navigation.navigate(PATHS.Gallery)}
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
  menuBtn: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 2,
    backgroundColor: Colors.white,
    borderRadius: 50,
  },
  galleryFab: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 2,
  },
  scroll: {
    paddingTop: 120,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  car: { width: 300, height: 280 },
  bottomCard: {
    backgroundColor: Colors.tabBg,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 20,
    height: '20%',
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
