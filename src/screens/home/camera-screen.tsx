import {
  Camera,
  ChevronLeft,
  Image as ImageIcon,
  RefreshCcw,
} from 'lucide-react-native';
import moment from 'moment';
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
import { launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import CustomDatePicker from '../../components/modals/CustomDatePicker';
import SafeAreaWrapper from '../../components/safe-area-wrapper';
import AppText from '../../components/ui/app-text';
import {
  GradientButton,
  OutlineButton,
} from '../../components/ui/gradient-button';
import { useGalleryPermission } from '../../hooks/use-gallery-permission';
import { PATHS } from '../../navigation/paths';
import { useUploadCustomImageMutation } from '../../store/api/uploadApi';
import { Colors, Gradient } from '../../utils/colors';
import {
  formatDateToYYYYMMDD,
  formatTimeToAMPM,
  pickerOptions,
  uriFromResponse,
} from '../../utils/helpers';

const { height } = Dimensions.get('window');

const CameraScreen = ({ navigation, route }: any) => {
  const [uploadImage, { isLoading }] = useUploadCustomImageMutation();
  const { requestGalleryPermission } = useGalleryPermission();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);

  React.useEffect(() => {
    if (route.params?.capturedImageUri) {
      setSelectedImage(route.params.capturedImageUri);
      navigation.setParams({ capturedImageUri: undefined });
    }
  }, [route.params?.capturedImageUri, navigation]);

  const onSelectImage = (uri: string) => {
    setSelectedImage(uri);
  };

  const openGallery = async () => {
    const ok = await requestGalleryPermission();
    if (!ok) return;
    launchImageLibrary(pickerOptions, res => {
      if (res.didCancel) return;
      if (res.errorCode) {
        Alert.alert('Gallery Error', res.errorMessage || res.errorCode);
        return;
      }
      const uri = uriFromResponse(res);
      if (uri) onSelectImage(uri);
    });
  };

  const onUpload = async () => {
    if (!selectedImage) return;
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
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const shortTZ = moment().tz(timezone).format('z');
      const formData = new FormData();
      const fileOBJ = {
        uri:
          Platform.OS === 'android'
            ? selectedImage
            : selectedImage.replace('file://', ''),
        type: 'image/jpeg',
        name: 'parking_sign.jpg',
      };
      formData.append('file', fileOBJ);
      formData.append('timezone', shortTZ);
      formData.append('day', dayFromDate);
      formData.append('date', formatDateToYYYYMMDD(selectedDate));
      formData.append('time', formatTimeToAMPM(time));
      const result = await uploadImage({ formData }).unwrap();
      console.log('formData camera screen---->', formData);
      console.log('result camera screen---->', result);
      if (result?.status === true) {
        navigation.navigate(PATHS.Result, {
          id: result?.id,
          variant: result?.park_status ? 'resolve' : 'reject',
          summarize_message: result?.summarize_message,
          endTime: result?.end_time,
          endTimeIso: result?.end_time_iso,
        });
        setSelectedImage(null);
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
      console.log('error upload -----', error);
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
                      onCapture: (uri: string) => setSelectedImage(uri),
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
                  onPress={() => (isLoading ? null : setSelectedImage(null))}
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
