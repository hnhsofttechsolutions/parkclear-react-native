import { IOS_NOTIFICATION_SOUND } from './notification-service';

/**
 * iOS remote push custom sound (Apple + Firebase):
 * - Sound file must be in the app bundle: .caf / .wav / .aiff (< 30 sec)
 * - Background/killed: system plays sound from `aps.sound` in the push payload
 * - Foreground: app shows via Notifee (notification-service.ts)
 *
 * Easiest backend fix — add to every FCM message:
 */
export function buildFcmMessageWithIosSound(params: {
  title: string;
  body: string;
  /** App icon badge — use active alert count from backend */
  badge?: number;
  data?: Record<string, string>;
}) {
  const { title, body, badge = 1, data = {} } = params;

  return {
    notification: { title, body },
    data: {
      ...data,
      badge: String(badge),
      badge_count: String(badge),
    },
    apns: {
      payload: {
        aps: {
          sound: IOS_NOTIFICATION_SOUND,
          badge,
          alert: { title, body },
        },
      },
    },
    android: {
      notification: {
        channel_id: 'parkclear_alerts_v2',
        sound: 'noti_tune',
        default_vibrate_timings: true,
      },
    },
  };
}

/**
 * If using Notification Service Extension, also set mutableContent: 1 (Admin SDK).
 */
export const FCM_IOS_MUTABLE_CONTENT_HINT = {
  apns: {
    payload: {
      aps: {
        sound: IOS_NOTIFICATION_SOUND,
        mutableContent: 1,
      },
    },
  },
} as const;
