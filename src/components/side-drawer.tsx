import { HomeIcon } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import BackArrowIcon from '../assets/images/back_arrow.svg';
import CancelIcon from '../assets/images/cancel_circle.svg';
import GalleryIcon from '../assets/images/gallery.svg';
import LogoutIcon from '../assets/images/logout.svg';
import MyProfileIcon from '../assets/images/my_profile.svg';
import RemoveAdsIcon from '../assets/images/remove_ads.svg';
import SettingsIcon from '../assets/images/settings.svg';
import { FlutterStrings } from '../constants/flutterStrings';
import { PATHS } from '../navigation/paths';
import { logout } from '../store/slices/authSlice';
import { RootState } from '../store/store';
import { Colors } from '../utils/colors';
import {
  handlePaywallResult,
  initRevenueCat,
  showPaywall,
} from '../utils/revenuecat-service';
import DeleteModal from './modals/delete-modal';
import DrawerRow from './settings/drawer-row';
import AppText from './ui/app-text';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.82;
const DRAWER_MS = 320;

export default function SideDrawer({ drawer, setDrawer, navigation }: any) {
  const dispatch = useDispatch();
  const anim = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(drawer);
  const [isLogoutModal, setIsLogoutModal] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (drawer) {
      setModalVisible(true);
      anim.stopAnimation();
      Animated.timing(anim, {
        toValue: 1,
        duration: DRAWER_MS,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }).start();
    } else {
      anim.stopAnimation();
      Animated.timing(anim, {
        toValue: 0,
        duration: DRAWER_MS,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setModalVisible(false);
      });
    }
  }, [drawer, anim]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-DRAWER_WIDTH, 0],
  });

  const backdropOpacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  if (!modalVisible) return null;

  const closeDrawer = () => setDrawer(false);

  const navigateTo = (path: string) => {
    closeDrawer();
    navigation.navigate(path);
  };

  const handlerLogout = () => {
    dispatch(logout());
    navigation.reset({
      index: 0,
      routes: [{ name: PATHS.LoginRegister }],
    });
  };

  const handleShowPaywall = async () => {
    try {
      await initRevenueCat(user?.id);
      const result = await showPaywall();
      handlePaywallResult(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal
        transparent
        visible={modalVisible}
        onRequestClose={closeDrawer}
        animationType="none"
        statusBarTranslucent
        navigationBarTranslucent
      >
        <View style={styles.container}>
          <Animated.View
            style={[styles.backdrop, { opacity: backdropOpacity }]}
          >
            <TouchableOpacity
              style={styles.fullFlex}
              activeOpacity={1}
              onPress={closeDrawer}
            />
          </Animated.View>
          <Animated.View
            style={[styles.drawerContent, { transform: [{ translateX }] }]}
          >
            <LinearGradient
              colors={[Colors.darkBlue, Colors.gradientStart]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.fullFlex}
            >
              <View style={styles.drawerPad}>
                <TouchableOpacity
                  onPress={closeDrawer}
                  style={styles.drawerClose}
                >
                  <BackArrowIcon width={40} height={40} />
                </TouchableOpacity>
                <View style={{ height: 20 }} />
                <DrawerRow
                  icon={<HomeIcon color="white" size={25} />}
                  label="Home"
                  onPress={closeDrawer}
                />
                <DrawerRow
                  icon={<GalleryIcon width={25} height={25} />}
                  label={FlutterStrings.gallery}
                  onPress={() => navigateTo(PATHS.Gallery)}
                />
                <DrawerRow
                  icon={<MyProfileIcon width={25} height={25} />}
                  label={FlutterStrings.myProfile}
                  onPress={() => navigateTo(PATHS.MyProfile)}
                />
                <TouchableOpacity
                  style={styles.removeAdsRow}
                  onPress={handleShowPaywall}
                >
                  <RemoveAdsIcon width={20} height={20} color="white" />
                  <AppText size={17} color="#FFFFFF" style={styles.rowText}>
                    {FlutterStrings.removeAds}
                  </AppText>
                  <View style={styles.trialBadge}>
                    <AppText
                      size={12}
                      color="#FFFFFF"
                      style={{ fontWeight: '700' }}
                    >
                      TRIAL
                    </AppText>
                  </View>
                </TouchableOpacity>
                <DrawerRow
                  icon={<SettingsIcon width={25} height={25} />}
                  label={FlutterStrings.settings}
                  onPress={() => navigateTo(PATHS.Settings)}
                />
                <DrawerRow
                  icon={<CancelIcon width={25} height={25} />}
                  label="Cancel Alerts"
                  onPress={closeDrawer}
                />
                <View style={{ flex: 1 }} />
                <DrawerRow
                  icon={<LogoutIcon width={25} height={25} />}
                  label="Logout"
                  onPress={() => setIsLogoutModal(true)}
                />
                <View style={{ height: 40 }} />
              </View>
            </LinearGradient>
          </Animated.View>
        </View>
      </Modal>
      <DeleteModal
        title="Are you sure want to log out of this account?"
        visible={isLogoutModal}
        onClose={() => setIsLogoutModal(false)}
        onDelete={handlerLogout}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullFlex: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  drawerContent: {
    width: DRAWER_WIDTH,
    height: '100%',
    backgroundColor: Colors.darkBlue,
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 20,
  },
  drawerPad: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 20,
    marginTop: 20,
  },
  drawerClose: {
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  removeAdsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    marginVertical: 4,
  },
  rowText: {
    marginLeft: 15,
    fontWeight: '400',
    letterSpacing: 0.3,
  },
  trialBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 20,
  },
});
