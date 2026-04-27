import { ChevronLeft } from 'lucide-react-native';
import moment from "moment-timezone";
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import SafeAreaWrapper from '../../components/safe-area-wrapper';
import AppText from '../../components/ui/app-text';
import PageLoader from '../../components/ui/page-loader';
import { useCameraPermission } from '../../hooks/use-camera-permission';
import { PATHS } from '../../navigation/paths';
import { useUploadImageMutation } from '../../store/api/uploadApi';
import { Colors } from '../../utils/colors';
import { pickerOptions, uriFromResponse } from '../../utils/helpers';

const { height, width } = Dimensions.get('window');

const CaptureInstructionScreen = ({ navigation, route }: any) => {
  const [uploadImage, { isLoading }] = useUploadImageMutation();
  const { requestCameraPermission } = useCameraPermission();
  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null);

  const openCamera = async () => {
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
        if (!uri) return;

        const from = route.params?.from;

        if (from === 'Camera') {
          navigation.navigate(PATHS.Camera, { capturedImageUri: uri });
          return;
        }

        setCapturedImageUri(uri);

        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const shortTZ = moment().tz(timezone).format("z");
        const formData = new FormData();
        const fileOBJ = {
          uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
          type: 'image/jpeg',
          name: 'parking_sign.jpg',
        };
        formData.append('file', fileOBJ);
        formData.append('timezone', shortTZ);

        try {
          const result = await uploadImage({ formData }).unwrap();
          if (result?.status === true) {
            navigation.navigate(PATHS.Result, {
              id: result?.id,
              variant: result?.park_status ? 'resolve' : 'reject',
              summarize_message: result?.summarize_message,
              endTime: result?.end_time,
              endTimeIso: result?.end_time_iso,
            });
          } else {
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: result?.message || 'Invalid image.',
            });
          }
        } catch (error: any) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: error?.message || 'Upload failed.',
          });
        }
      },
    );
  };

  return (
    <SafeAreaWrapper
      style={styles.safe}
      backgroundColor="#000000"
      statusBarStyle="light-content"
    >
      <PageLoader visible={isLoading} />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={22} color={Colors.darkBlue} />
        </TouchableOpacity>
      </View>
      <View style={styles.titleContainer}>
        <AppText font="semiBold" size={24} color={Colors.white} align="center">
          Capture Parking Sign
        </AppText>
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={
            capturedImageUri
              ? { uri: capturedImageUri }
              : require('../../assets/images/camera_placeholder.png')
          }
          style={styles.previewImage}
          resizeMode={capturedImageUri ? "cover" : "contain"}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.captureButtonOuter}
          activeOpacity={0.8}
          onPress={openCamera}
        >
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
      </View>
    </SafeAreaWrapper>
  );
};

export default CaptureInstructionScreen;

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    zIndex: 10,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: {
    width: width * 0.85,
    height: height * 0.5,
    borderRadius: 24,
  },
  footer: {
    paddingBottom: 40,
    alignItems: 'center',
    gap: 20,
  },
  captureButtonOuter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.white,
  },
});
