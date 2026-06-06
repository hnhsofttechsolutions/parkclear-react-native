import { useCallback, useEffect, useState } from 'react';
import { Alert, AppState, Platform } from 'react-native';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
  type PermissionStatus,
} from 'react-native-permissions';

/**
 * Maps user location (react-native-maps / Google Maps):
 * - iOS: Info.plist `NSLocationWhenInUseUsageDescription` + Podfile `LocationWhenInUse`
 * - Android: AndroidManifest `ACCESS_FINE_LOCATION` + `ACCESS_COARSE_LOCATION`
 */
const IOS_LOCATION_PERMISSION = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
const ANDROID_FINE_LOCATION = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
const ANDROID_COARSE_LOCATION = PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION;

const isLocationGranted = (status: PermissionStatus) =>
  status === RESULTS.GRANTED || status === RESULTS.LIMITED;

const showLocationBlockedAlert = () => {
  Alert.alert(
    'Location Required',
    'Location access is needed to show your position on the map. Please enable it in app settings.',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open Settings', onPress: () => openSettings() },
    ],
  );
};

async function checkAndroidLocationPermission(): Promise<PermissionStatus> {
  const fineStatus = await check(ANDROID_FINE_LOCATION);
  if (isLocationGranted(fineStatus)) {
    return fineStatus;
  }

  const coarseStatus = await check(ANDROID_COARSE_LOCATION);
  if (isLocationGranted(coarseStatus)) {
    return coarseStatus;
  }

  return fineStatus;
}

async function requestAndroidLocationPermission(): Promise<PermissionStatus> {
  let fineStatus = await check(ANDROID_FINE_LOCATION);

  if (fineStatus === RESULTS.DENIED) {
    fineStatus = await request(ANDROID_FINE_LOCATION);
  }

  if (isLocationGranted(fineStatus)) {
    return fineStatus;
  }

  if (fineStatus === RESULTS.BLOCKED) {
    return fineStatus;
  }

  let coarseStatus = await check(ANDROID_COARSE_LOCATION);
  if (coarseStatus === RESULTS.DENIED) {
    coarseStatus = await request(ANDROID_COARSE_LOCATION);
  }

  return coarseStatus;
}

async function checkIosLocationPermission(): Promise<PermissionStatus> {
  return check(IOS_LOCATION_PERMISSION);
}

async function requestIosLocationPermission(): Promise<PermissionStatus> {
  let status = await check(IOS_LOCATION_PERMISSION);

  if (status === RESULTS.DENIED) {
    status = await request(IOS_LOCATION_PERMISSION);
  }

  return status;
}

export async function checkLocationPermission(): Promise<PermissionStatus> {
  return Platform.OS === 'ios'
    ? checkIosLocationPermission()
    : checkAndroidLocationPermission();
}

export async function requestLocationPermission(options?: {
  showSettingsAlert?: boolean;
}): Promise<boolean> {
  const { showSettingsAlert = true } = options ?? {};

  try {
    const status =
      Platform.OS === 'ios'
        ? await requestIosLocationPermission()
        : await requestAndroidLocationPermission();

    const granted = isLocationGranted(status);

    if (!granted && showSettingsAlert && status === RESULTS.BLOCKED) {
      showLocationBlockedAlert();
    }

    return granted;
  } catch (error) {
    console.warn('Location permission request error:', error);
    return false;
  }
}

type UseLocationPermissionOptions = {
  /** Check only on mount; do not show the system permission dialog automatically */
  checkOnlyOnMount?: boolean;
};

export const useLocationPermission = (
  options: UseLocationPermissionOptions = {},
) => {
  const { checkOnlyOnMount = false } = options;
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [status, setStatus] = useState<PermissionStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const applyStatus = useCallback((permissionStatus: PermissionStatus) => {
    setStatus(permissionStatus);
    setHasPermission(isLocationGranted(permissionStatus));
    return isLocationGranted(permissionStatus);
  }, []);

  const refreshPermission = useCallback(async (): Promise<boolean> => {
    setIsChecking(true);
    try {
      const permissionStatus = await checkLocationPermission();
      return applyStatus(permissionStatus);
    } catch (error) {
      console.warn('Location permission check error:', error);
      setHasPermission(false);
      setStatus(null);
      return false;
    } finally {
      setIsChecking(false);
    }
  }, [applyStatus]);

  const requestPermission = useCallback(
    async (requestOptions?: { showSettingsAlert?: boolean }): Promise<boolean> => {
      setIsChecking(true);
      try {
        const granted = await requestLocationPermission(requestOptions);
        const permissionStatus = await checkLocationPermission();
        applyStatus(permissionStatus);
        return granted;
      } finally {
        setIsChecking(false);
      }
    },
    [applyStatus],
  );

  useEffect(() => {
    const init = async () => {
      if (checkOnlyOnMount) {
        await refreshPermission();
        return;
      }

      const currentStatus = await checkLocationPermission();
      if (isLocationGranted(currentStatus)) {
        applyStatus(currentStatus);
        return;
      }

      if (currentStatus === RESULTS.DENIED) {
        await requestPermission({ showSettingsAlert: false });
        return;
      }

      applyStatus(currentStatus);
    };

    init();
  }, [applyStatus, checkOnlyOnMount, refreshPermission, requestPermission]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'active') {
        refreshPermission();
      }
    });

    return () => subscription.remove();
  }, [refreshPermission]);

  return {
    hasPermission,
    status,
    isChecking,
    refreshPermission,
    requestPermission,
    openSettings,
  };
};
