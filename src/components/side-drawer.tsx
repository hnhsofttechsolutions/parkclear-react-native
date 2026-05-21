import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Bell, CpuIcon, HomeIcon } from 'lucide-react-native';
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
import Purchases from 'react-native-purchases';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import BackArrowIcon from '../assets/images/back_arrow.svg';
import CancelIcon from '../assets/images/cancel_circle.svg';
import GalleryIcon from '../assets/images/gallery.svg';
import LogoutIcon from '../assets/images/logout.svg';
import MyProfileIcon from '../assets/images/my_profile.svg';
import SettingsIcon from '../assets/images/settings.svg';
import UpgradeIcon from '../assets/images/upgrade.svg';
import { FlutterStrings } from '../constants/flutterStrings';
import { PATHS } from '../navigation/paths';
import { baseApi } from '../store/api/baseApi';
import { logout } from '../store/slices/authSlice';
import { RootState } from '../store/store';
import { Colors } from '../utils/colors';
import DeleteModal from './modals/delete-modal';
import DrawerRow from './settings/drawer-row';
import PageLoader from './ui/page-loader';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.82;
const DRAWER_MS = 320;

export default function SideDrawer({ drawer, setDrawer, navigation }: any) {
  const dispatch = useDispatch();
  const anim = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(drawer);
  const [isLogoutModal, setIsLogoutModal] = useState(false);
  const [pendingLogoutModal, setPendingLogoutModal] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const isPaid = user?.is_paid;
  const [logoutLoading, setLogoutLoading] = useState(false);

  const onClose = () => setDrawer(false);

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
        if (finished) {
          setModalVisible(false);
          if (pendingLogoutModal) {
            setPendingLogoutModal(false);
            setIsLogoutModal(true);
          }
        }
      });
    }
  }, [drawer, anim, pendingLogoutModal]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-DRAWER_WIDTH, 0],
  });

  const backdropOpacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  if (!modalVisible && !isLogoutModal && !pendingLogoutModal) return null;

  const navigateTo = (path: string) => {
    onClose();
    navigation.navigate(path);
  };

  const handlerLogout = async () => {
    setLogoutLoading(true);
    try {
      await GoogleSignin.signOut();

      if (!(await Purchases.isAnonymous())) {
        await Purchases.logOut();
      }

      dispatch(logout());
      dispatch(baseApi.util.resetApiState());

      console.log('Logged out successfully');
    } catch (e) {
      console.log('Logout error', e);
    } finally {
      setLogoutLoading(false);
    }
  };

  const handleGallery = () => {
    if (isPaid) {
      navigateTo(PATHS.Gallery);
    } else {
      navigateTo(PATHS.Subscription);
    }
  };

  return (
    <>
      <Modal
        transparent
        visible={modalVisible}
        onRequestClose={onClose}
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
              onPress={onClose}
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
                <TouchableOpacity onPress={onClose} style={styles.drawerClose}>
                  <BackArrowIcon width={40} height={40} />
                </TouchableOpacity>
                <View style={{ height: 20 }} />
                <DrawerRow
                  icon={<HomeIcon color="white" size={25} />}
                  label="Home"
                  onPress={onClose}
                />
                <DrawerRow
                  icon={<GalleryIcon width={25} height={25} />}
                  label={FlutterStrings.gallery}
                  onPress={handleGallery}
                />
                <DrawerRow
                  icon={<MyProfileIcon width={25} height={25} />}
                  label={FlutterStrings.myProfile}
                  onPress={() => navigateTo(PATHS.MyProfile)}
                />
                {!isPaid && (
                  <DrawerRow
                    icon={<UpgradeIcon width={25} height={25} />}
                    label="ParkClear Pro"
                    onPress={() => navigateTo(PATHS.SubscriptionFeature)}
                  />
                )}
                <DrawerRow
                  icon={<SettingsIcon width={25} height={25} />}
                  label={FlutterStrings.settings}
                  onPress={() => navigateTo(PATHS.Settings)}
                />
                {isPaid && (
                  <DrawerRow
                    icon={<Bell color="white" size={25} />}
                    label={FlutterStrings.activeAlerts}
                    onPress={() => navigateTo(PATHS.ActiveAlert)}
                  />
                )}
                <DrawerRow
                  icon={<CpuIcon color="white" size={25} />}
                  label={'Beta'}
                  onPress={() => navigateTo(PATHS.Beta)}
                />
                <View style={{ flex: 1 }} />
                <DrawerRow
                  icon={<LogoutIcon width={25} height={25} />}
                  label="Logout"
                  onPress={() => {
                    setPendingLogoutModal(true);
                    setDrawer(false);
                  }}
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
        onClose={() => {
          setIsLogoutModal(false);
          setPendingLogoutModal(false);
        }}
        onDelete={handlerLogout}
        isLoading={logoutLoading}
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
});
