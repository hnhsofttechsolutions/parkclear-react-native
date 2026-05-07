import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { NavigationContainer, NavigationProp } from '@react-navigation/native';
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
import { navigationRef, navigate } from './src/navigation/RootNavigation';
import { PATHS } from './src/navigation/paths';
import SpInAppUpdates from 'sp-react-native-in-app-updates';

function App() {
  const isDark = useColorScheme() === 'dark';
  const {} = useFirebase();
  const inAppUpdates = new SpInAppUpdates(__DEV__ ?? false);

  const checkUpdate = async () => {
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

  useEffect(() => {
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
            <NavigationContainer
              ref={navigationRef}
              onReady={checkUpdate}
              theme={isDark ? MyDarkTheme : MyLightTheme}
            >
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
