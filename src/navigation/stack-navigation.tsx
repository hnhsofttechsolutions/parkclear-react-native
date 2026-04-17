import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { APP_SCREENS, AUTH_SCREENS } from './mock/mock-screen';
import { RootStackParamList } from './types';
import { PATHS } from './paths';

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigation = () => {
  const { token, hasSeenOnboard } = useSelector(
    (state: RootState) => state.auth,
  );

  const renderScreens = () => {
    if (!hasSeenOnboard) {
      return AUTH_SCREENS.filter(s => s.name === PATHS.Onboard);
      // return AUTH_SCREENS
    }
    if (token) {
      return APP_SCREENS;
    }
    // return AUTH_SCREENS
    return AUTH_SCREENS.filter(s => s.name !== PATHS.Onboard);
  };
  const activeScreens = renderScreens();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 400,
        gestureEnabled: true,
      }}
    >
      {activeScreens.map((screen: any) => (
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
