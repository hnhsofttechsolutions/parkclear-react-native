import messaging from '@react-native-firebase/messaging';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { requestNotificationPermission } from './src/hooks/request-notification-permission';
import StackNavigation from './src/navigation/stack-navigation';
import { persistor, store } from './src/store/store';
import { MyDarkTheme, MyLightTheme } from './src/utils/colors';

function App() {
  const isDark = useColorScheme() === 'dark';

  useEffect(() => {
    const setupFirebase = async () => {
      const hasPermission = await requestNotificationPermission();
      if (hasPermission) {
        const token = await messaging().getToken();
        console.log('Token:', token);
      } else {
        console.log('Permission denied by user');
      }
    };
    setupFirebase();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationContainer theme={isDark ? MyDarkTheme : MyLightTheme}>
            <StackNavigation />
            <Toast />
          </NavigationContainer>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}

export default App;
