import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { NavigationContainer } from '@react-navigation/native';
import { InteractionManager, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { useFirebase } from './src/hooks/use-firebase';
import StackNavigation from './src/navigation/stack-navigation';
import { persistor, store } from './src/store/store';
import { MyDarkTheme, MyLightTheme } from './src/utils/colors';
import { useEffect } from 'react';
import AdService from './src/services/ad-service';

function App() {
  const isDark = useColorScheme() === 'dark';
  const {} = useFirebase();

  useEffect(() => {
    // Defer until after first paint so native LevelPlay module + bridge are stable (Unity RN guidance).
    const task = InteractionManager.runAfterInteractions(() => {
      void AdService.init();
    });
    return () => {
      if (
        task != null &&
        typeof (task as { cancel?: () => void }).cancel === 'function'
      ) {
        (task as { cancel: () => void }).cancel();
      }
    };
  }, []);

  GoogleSignin.configure({
    webClientId:
      '429728101706-pa4t6569okuiqtj5eond0n77a48t7rba.apps.googleusercontent.com',
  });

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <NavigationContainer theme={isDark ? MyDarkTheme : MyLightTheme}>
              <StackNavigation />
              <Toast />
            </NavigationContainer>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}

export default App;
