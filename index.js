/**
 * @format
 */

import notifee, { EventType } from '@notifee/react-native';
import {
  getMessaging,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';
import { AppRegistry, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import {
  displayNotification,
  setupNotificationChannel,
} from './src/utils/notification-service';

if (Platform.OS === 'android') {
  void setupNotificationChannel();
}

const messaging = getMessaging();

setBackgroundMessageHandler(messaging, async remoteMessage => {
  console.log('[FCM] background message', remoteMessage);
  try {
    await displayNotification(remoteMessage, 'background');
  } catch (error) {
    console.error('[FCM] background display failed', error);
  }
});

notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.PRESS) {
    console.log('Notification pressed (background)', detail);
  }
});

AppRegistry.registerComponent(appName, () => App);
