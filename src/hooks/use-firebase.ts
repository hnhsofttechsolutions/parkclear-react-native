import { useEffect, useState } from 'react';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { AppState, PermissionsAndroid, Platform } from 'react-native';
import {
  displayNotification,
  setupNotificationChannel,
  syncIosBadgeWithActiveAlerts,
} from '../utils/notification-service';

const requestNotificationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  const authStatus = await messaging().requestPermission();
  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
};

type UseFirebaseReturn = {
  fcmToken: string | null;
  permissionGranted: boolean;
  foregroundNotification: FirebaseMessagingTypes.RemoteMessage | null;
  backgroundNotification: FirebaseMessagingTypes.RemoteMessage | null;
  quitNotification: FirebaseMessagingTypes.RemoteMessage | null;
};

export const useFirebase = (): UseFirebaseReturn => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  // ✅ Correct types
  const [foregroundNotification, setForegroundNotification] =
    useState<FirebaseMessagingTypes.RemoteMessage | null>(null);

  const [backgroundNotification, setBackgroundNotification] =
    useState<FirebaseMessagingTypes.RemoteMessage | null>(null);

  const [quitNotification, setQuitNotification] =
    useState<FirebaseMessagingTypes.RemoteMessage | null>(null);

  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);

  useEffect(() => {
    // 1. Quit
    const init = async () => {
      const permission = await requestNotificationPermission();
      setPermissionGranted(permission);

      if (permission) {
        await setupNotificationChannel();
        if (Platform.OS === 'ios') {
          await messaging().registerDeviceForRemoteMessages();
          await syncIosBadgeWithActiveAlerts();
        }
      }

      if (!permission) return;
      const token = await messaging().getToken();
      setFcmToken(token);
      const initialNotif = await messaging().getInitialNotification();
      if (initialNotif) {
        setQuitNotification(initialNotif);
      }
    };
    init();

    // 2. Foreground
    const unsubscribeForeground = messaging().onMessage(
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        setForegroundNotification(remoteMessage);
        await displayNotification(remoteMessage, 'foreground');
      },
    );

    // 3. Background
    const unsubscribeBackground = messaging().onNotificationOpenedApp(
      (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        setBackgroundNotification(remoteMessage);
      },
    );

    // Token refresh
    const unsubscribeTokenRefresh = messaging().onTokenRefresh(
      (token: string) => {
        setFcmToken(token);
      },
    );

    const appStateSub = AppState.addEventListener('change', nextState => {
      if (nextState === 'active' && Platform.OS === 'ios') {
        syncIosBadgeWithActiveAlerts();
      }
    });

    return () => {
      unsubscribeForeground();
      unsubscribeBackground();
      unsubscribeTokenRefresh();
      appStateSub.remove();
    };
  }, []);

  return {
    fcmToken,
    permissionGranted,
    foregroundNotification,
    backgroundNotification,
    quitNotification,
  };
};
