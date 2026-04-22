import {
  Calendar,
  Camera,
  ChevronLeft,
  Clock3,
  Image as ImageIcon,
  RefreshCcw,
} from 'lucide-react-native';
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
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Toast from 'react-native-toast-message';
import SafeAreaWrapper from '../../components/safe-area-wrapper';
import AppText from '../../components/ui/app-text';
import {
  GradientButton,
  OutlineButton,
} from '../../components/ui/gradient-button';
import { useCameraPermission } from '../../hooks/use-camera-permission';
import { useGalleryPermission } from '../../hooks/use-gallery-permission';
import { PATHS } from '../../navigation/paths';
import { HomeScreenProps } from '../../navigation/types';
import { useUploadCustomImageMutation } from '../../store/api/uploadApi';
import { Colors, Gradient } from '../../utils/colors';
import {
  formatDateToYYYYMMDD,
  formatDateToMMDDYYYY,
  formatTimeToAMPM,
  pickerOptions,
  uriFromResponse,
} from '../../utils/helpers';

const { height } = Dimensions.get('window');

const CameraScreen = ({ navigation }: HomeScreenProps) => {
  const [uploadImage, { isLoading }] = useUploadCustomImageMutation();
  const { requestCameraPermission } = useCameraPermission();
  const { requestGalleryPermission } = useGalleryPermission();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const onSelectImage = (uri: string) => {
    setSelectedImage(uri);
  };

  const openCamera = async () => {
    const ok = await requestCameraPermission();
    if (!ok) return;
    launchCamera(
      { ...pickerOptions, saveToPhotos: Platform.OS === 'ios' },
      res => {
        if (res.didCancel) return;
        if (res.errorCode) {
          Alert.alert('Camera Error', res.errorMessage || res.errorCode);
          return;
        }
        const uri = uriFromResponse(res);
        if (uri) onSelectImage(uri);
      },
    );
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
        type: 'error',
        text1: 'Required Fields',
        text2: 'Please select Date and Time before uploading.',
      });
      return;
    }
    const dayFromDate = selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
    });
    try {
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
      formData.append('timezone', 'PST');
      formData.append('day', dayFromDate);
      formData.append('date', formatDateToYYYYMMDD(selectedDate));
      formData.append('time', formatTimeToAMPM(time));
      const result = await uploadImage({ formData }).unwrap();
      if (result?.status === true) {
        navigation.navigate(PATHS.Result, {
          id: result?.id,
          variant: result?.park_status ? 'resolve' : 'reject',
          summarize_message: result?.summarize_message,
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
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Upload Failed',
        text2: 'There was an issue uploading your image. Please try again.',
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
          <View>
            <AppText font="bold" size={32} align="center" color={Colors.white}>
              Park Clear
            </AppText>
            <AppText align="center" color={Colors.white}>
              Snap a photo of any parking sign. Our AI will analyze it instantly.
            </AppText>
          </View>
          <View style={styles.dateTimePickerContainer}>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setDatePickerVisibility(true)}
            >
              <Calendar size={20} color={Gradient.colors[0]} />
              <AppText color={Colors.header}>
                {formatDateToMMDDYYYY(selectedDate)}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setTimePickerVisibility(true)}
            >
              <Clock3 size={20} color={Gradient.colors[0]} />
              <AppText color={Colors.header}>{formatTimeToAMPM(time)}</AppText>
            </TouchableOpacity>
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
                  onPress={openCamera}
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
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        modalStyleIOS={{ margin: 'auto' }}
        onConfirm={(date: Date) => {
          setSelectedDate(date);
          setDatePickerVisibility(false);
        }}
        onCancel={() => setDatePickerVisibility(false)}
      />
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        modalStyleIOS={{ margin: 'auto' }}
        onConfirm={(selectedTime: Date) => {
          setTime(selectedTime);
          setTimePickerVisibility(false);
        }}
        onCancel={() => setTimePickerVisibility(false)}
      />
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  dateTimePickerContainer: {
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
    backgroundColor: Colors.lightGrey,
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
});
