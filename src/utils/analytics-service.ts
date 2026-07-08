import analytics from '@react-native-firebase/analytics';
import {
  NavigationState,
  PartialState,
} from '@react-navigation/native';

type NavState = NavigationState | PartialState<NavigationState>;

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

export const initAnalytics = async () => {
  await analytics().setAnalyticsCollectionEnabled(true);
};

export const logScreenView = async (screenName: string) => {
  if (!screenName || screenName === lastTrackedScreen) {
    return;
  }

  lastTrackedScreen = screenName;

  await analytics().logScreenView({
    screen_name: screenName,
    screen_class: screenName,
  });
};

export const logAnalyticsEvent = async (
  eventName: string,
  params?: Record<string, string | number | boolean>,
) => {
  await analytics().logEvent(eventName, params);
};

export const resetScreenTracking = () => {
  lastTrackedScreen = undefined;
};
