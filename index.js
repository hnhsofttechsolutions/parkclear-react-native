/**
 * @format
 */

import notifee, { EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { displayNotification } from './src/utils/notification-service';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  await displayNotification(remoteMessage, 'background');
});

notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.PRESS) {
    console.log('Notification pressed (background)', detail);
  }
});

AppRegistry.registerComponent(appName, () => App);
