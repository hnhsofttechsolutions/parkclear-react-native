import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import ProfileIcon from '../../assets/images/my_profile_circle.svg';
import ShareIcon from '../../assets/images/share_img.svg';
import CurrentTime from '../../components/current-time';
import SafeAreaWrapper from '../../components/safe-area-wrapper';
import { GradientButton } from '../../components/ui/gradient-button';
import PageLoader from '../../components/ui/page-loader';
import { PATHS } from '../../navigation/paths';
import { Colors } from '../../utils/colors';
import { shareApp } from '../../utils/helpers';
import { useCurrentLocation } from '../../utils/useCurrentLocation';
import { useBetaCanIParkHereMutation } from '../../store/api/uploadApi';
import moment from 'moment';
import Toast from 'react-native-toast-message';
const { height } = Dimensions.get('screen');

const LOADER_GIF = require('../../assets/images/loader.gif');
const CAR_GOING_GIF = require('../../assets/images/car_going.gif');
const CAR_STATIC = require('../../assets/images/car.png');

type CarVisualState = 'idle' | 'loading' | 'success';

const BetaScreen = () => {
  const navigation = useNavigation<any>();
  const { location, error, loading, fetchLocation } = useCurrentLocation();
  const [apiSuccess, setApiSuccess] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const hasCalledApi = useRef(false);
  const navigateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [betaCanIParkHere, { isLoading: isApiLoading }] =
    useBetaCanIParkHereMutation();

  useEffect(() => {
    return () => {
      if (navigateTimeoutRef.current) {
        clearTimeout(navigateTimeoutRef.current);
      }
    };
  }, []);

  const handleCanIParkHere = useCallback(async () => {
    if (location?.latitude == null || location?.longitude == null) {
      return;
    }

    if (navigateTimeoutRef.current) {
      clearTimeout(navigateTimeoutRef.current);
      navigateTimeoutRef.current = null;
    }

    setIsChecking(true);
    setApiSuccess(false);

    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const shortTZ = moment().tz(timezone).format('z');
      const formData = new FormData();
      formData.append('lat', location.latitude.toString());
      formData.append('longitude', location.longitude.toString());
      formData.append('timezone', shortTZ);

      // formData.append('lat', '34.044673'); // no parking
      // formData.append('longitude', '-118.238115'); // no parking

      // formData.append('lat', '34.0464336'); //  yes parking
      // formData.append('longitude', '-118.2421487'); // yes parking
      // formData.append('timezone', 'PST');

      const response = await betaCanIParkHere({ formData }).unwrap();

      if (response?.status && response?.park_status) {
        setIsChecking(false);
        setApiSuccess(true);
        navigateTimeoutRef.current = setTimeout(() => {
          navigation.navigate(PATHS.Result, {
            data: response,
            screen_name: 'beta',
          });
          setApiSuccess(false);
          navigateTimeoutRef.current = null;
        }, 1500);
        return;
      } else if (response?.status && !response?.park_status) {
        setApiSuccess(false);
        navigation.navigate(PATHS.Result, {
          data: response,
          screen_name: 'beta',
        });
        setApiSuccess(false);
        navigateTimeoutRef.current = null;
      } else {
        setApiSuccess(false);
        navigation.navigate(PATHS.CaptureInstruction, {
          from: 'Beta',
        });
      }
    } catch (err: any) {
      console.log('error beta------->', err);
      setApiSuccess(false);
      Toast.show({
        type: 'info',
        text2: err.data?.message || 'Something went wrong',
      });
    } finally {
      setIsChecking(false);
    }
  }, [betaCanIParkHere, location, navigation]);

  const runParkingCheck = useCallback(() => {
    setApiSuccess(false);
    hasCalledApi.current = false;

    if (location?.latitude != null && location?.longitude != null && !loading) {
      hasCalledApi.current = true;
      handleCanIParkHere();
      return;
    }

    fetchLocation();
  }, [fetchLocation, handleCanIParkHere, loading, location]);

  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Location',
        text2: error,
      });
    }
  }, [error]);

  useEffect(() => {
    if (
      location?.latitude != null &&
      location?.longitude != null &&
      !loading &&
      !hasCalledApi.current
    ) {
      hasCalledApi.current = true;
      handleCanIParkHere();
    }
  }, [handleCanIParkHere, location, loading]);

  const isBusy = loading || isChecking || isApiLoading;

  const carVisualState: CarVisualState = apiSuccess
    ? 'success'
    : isBusy
    ? 'loading'
    : 'idle';

  const carImageSource =
    carVisualState === 'loading'
      ? LOADER_GIF
      : carVisualState === 'success'
      ? CAR_GOING_GIF
      : CAR_STATIC;

  console.log('carVisualState------->', carVisualState);

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={Colors.gradientStart} />
      <LinearGradient
        colors={[Colors.gradientStart, Colors.darkBlue, Colors.darkBlue]}
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
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
          >
            <ChevronLeft size={30} color={Colors.darkBlue} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: height * 0.28 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.imageContainer}>
            <FastImage
              key={carVisualState}
              source={carImageSource}
              style={styles.car}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
          <CurrentTime />
        </ScrollView>
        <View style={styles.bottomCard}>
          <GradientButton
            label="Can I Park Here?"
            disabled={isBusy}
            // onPress={runParkingCheck}
            onPress={() => navigation.navigate(PATHS.ParkMap)}
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
    </View>
  );
};

export default BetaScreen;
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
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    paddingBottom: height * 0.28,
    alignItems: 'center',
  },
  imageContainer: {
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: height * 0.4,
  },
  car: {
    width: '100%',
    height: '100%',
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
  bannerDock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    backgroundColor: Colors.tabBg,
  },
});
