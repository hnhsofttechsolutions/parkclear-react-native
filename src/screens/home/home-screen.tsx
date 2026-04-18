import {
  Calendar,
  Camera,
  Image as ImageIcon,
  RefreshCcw,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DayModal from '../../components/modals/day-modal';
import SafeAreaWrapper from '../../components/safe-area-wrapper';
import AppText from '../../components/ui/app-text';
import { useCameraPermission } from '../../hooks/use-camera-permission';
import { useGalleryPermission } from '../../hooks/use-gallery-permission';
import { PATHS } from '../../navigation/paths';
import { HomeScreenProps } from '../../navigation/types';
import { useUploadImageMutation } from '../../store/api/uploadApi';
import { Colors, Gradient } from '../../utils/colors';
import {
  formatDateToYYYYMMDD,
  formatTimeToAMPM,
  pickerOptions,
  uriFromResponse,
} from '../../utils/helpers';
import {
  GradientButton,
  OutlineButton,
} from '../../components/ui/gradient-button';

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const [uploadImage] = useUploadImageMutation();
  const { requestCameraPermission } = useCameraPermission();
  const { requestGalleryPermission } = useGalleryPermission();

  const [activeTab, setActiveTab] = useState<'current' | 'custom'>('current');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [day, setDay] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [isDayPickerVisible, setDayPickerVisibility] = useState(false);
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
    if (activeTab === 'custom' && (!day || !selectedDate || !time)) {
      Alert.alert(
        'Required Fields',
        'Please select Day, Date and Time before uploading.',
      );
      return;
    }
    setUploading(true);
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
      if (activeTab === 'custom' && day && selectedDate && time) {
        formData.append('day', day);
        formData.append('date', formatDateToYYYYMMDD(selectedDate));
        formData.append('time', formatTimeToAMPM(time));
      }
      const url =
        activeTab === 'custom'
          ? 'analyze-parking-sign'
          : 'analyze-parking-sign-device';
      const result = await uploadImage({ formData, url }).unwrap();
      if (result?.status === true) {
        navigation.navigate(PATHS.Result, {
          variant: result?.park_status ? 'resolve' : 'reject',
          summarize_message: result?.summarize_message,
        });
        setSelectedImage(null);
        setDay(null);
        setSelectedDate(null);
        setTime(null);
      } else {
        Alert.alert('Error', result?.message || 'Something went wrong');
      }
    } catch {
      Alert.alert(
        'Upload Failed',
        'There was an issue uploading your image. Please try again.',
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <View style={{ marginTop: 24, marginBottom: 20 }}>
            <AppText
              font="bold"
              size={32}
              align="center"
              color={Gradient.colors[0]}
            >
              Park Clear
            </AppText>
            <AppText
              align="center"
              color={Colors.primary}
              style={{ marginTop: 8 }}
            >
              Snap a photo of any parking sign. Our AI will analyze it
              instantly.
            </AppText>
          </View>
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'current' && styles.activeTab]}
              onPress={() => setActiveTab('current')}
              activeOpacity={0.8}
            >
              <AppText
                font="medium"
                color={activeTab === 'current' ? Colors.white : Colors.primary}
              >
                Current Time
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'custom' && styles.activeTab]}
              onPress={() => setActiveTab('custom')}
              activeOpacity={0.8}
            >
              <AppText
                font="medium"
                color={activeTab === 'custom' ? Colors.white : Colors.primary}
              >
                Custom Time
              </AppText>
            </TouchableOpacity>
          </View>
          {activeTab === 'custom' && (
            <View style={styles.dateTimePickerContainer}>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setDayPickerVisibility(true)}
              >
                <Calendar size={20} color={Gradient.colors[0]} />
                <AppText color={Colors.header}>{day || 'Select Day'}</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setDatePickerVisibility(true)}
              >
                <Calendar size={20} color={Gradient.colors[0]} />
                <AppText color={Colors.header}>
                  {formatDateToYYYYMMDD(selectedDate)}
                </AppText>
              </TouchableOpacity>
            </View>
          )}
          {!selectedImage ? (
            <View style={styles.emptyState}>
              <AppText
                font="bold"
                size={20}
                color={Colors.primary}
                align="center"
              >
                Upload a Photo
              </AppText>
              <AppText size={15} color={Colors.primary} align="center">
                Choose a method below to capture your parking sign
              </AppText>
            </View>
          ) : (
            <View style={styles.imageCard}>
              <Image
                source={{ uri: selectedImage }}
                style={styles.previewImage}
              />
            </View>
          )}
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate(PATHS.Onboard)}
          style={styles.flutterLink}
          activeOpacity={0.75}
        >
          <AppText size={13} color={Colors.grey} align="center">
            Flutter app screens (UI only) →
          </AppText>
        </TouchableOpacity>
        <View style={styles.actionsBox}>
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
                isLoading={uploading}
              />
              <OutlineButton
                label="Choose Different Image"
                onPress={() => (uploading ? null : setSelectedImage(null))}
                leftIcon={<RefreshCcw size={16} color={Gradient.colors[0]} />}
              />
            </>
          )}
        </View>
      </View>
      <DayModal
        day={day}
        setDay={setDay}
        isDayPickerVisible={isDayPickerVisible}
        setDayPickerVisibility={setDayPickerVisibility}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        modalStyleIOS={{ margin: 'auto' }}
        onConfirm={(date: Date) => {
          setSelectedDate(date);
          setDatePickerVisibility(false);
          setTimePickerVisibility(true);
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
    </SafeAreaWrapper>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 10 : 24,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.tabBg,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: Gradient.colors[0],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateTimePickerContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  imageCard: {
    flex: 1,
    width: '100%',
    borderRadius: 24,
    backgroundColor: Colors.lightGrey,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.textFieldBorder,
    alignSelf: 'center',
    marginTop: 0,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  actionsBox: {
    width: '100%',
    gap: 14,
    paddingTop: 12,
    backgroundColor: 'transparent',
  },
  flutterLink: {
    paddingVertical: 8,
    marginTop: 4,
  },
});
