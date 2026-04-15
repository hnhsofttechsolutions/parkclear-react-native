import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { APP_SCREENS, AUTH_SCREENS } from './mock/mock-screen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigation = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 400,
      }}
    >
      {token ? (
        <>
          {APP_SCREENS.map((screen: any) => (
            <Stack.Screen
              key={screen.name}
              name={screen.name}
              component={screen.component}
            />
          ))}
        </>
      ) : (
        <>
          {AUTH_SCREENS.map((screen: any) => (
            <Stack.Screen
              key={screen.name}
              name={screen.name}
              component={screen.component}
            />
          ))}
        </>
      )}
    </Stack.Navigator>
  );
};

export default StackNavigation;
