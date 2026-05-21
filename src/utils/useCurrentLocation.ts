import { useState, useCallback } from 'react';
import { Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export interface LocationData {
  latitude: number;
  longitude: number;
  heading: number | null;
  speed: number | null;
  accuracy: number;
  timestamp: number;
}

interface UseCurrentLocationReturn {
  location: LocationData | null;
  error: string | null;
  loading: boolean;
  fetchLocation: () => Promise<void>;
}

const mapPosition = (position: {
  coords: {
    latitude: number;
    longitude: number;
    heading: number | null;
    speed: number | null;
    accuracy: number;
  };
  timestamp: number;
}): LocationData => ({
  latitude: position.coords.latitude,
  longitude: position.coords.longitude,
  heading: position.coords.heading,
  speed: position.coords.speed,
  accuracy: position.coords.accuracy,
  timestamp: position.timestamp,
});

const getPosition = (
  enableHighAccuracy: boolean,
): Promise<LocationData> =>
  new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => resolve(mapPosition(position)),
      err => reject(err),
      {
        enableHighAccuracy,
        timeout: enableHighAccuracy ? 20000 : 30000,
        maximumAge: 60000,
      },
    );
  });

const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    const permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
    let status = await check(permission);
    if (status === RESULTS.DENIED) {
      status = await request(permission);
    }
    return status === RESULTS.GRANTED || status === RESULTS.LIMITED;
  }

  const finePermission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
  const coarsePermission = PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION;

  let fineStatus = await check(finePermission);
  if (fineStatus === RESULTS.DENIED) {
    fineStatus = await request(finePermission);
  }
  if (fineStatus === RESULTS.GRANTED) {
    return true;
  }

  let coarseStatus = await check(coarsePermission);
  if (coarseStatus === RESULTS.DENIED) {
    coarseStatus = await request(coarsePermission);
  }
  return coarseStatus === RESULTS.GRANTED;
};

export const useCurrentLocation = (): UseCurrentLocationReturn => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getLocation = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    const hasPermission = await requestLocationPermission();

    if (!hasPermission) {
      setError('Location permission denied');
      setLoading(false);
      return;
    }

    try {
      const position = await getPosition(true);
      setLocation(position);
    } catch {
      try {
        const position = await getPosition(false);
        setLocation(position);
      } catch (fallbackErr: any) {
        setError(
          fallbackErr?.message ?? 'Unable to get location. Turn on GPS and try again.',
        );
        setLocation(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { location, error, loading, fetchLocation: getLocation };
};
