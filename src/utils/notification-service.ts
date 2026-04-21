import notifee, { AndroidImportance } from '@notifee/react-native';

export async function displayNotification(remoteMessage: any) {
  const title = remoteMessage?.notification?.title;
  const body = remoteMessage?.notification?.body;

  if (!title || !body) {
    return;
  }

  await notifee.requestPermission();
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });
  await notifee.displayNotification({
    title: title,
    body: body,
    android: {
      channelId,
      smallIcon: 'ic_launcher',
      pressAction: {
        id: 'default',
      },
    },
  });
}
