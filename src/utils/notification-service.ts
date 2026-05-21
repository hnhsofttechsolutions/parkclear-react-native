import notifee, { AndroidImportance } from '@notifee/react-native';
import { Platform } from 'react-native';
import { settingApi } from '../store/api/settingApi';
import { store } from '../store/store';

/** Android: res/raw/noti_tune.mp3 — filename without extension */
export const NOTIFICATION_CHANNEL_ID = 'parkclear_alerts';
const ANDROID_SOUND = 'noti_tune';
/** iOS bundle resource — must match Copy Bundle Resources + aps.sound on push */
export const IOS_NOTIFICATION_SOUND = 'noti_tune.caf';

let channelReady = false;

export async function setupNotificationChannel(): Promise<string> {
  if (channelReady) {
    return NOTIFICATION_CHANNEL_ID;
  }

  await notifee.requestPermission();
  await notifee.createChannel({
    id: NOTIFICATION_CHANNEL_ID,
    name: 'ParkClear Alerts',
    importance: AndroidImportance.HIGH,
    sound: ANDROID_SOUND,
  });
  channelReady = true;
  return NOTIFICATION_CHANNEL_ID;
}

type NotificationDisplayContext = 'foreground' | 'background';

/**
 * Foreground: Notifee shows alert + custom sound (iOS/Android).
 * Background/killed iOS: OS shows FCM notification — sound only if server sends
 *   apns.payload.aps.sound = "noti_tune.caf" (see fcm-ios-push-payload.ts).
 * Background Android: skip Notifee when FCM already includes `notification` (no duplicate).
 */
export function shouldDisplayWithNotifee(
  remoteMessage: any,
  context: NotificationDisplayContext,
): boolean {
  if (context === 'foreground') {
    return true;
  }

  if (Platform.OS === 'ios') {
    return remoteMessage?.notification == null;
  }

  return remoteMessage?.notification == null;
}

function parseBadgeFromMessage(remoteMessage: any): number | null {
  const data = remoteMessage?.data ?? {};
  for (const key of ['badge', 'badge_count', 'badgeCount', 'unread_count']) {
    const value = data[key];
    if (value != null && value !== '') {
      const count = Number.parseInt(String(value), 10);
      if (!Number.isNaN(count) && count >= 0) {
        return count;
      }
    }
  }

  const iosBadge = remoteMessage?.notification?.ios?.badge;
  if (typeof iosBadge === 'number' && iosBadge >= 0) {
    return iosBadge;
  }

  return null;
}

/** Match home-screen icon badge to active parking alerts. */
export async function syncIosBadgeWithActiveAlerts(): Promise<void> {
  if (Platform.OS !== 'ios') {
    return;
  }

  try {
    const result = await store
      .dispatch(
        settingApi.endpoints.getActiveAlerts.initiate(undefined, {
          forceRefetch: true,
        }),
      )
      .unwrap();

    const alerts: { is_active?: boolean; is_pass?: boolean }[] = Array.isArray(
      result,
    )
      ? result
      : result?.results ?? result?.data ?? [];

    const count = alerts.filter(
      alert => alert.is_active === true && alert.is_pass === false,
    ).length;
    await notifee.setBadgeCount(count);
  } catch {
    // Keep current badge if sync fails (offline, etc.)
  }
}

async function applyIosBadgeFromPush(
  remoteMessage: any,
  context: NotificationDisplayContext,
): Promise<void> {
  if (Platform.OS !== 'ios') {
    return;
  }

  const explicit = parseBadgeFromMessage(remoteMessage);
  if (explicit !== null) {
    await notifee.setBadgeCount(explicit);
    return;
  }

  // System already applied aps.badge for notification+alert background pushes.
  const systemHandled =
    context === 'background' && remoteMessage?.notification != null;
  if (systemHandled) {
    return;
  }

  await notifee.incrementBadgeCount();
}

function getNotificationContent(remoteMessage: any): {
  title?: string;
  body?: string;
} {
  const data = remoteMessage?.data ?? {};
  return {
    title:
      remoteMessage?.notification?.title ??
      data.title ??
      data.notification_title,
    body:
      remoteMessage?.notification?.body ??
      data.body ??
      data.notification_body ??
      data.message,
  };
}

export async function displayNotification(
  remoteMessage: any,
  context: NotificationDisplayContext = 'foreground',
) {
  console.log('displayNotification', remoteMessage, context);

  if (!shouldDisplayWithNotifee(remoteMessage, context)) {
    if (
      Platform.OS === 'ios' &&
      context === 'background' &&
      remoteMessage?.notification
    ) {
      console.warn(
        `[ParkClear] iOS background push has no custom sound unless server sends apns.payload.aps.sound = "${IOS_NOTIFICATION_SOUND}". See src/utils/fcm-ios-push-payload.ts`,
      );
    }
    await applyIosBadgeFromPush(remoteMessage, context);
    return;
  }

  const { title, body } = getNotificationContent(remoteMessage);

  if (!title || !body) {
    return;
  }

  const channelId = await setupNotificationChannel();
  const badgeCount = parseBadgeFromMessage(remoteMessage);

  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId,
      sound: ANDROID_SOUND,
      smallIcon: 'ic_launcher',
      pressAction: {
        id: 'default',
      },
    },
    ios: {
      sound: IOS_NOTIFICATION_SOUND,
      ...(badgeCount !== null ? { badgeCount } : {}),
      foregroundPresentationOptions: {
        alert: true,
        badge: true,
        sound: true,
        banner: true,
        list: true,
      },
    },
  });

  await applyIosBadgeFromPush(remoteMessage, context);
}
