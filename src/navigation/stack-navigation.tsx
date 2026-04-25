import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import SplashScreen from '../screens/start/splash-screen';
import { RootState } from '../store/store';
import { APP_SCREENS, AUTH_SCREENS } from './mock/mock-screen';
import { PATHS } from './paths';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigation = () => {
  const { user, token, hasSeenOnboard, hasSeenTrial } = useSelector(
    (state: RootState) => state.auth,
  );
  const [splashDone, setSplashDone] = useState(false);

  if (!splashDone) {
    return <SplashScreen onComplete={() => setSplashDone(true)} />;
  }

  const getScreens = () => {
    if (token) {
      if (!user?.is_paid && !hasSeenTrial) {
        const trialScreen = APP_SCREENS.find(s => s.name === PATHS.Trial);
        const rest = APP_SCREENS.filter(s => s.name !== PATHS.Trial);
        return trialScreen ? [trialScreen, ...rest] : APP_SCREENS;
      }
      return APP_SCREENS.filter(s => s.name !== PATHS.Trial);
    }
    if (!hasSeenOnboard) {
      return AUTH_SCREENS;
    }
    return AUTH_SCREENS.filter(s => s.name !== PATHS.Onboard);
  };
  const screens = getScreens();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 400,
        gestureEnabled: true,
      }}
    >
      {screens.map((screen: any) => (
        <Stack.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
        />
      ))}
    </Stack.Navigator>
  );
};

export default StackNavigation;
