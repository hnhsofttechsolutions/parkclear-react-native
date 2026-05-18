import { useState, useCallback } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

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

export const useCurrentLocation = (): UseCurrentLocationReturn => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const requestAndroidPermission = async (): Promise<boolean> => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'This app needs access to your location to get your current position.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      setError('Permission request failed');
      return false;
    }
  };

  const getLocation = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    let hasPermission = true;

    if (Platform.OS === 'android') {
      hasPermission = await requestAndroidPermission();
    }

    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
    }

    if (!hasPermission) {
      setError('Location permission denied');
      setLoading(false);
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          heading: position.coords.heading,
          speed: position.coords.speed,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
        setLoading(false);
      },
      err => {
        setError(err.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  }, []);

  return { location, error, loading, fetchLocation: getLocation };
};
