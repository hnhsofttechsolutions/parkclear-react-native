/**
 * @format
 */

import messaging from '@react-native-firebase/messaging';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { displayNotification } from './src/utils/notification-service';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  await displayNotification(remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
