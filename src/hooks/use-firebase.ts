import { useEffect, useState } from 'react';
import {
  AuthorizationStatus,
  FirebaseMessagingTypes,
  getInitialNotification,
  getMessaging,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  onTokenRefresh,
  registerDeviceForRemoteMessages,
  requestPermission,
} from '@react-native-firebase/messaging';
import { AppState, PermissionsAndroid, Platform } from 'react-native';
import {
  displayNotification,
  setupNotificationChannel,
  syncIosBadgeWithActiveAlerts,
} from '../utils/notification-service';
import {
  getCachedFcmToken,
  setCachedFcmToken,
  subscribeFcmToken,
} from '../utils/fcm-token';

const messaging = getMessaging();

let fcmInitPromise: Promise<void> | null = null;

const requestNotificationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    if (Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }

    return true;
  }

  const authStatus = await requestPermission(messaging);
  return (
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL
  );
};

const initFcm = async () => {
  try {
    const permission = await requestNotificationPermission();
    console.log('[FCM] permission granted:', permission);

    if (!permission) {
      console.warn('[FCM] Notification permission denied — token not fetched');
      return;
    }

    await setupNotificationChannel();

    if (Platform.OS === 'ios') {
      await registerDeviceForRemoteMessages(messaging);
      await syncIosBadgeWithActiveAlerts();
    }

    const token = await getToken(messaging);
    console.log('[FCM] token', token);
    setCachedFcmToken(token);
  } catch (error) {
    console.error('[FCM] init failed', error);
  }
};

const ensureFcmInitialized = () => {
  if (!fcmInitPromise) {
    fcmInitPromise = initFcm();
  }

  return fcmInitPromise;
};

type UseFirebaseReturn = {
  fcmToken: string | null;
  permissionGranted: boolean;
  foregroundNotification: FirebaseMessagingTypes.RemoteMessage | null;
  backgroundNotification: FirebaseMessagingTypes.RemoteMessage | null;
  quitNotification: FirebaseMessagingTypes.RemoteMessage | null;
};

export const useFirebase = (): UseFirebaseReturn => {
  const [fcmToken, setFcmToken] = useState<string | null>(getCachedFcmToken());
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);

  const [foregroundNotification, setForegroundNotification] =
    useState<FirebaseMessagingTypes.RemoteMessage | null>(null);

  const [backgroundNotification, setBackgroundNotification] =
    useState<FirebaseMessagingTypes.RemoteMessage | null>(null);

  const [quitNotification, setQuitNotification] =
    useState<FirebaseMessagingTypes.RemoteMessage | null>(null);

  useEffect(() => {
    const unsubscribeToken = subscribeFcmToken(setFcmToken);

    void ensureFcmInitialized().then(async () => {
      setPermissionGranted(Boolean(getCachedFcmToken()));

      try {
        const initialNotif = await getInitialNotification(messaging);
        if (initialNotif) {
          setQuitNotification(initialNotif);
        }
      } catch (error) {
        console.error('[FCM] getInitialNotification failed', error);
      }
    });

    const unsubscribeForeground = onMessage(
      messaging,
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        console.log('[FCM] foreground message', remoteMessage);
        setForegroundNotification(remoteMessage);
        await displayNotification(remoteMessage, 'foreground');
      },
    );

    const unsubscribeBackground = onNotificationOpenedApp(
      messaging,
      (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        console.log('[FCM] opened from background', remoteMessage);
        setBackgroundNotification(remoteMessage);
      },
    );

    const unsubscribeTokenRefresh = onTokenRefresh(
      messaging,
      (token: string) => {
        console.log('[FCM] token refreshed', token);
        setCachedFcmToken(token);
      },
    );

    const appStateSub = AppState.addEventListener('change', nextState => {
      if (nextState === 'active' && Platform.OS === 'ios') {
        syncIosBadgeWithActiveAlerts();
      }
    });

    return () => {
      unsubscribeToken();
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
