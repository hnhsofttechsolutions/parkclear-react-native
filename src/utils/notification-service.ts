import notifee, { AndroidImportance } from '@notifee/react-native';

export async function displayNotification(remoteMessage: any) {
  await notifee.requestPermission();
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });
  await notifee.displayNotification({
    title: remoteMessage?.notification?.title || 'No Title',
    body: remoteMessage?.notification?.body || 'No Body',
    android: {
      channelId,
      smallIcon: 'ic_launcher',
      pressAction: {
        id: 'default',
      },
    },
  });
}

