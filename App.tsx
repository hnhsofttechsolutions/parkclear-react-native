import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { NavigationContainer } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import SpInAppUpdates from 'sp-react-native-in-app-updates';
import { AdSdkInitializer } from './src/components/ad-sdk-initializer';
import { useFirebase } from './src/hooks/use-firebase';
import { navigate, navigationRef } from './src/navigation/RootNavigation';
import { PATHS } from './src/navigation/paths';
import StackNavigation from './src/navigation/stack-navigation';
import { persistor, store } from './src/store/store';
import {
  initAnalytics,
  logScreenView,
} from './src/utils/analytics-service';
import { MyDarkTheme, MyLightTheme } from './src/utils/colors';

function App() {
  const isDark = useColorScheme() === 'dark';
  const {} = useFirebase();
  const routeNameRef = useRef<string | undefined>(undefined);
  const inAppUpdates = new SpInAppUpdates(__DEV__ ?? false);

  useEffect(() => {
    initAnalytics();
  }, []);

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

  GoogleSignin.configure({
    webClientId:
      '537777711724-t4tej50rs9h787ihjm45as1h2n4jnhs3.apps.googleusercontent.com',
  });

  const trackCurrentScreen = useCallback(() => {
    const currentRoute = navigationRef.getCurrentRoute()?.name;

    if (currentRoute && routeNameRef.current !== currentRoute) {
      routeNameRef.current = currentRoute;
      logScreenView(currentRoute);
    }
  }, []);

  const onNavigationReady = useCallback(() => {
    checkUpdate();
    trackCurrentScreen();
  }, [trackCurrentScreen]);

  const onNavigationStateChange = useCallback(() => {
    trackCurrentScreen();
  }, [trackCurrentScreen]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AdSdkInitializer />
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <NavigationContainer
              ref={navigationRef}
              onReady={onNavigationReady}
              onStateChange={onNavigationStateChange}
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
