import {
  getAnalytics,
  logEvent,
  setAnalyticsCollectionEnabled,
  setUserId,
} from '@react-native-firebase/analytics';
import { NavigationState, PartialState } from '@react-navigation/native';
import { store } from '../store/store';

type NavState = NavigationState | PartialState<NavigationState>;

const analytics = getAnalytics();

const isProductionAnalytics = () => !__DEV__;

export const getActiveRouteName = (
  state: NavState | undefined,
): string | undefined => {
  if (!state?.routes?.length) {
    return undefined;
  }

  const index = state.index ?? state.routes.length - 1;
  const route = state.routes[index];

  if (route.state) {
    return getActiveRouteName(route.state as NavState);
  }

  return route.name;
};

let lastTrackedScreen: string | undefined;

const getCurrentUserId = (): string | undefined => {
  const userId = store.getState()?.auth?.user?.id;
  return userId != null ? String(userId) : undefined;
};

export const initAnalytics = async () => {
  await setAnalyticsCollectionEnabled(analytics, isProductionAnalytics());
};

export const logScreenView = async (screenName: string) => {
  if (!screenName || screenName === lastTrackedScreen) {
    return;
  }

  lastTrackedScreen = screenName;

  const currentUserId = getCurrentUserId();

  if (!isProductionAnalytics()) {
    // console.log('[Analytics] screen_view (dev only)', {
    //   screen_name: screenName,
    //   screen_class: screenName,
    //   user_id: currentUserId ?? null,
    // });
    return;
  }

  if (currentUserId) {
    await setUserId(analytics, currentUserId);
  }

  await logEvent(analytics, 'screen_view', {
    screen_name: screenName,
    screen_class: screenName,
  });
};

export const logAnalyticsEvent = async (
  eventName: string,
  params?: Record<string, string | number | boolean>,
) => {
  if (!isProductionAnalytics()) {
    // console.log('[Analytics] event (dev only)', eventName, params);
    return;
  }

  await logEvent(analytics, eventName, params);
};

export type AuthMethod = 'email' | 'google' | 'apple';

export const logSignupSuccess = async (
  userId: string | number | undefined,
  method: AuthMethod,
) => {
  const userIdStr = userId != null ? String(userId) : undefined;

  if (!isProductionAnalytics()) {
    // console.log('[Analytics] sign_up (dev only)', {
    //   method,
    //   user_id: userIdStr ?? null,
    // });
    return;
  }

  if (userIdStr) {
    await setUserId(analytics, userIdStr);
  }

  await logEvent(analytics, 'sign_up', { method });
};

export const logLoginSuccess = async (
  userId: string | number | undefined,
  method: AuthMethod,
) => {
  const userIdStr = userId != null ? String(userId) : undefined;

  if (!isProductionAnalytics()) {
    // console.log('[Analytics] login (dev only)', {
    //   method,
    //   user_id: userIdStr ?? null,
    // });
    return;
  }

  if (userIdStr) {
    await setUserId(analytics, userIdStr);
  }

  await logEvent(analytics, 'login', { method });
};

export const logScreenDwellTime = async (
  screenName: string | undefined,
  startTimeMs: number,
) => {
  if (!screenName || !startTimeMs) {
    return;
  }

  const durationSeconds = Math.round((Date.now() - startTimeMs) / 1000);

  if (durationSeconds <= 0) {
    return;
  }

  const currentUserId = getCurrentUserId();
  const payload = {
    screen_name: screenName,
    duration_seconds: durationSeconds,
    ...(currentUserId ? { user_id: currentUserId } : {}),
  };

  if (!isProductionAnalytics()) {
    // console.log('[Analytics] screen_dwell_time (dev only)', {
    //   ...payload,
    //   user_id: currentUserId ?? null,
    // });
    return;
  }

  await logEvent(analytics, 'screen_dwell_time', payload);
};

export const resetScreenTracking = () => {
  lastTrackedScreen = undefined;
};
