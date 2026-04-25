import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const useLocationPermission = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAndRequestPermission = async () => {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

      try {
        const result = await check(permission);
        if (result === RESULTS.GRANTED) {
          setHasPermission(true);
        } else if (result === RESULTS.DENIED) {
          const requestResult = await request(permission);
          setHasPermission(requestResult === RESULTS.GRANTED);
        } else {
          setHasPermission(false);
        }
      } catch (error) {
        console.warn('Location permission error:', error);
        setHasPermission(false);
      }
    };

    checkAndRequestPermission();
  }, []);

  return { hasPermission };
};
