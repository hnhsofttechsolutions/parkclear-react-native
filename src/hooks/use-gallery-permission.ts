import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';

async function requestAndroidGallery(): Promise<boolean> {
  try {
    const permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
    const result = await PermissionsAndroid.request(permission);
    if (result === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }
    if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      Alert.alert(
        'Permission Required',
        'Gallery access is blocked. Please enable it from app settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ],
      );
    }
    return false;
  } catch {
    return false;
  }
}

export const useGalleryPermission = () => {
  const requestGalleryPermission = async () => {
    if (Platform.OS === 'android') {
      return requestAndroidGallery();
    }

    const permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
    const status = await check(permission);

    if (status === RESULTS.GRANTED) {
      return true;
    }

    if (status === RESULTS.DENIED) {
      const result = await request(permission);

      if (result === RESULTS.GRANTED) {
        return true;
      }

      if (result === RESULTS.BLOCKED) {
        Alert.alert(
          'Permission Required',
          'Gallery access is blocked. Please enable it from app settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => openSettings() },
          ],
        );
        return false;
      }
    }

    if (status === RESULTS.BLOCKED) {
      Alert.alert(
        'Permission Required',
        'Gallery access is blocked. Please enable it from app settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => openSettings() },
        ],
      );
      return false;
    }

    return false;
  };

  return { requestGalleryPermission };
};
