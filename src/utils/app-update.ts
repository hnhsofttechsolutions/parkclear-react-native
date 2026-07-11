import SpInAppUpdates from 'sp-react-native-in-app-updates';
import { navigate, navigationRef } from '../navigation/RootNavigation';
import { PATHS } from '../navigation/paths';

export const checkAppUpdate = async () => {
  if (!navigationRef.isReady()) {
    return;
  }

  const inAppUpdates = new SpInAppUpdates(__DEV__ ?? false);

  try {
    if (__DEV__) {
      navigate(PATHS.Update);
      return;
    }

    const result = await inAppUpdates.checkNeedsUpdate();
    if (result.shouldUpdate) {
      navigate(PATHS.Update);
    }
  } catch (error) {
    console.log('Update check failed (Normal in dev):', error);
  }
};
