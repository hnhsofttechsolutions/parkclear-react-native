import {
  Camera,
  ChevronLeft,
  Image as ImageIcon,
  RefreshCcw,
} from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import CustomDatePicker from '../../components/modals/CustomDatePicker';
import SafeAreaWrapper from '../../components/safe-area-wrapper';
import AppText from '../../components/ui/app-text';
import PageLoader from '../../components/ui/page-loader';
import {
  GradientButton,
  OutlineButton,
} from '../../components/ui/gradient-button';
import { PATHS } from '../../navigation/paths';
import { processPickedImage } from '../../services/s3/processPickedImage';
import { uploadImagePickerOptions } from '../../utils/compressImage';
import { useUploadCustomImageMutation } from '../../store/api/uploadApi';
import { Colors, Gradient } from '../../utils/colors';
import { formatDateToYYYYMMDD, formatTimeToAMPM } from '../../utils/helpers';

const { height } = Dimensions.get('window');

const CameraScreen = ({ navigation, route }: any) => {
  const [uploadImage, { isLoading }] = useUploadCustomImageMutation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedS3Url, setSelectedS3Url] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  useFocusEffect(
    useCallback(() => {
      const imageUri = route.params?.capturedImageUri;
      const s3Url = route.params?.capturedS3Url;

      if (imageUri) {
        setSelectedImage(imageUri);
      }
      if (s3Url) {
        setSelectedS3Url(s3Url);
      }
      if (imageUri || s3Url) {
        navigation.setParams({
          capturedImageUri: undefined,
          capturedS3Url: undefined,
        });
      }
    }, [
      route.params?.capturedImageUri,
      route.params?.capturedS3Url,
      navigation,
    ]),
  );

  useEffect(() => {
    return () => {
      ImagePicker.clean()
        .then(() => {})
        .catch(e => {
          console.log('error clean ---->', e);
        });
    };
  }, []);

  const onSelectImage = (uri: string, s3Url?: string | null) => {
    setSelectedImage(uri);
    setSelectedS3Url(s3Url ?? null);
  };

  const uploadImageToS3 = async (uri: string) => {
    setIsUploading(true);
    setUploadStatus('Preparing image...');
    console.time('[CameraScreen] s3-pipeline');

    try {
      const result = await processPickedImage(uri, setUploadStatus);
      console.timeEnd('[CameraScreen] s3-pipeline');
      console.log('[CameraScreen] s3Url ---->', result?.s3Url);

      // Toast.show({
      //   type: 'success',
      //   text1: 'Upload Complete',
      //   text2: 'Image uploaded to S3 successfully.',
      // });

      return result;
    } catch (error: any) {
      console.timeEnd('[CameraScreen] s3-pipeline');
      console.log('[CameraScreen] S3 upload error ---->', error);
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

  const openGallery = async () => {
    console.time('[CameraScreen] gallery-total');
    try {
      console.time('[CameraScreen] gallery-pick');
      const res = await ImagePicker.openPicker(uploadImagePickerOptions);
      console.timeEnd('[CameraScreen] gallery-pick');

      const uri = res?.path;
      if (!uri) {
        console.timeEnd('[CameraScreen] gallery-total');
        return;
      }
      console.log('[CameraScreen] gallery uri ---->', uri);

      const uploadResult = await uploadImageToS3(uri);
      if (!uploadResult?.s3Url) {
        console.timeEnd('[CameraScreen] gallery-total');
        return;
      }

      console.log('[CameraScreen] gallery s3Url ---->', uploadResult.s3Url);
      onSelectImage(uploadResult.s3Url, uploadResult.s3Url);
      console.timeEnd('[CameraScreen] gallery-total');
    } catch (err: any) {
      console.timeEnd('[CameraScreen] gallery-pick');
      console.timeEnd('[CameraScreen] gallery-total');
      if (err?.code === 'E_PICKER_CANCELLED') return;

      console.log('[CameraScreen] gallery error ---->', err);
      Toast.show({
        type: 'error',
        text1: 'Gallery Error',
        text2: 'Could not open gallery. Please try again.',
      });
    }
  };

  const onUpload = async () => {
    if (!selectedImage || !selectedS3Url) {
      Toast.show({
        type: 'info',
        text1: 'Image Required',
        text2: 'Please select an image before uploading.',
      });
      return;
    }
    if (!selectedDate || !time) {
      Toast.show({
        type: 'info',
        text1: 'Required Fields',
        text2: 'Please select Date and Time before uploading.',
      });
      return;
    }
    const dayFromDate = selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
    });
    try {
      console.time('[CameraScreen] api-call');
      console.log('[CameraScreen] api file_url ---->', selectedS3Url);

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const shortTZ = moment().tz(timezone).format('z');
      const formData = new FormData();
      formData.append('file_url', selectedS3Url);
      formData.append('timezone', shortTZ);
      formData.append('day', dayFromDate);
      formData.append('date', formatDateToYYYYMMDD(selectedDate));
      formData.append('time', formatTimeToAMPM(time));

      const result = await uploadImage({ formData }).unwrap();
      console.timeEnd('[CameraScreen] api-call');
      console.log('[CameraScreen] api result ---->', result);

      if (result?.status === true) {
        navigation.navigate(PATHS.Result, {
          data: result,
          screen_name: 'camera',
        });
        setSelectedImage(null);
        setSelectedS3Url(null);
        setSelectedDate(null);
        setTime(null);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: result?.message || 'Invalid image.',
        });
      }
    } catch (error: any) {
      console.timeEnd('[CameraScreen] api-call');
      console.log('[CameraScreen] api error ---->', error);
      Toast.show({
        type: 'error',
        text1: 'Upload Failed',
        text2:
          error?.data?.message ||
          'There was an issue uploading your image. Please try again.',
      });
    }
  };

  return (
    <View style={styles.root}>
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
        <PageLoader visible={isUploading} message={uploadStatus} />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft size={22} color={Colors.darkBlue} />
          </TouchableOpacity>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.scroll}>
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <AppText font="bold" size={32} align="center" color={Colors.white}>
              ParkClear
            </AppText>
            <AppText
              style={{
                fontSize: 15,
                width: '80%',
                alignSelf: 'center',
              }}
              align="center"
              color={Colors.white}
              font="regular"
              adjustsFontSizeToFit={true}
            >
              Customize a time and date, Our AI will analyze parking rules
              instantly.
            </AppText>
          </View>
          <View style={styles.dateTimePickerContainer}>
            <CustomDatePicker
              value={selectedDate?.toISOString()}
              onDateChange={setSelectedDate}
              mode="date"
              placeholder="Select Date"
              minimumDate={new Date()}
              containerStyle={styles.datePickerContainer}
            />
            <CustomDatePicker
              value={time?.toISOString()}
              onDateChange={setTime}
              mode="time"
              placeholder="Select Time"
              containerStyle={styles.datePickerContainer}
            />
          </View>
          <View style={styles.imageCard}>
            <Image
              // @ts-ignore
              source={{ uri: selectedImage }}
              style={styles.previewImage}
            />
          </View>
        </View>
        <View style={styles.bottomCard}>
          <View style={{ gap: 20 }}>
            {!selectedImage ? (
              <>
                <GradientButton
                  label="Open Camera"
                  onPress={() =>
                    navigation.navigate(PATHS.CaptureInstruction, {
                      from: 'Camera',
                    })
                  }
                  leftIcon={<Camera size={20} color={Colors.white} />}
                />
                <OutlineButton
                  label="Upload from Mobile"
                  onPress={openGallery}
                  leftIcon={<ImageIcon size={20} color={Gradient.colors[0]} />}
                />
              </>
            ) : (
              <>
                <GradientButton
                  label="Upload & Verify"
                  onPress={onUpload}
                  isLoading={isLoading}
                />
                <OutlineButton
                  label="Choose Different Image"
                  onPress={() => {
                    if (isLoading) return;
                    setSelectedImage(null);
                    setSelectedS3Url(null);
                  }}
                  leftIcon={<RefreshCcw size={16} color={Gradient.colors[0]} />}
                />
              </>
            )}
          </View>
        </View>
      </SafeAreaWrapper>
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  dateTimePickerContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },
  pickerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.textFieldBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  imageCard: {
    width: '100%',
    minHeight: 240,
    maxHeight: height * 0.4,
    borderRadius: 24,
    backgroundColor: Colors.white,
    overflow: 'hidden',
    shadowRadius: 12,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
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
  headerSpacer: {
    width: 42,
    height: 42,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: height * 0.34,
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 20,
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
  datePickerContainer: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
