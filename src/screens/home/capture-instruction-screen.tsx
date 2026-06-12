import { ChevronLeft } from 'lucide-react-native';
import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-toast-message';
import SafeAreaWrapper from '../../components/safe-area-wrapper';
import AppText from '../../components/ui/app-text';
import PageLoader from '../../components/ui/page-loader';
import { useCameraPermission } from '../../hooks/use-camera-permission';
import { PATHS } from '../../navigation/paths';
import { processPickedImage } from '../../services/s3/processPickedImage';
import { uploadImagePickerOptions } from '../../utils/compressImage';
import { useUploadImageMutation } from '../../store/api/uploadApi';
import { Colors } from '../../utils/colors';

const { height, width } = Dimensions.get('window');

const CaptureInstructionScreen = ({ navigation, route }: any) => {
  const [uploadImage, { isLoading }] = useUploadImageMutation();
  const { requestCameraPermission } = useCameraPermission();
  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const routeParams = route.params ?? {};
  const from = routeParams.from;

  useEffect(() => {
    return () => {
      ImagePicker.clean()
        .then(() => {})
        .catch(() => {});
    };
  }, []);

  const uploadImageToS3 = async (uri: string) => {
    setIsUploading(true);
    setUploadStatus('Preparing image...');
    console.time('[CaptureInstruction] s3-pipeline');

    try {
      const result = await processPickedImage(uri, setUploadStatus);
      console.timeEnd('[CaptureInstruction] s3-pipeline');
      console.log('[CaptureInstruction] s3Url ---->', result?.s3Url);

      // Toast.show({
      //   type: 'success',
      //   text1: 'Upload Complete',
      //   text2: 'Image uploaded to S3 successfully.',
      // });

      return result;
    } catch (error: any) {
      console.timeEnd('[CaptureInstruction] s3-pipeline');
      console.log('[CaptureInstruction] S3 upload error ---->', error);
      Toast.show({
        type: 'error',
        text1: 'S3 Upload Failed',
        text2: error?.message || 'Could not upload image to S3.',
      });
      return null;
    } finally {
      setIsUploading(false);
      setUploadStatus('');
    }
  };

  const uploadImageToApi = async (s3Url: string) => {
    console.time('[CaptureInstruction] api-call');
    console.log('[CaptureInstruction] api file_url ---->', s3Url);

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const shortTZ = moment().tz(timezone).format('z');
    const formData = new FormData();

    formData.append('file_url', s3Url);
    formData.append('timezone', shortTZ);

    const result = await uploadImage({ formData }).unwrap();
    console.timeEnd('[CaptureInstruction] api-call');
    console.log('[CaptureInstruction] api result ---->', result);

    if (result?.status === true) {
      navigation.navigate(PATHS.Result, {
        data: result,
        screen_name: 'capture',
      });
      return;
    }

    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: result?.message || 'Invalid image.',
    });
  };

  const openCamera = async () => {
    console.time('[CaptureInstruction] open-camera-total');
    const ok = await requestCameraPermission();
    if (!ok) {
      console.timeEnd('[CaptureInstruction] open-camera-total');
      return;
    }

    try {
      console.time('[CaptureInstruction] camera-capture');
      const res = await ImagePicker.openCamera(uploadImagePickerOptions);
      console.timeEnd('[CaptureInstruction] camera-capture');

      const uri = res?.path;
      if (!uri) {
        console.timeEnd('[CaptureInstruction] open-camera-total');
        return;
      }
      console.log('[CaptureInstruction] captured uri ---->', uri);

      const uploadResult = await uploadImageToS3(uri);
      if (!uploadResult?.s3Url) {
        console.timeEnd('[CaptureInstruction] open-camera-total');
        return;
      }
      const previewUri = uploadResult.s3Url;
      console.log('[CaptureInstruction] preview s3Url ---->', previewUri);

      if (from === 'Camera') {
        console.timeEnd('[CaptureInstruction] open-camera-total');
        navigation.navigate(PATHS.Camera, {
          capturedImageUri: previewUri,
          capturedS3Url: uploadResult.s3Url,
        });
        return;
      }

      setCapturedImageUri(previewUri);

      try {
        await uploadImageToApi(uploadResult.s3Url);
      } catch (error: any) {
        console.log('[CaptureInstruction] api error ---->', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error?.data?.message || error?.message || 'Upload failed.',
        });
      }
      console.timeEnd('[CaptureInstruction] open-camera-total');
    } catch (err: any) {
      console.timeEnd('[CaptureInstruction] camera-capture');
      console.timeEnd('[CaptureInstruction] open-camera-total');
      console.log('[CaptureInstruction] camera error ---->', err);
      Toast.show({
        type: 'error',
        text1: 'Camera Error',
        text2: 'Could not open camera. Please try again.',
      });
    }
  };

  const loaderMessage = isUploading
    ? uploadStatus
    : isLoading
    ? 'Analyzing parking sign...'
    : '';

  return (
    <SafeAreaWrapper
      style={styles.safe}
      backgroundColor="#000000"
      statusBarStyle="light-content"
    >
      <PageLoader visible={isUploading || isLoading} message={loaderMessage} />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
          disabled={isUploading || isLoading}
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
          resizeMode={capturedImageUri ? 'cover' : 'contain'}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.captureButtonOuter}
          activeOpacity={0.8}
          onPress={openCamera}
          disabled={isUploading || isLoading}
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
