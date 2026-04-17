import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import GalleryFabIcon from '../assets/images/gallery_circle.svg';
import HamburgerIcon from '../assets/images/hamburger_menu.svg';
import ProfileIcon from '../assets/images/my_profile_circle.svg';
import ShareIcon from '../assets/images/share_img.svg';
import CurrentTime from '../components/current-time';
import SafeAreaWrapper from '../components/safe-area-wrapper';
import SideDrawer from '../components/side-drawer';
import { GradientButton } from '../components/ui/gradient-button';
import PageLoader from '../components/ui/page-loader';
import { useCameraPermission } from '../hooks/use-camera-permission';
import { PATHS } from '../navigation/paths';
import { useUploadImageMutation } from '../store/api/uploadApi';
import { Colors } from '../utils/colors';
import { pickerOptions, shareApp, uriFromResponse } from '../utils/helpers';

const { height } = Dimensions.get('window');

const DashboardScreen = ({ navigation }: any) => {
  const [drawer, setDrawer] = useState(false);
  const carSource = require('../assets/images/car.png');
  const [uploadImage, { isLoading }] = useUploadImageMutation();
  const { requestCameraPermission } = useCameraPermission();

  const openCamera = async () => {
    // navigation.navigate(PATHS.Result, {
    //   variant: 'resolve',
    //   summarize_message:
    //     'Simulate a full red team engagement against your application -- probe for exploitable vulnerabilities across authentication, database, edge functions, and client-side code, then deliver a security score with prioritized remediation steps Simulate a full red team engagement against your application -- probe for exploitable vulnerabilities across authentication, database, edge functions, and client-side code, then deliver a security score with prioritized remediation steps',
    // });
    const ok = await requestCameraPermission();
    if (!ok) return;
    launchCamera(
      { ...pickerOptions, saveToPhotos: Platform.OS === 'ios' },
      async res => {
        if (res.didCancel) return;
        if (res.errorCode) {
          Alert.alert('Camera Error', res.errorMessage || res.errorCode);
          return;
        }
        const uri = uriFromResponse(res);
        if (!uri) {
          return;
        }
        const formData = new FormData();
        const fileOBJ = {
          uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
          type: 'image/jpeg',
          name: 'parking_sign.jpg',
        };
        formData.append('file', fileOBJ);
        formData.append('timezone', 'EST');
        const result = await uploadImage({ formData }).unwrap();
        if (result?.status === true) {
          navigation.navigate(PATHS.Result, {
            variant: result?.park_status ? 'resolve' : 'reject',
            summarize_message: result?.summarize_message,
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: result?.message || 'Invalid image.',
          });
        }
      },
    );
  };

  return (
    <View style={styles.root}>
      <PageLoader visible={isLoading} />
      <LinearGradient
        colors={[Colors.gradientStart, Colors.darkBlue]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaWrapper
        style={styles.safe}
        backgroundColor="transparent"
        statusBarStyle="light-content"
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() => setDrawer(true)}
            activeOpacity={0.85}
          >
            <HamburgerIcon width={45} height={45} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate(PATHS.Gallery)}
            activeOpacity={0.85}
          >
            <GalleryFabIcon width={45} height={45} />
          </TouchableOpacity>
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
          <GradientButton label="Can I Park Here?" onPress={openCamera} />
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
