import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { NavigationContainer } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef } from 'react';
import { AppState, AppStateStatus, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { AdSdkInitializer } from './src/components/ad-sdk-initializer';
import { useFirebase } from './src/hooks/use-firebase';
import { navigationRef } from './src/navigation/RootNavigation';
import StackNavigation from './src/navigation/stack-navigation';
import { persistor, store } from './src/store/store';
import {
  initAnalytics,
  logScreenDwellTime,
  logScreenView,
} from './src/utils/analytics-service';
import { MyDarkTheme, MyLightTheme } from './src/utils/colors';

function App() {
  const isDark = useColorScheme() === 'dark';
  const {} = useFirebase();
  const routeNameRef = useRef<string | undefined>(undefined);
  const startTimeRef = useRef(Date.now());
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      const currentScreen = navigationRef.isReady()
        ? navigationRef.getCurrentRoute()?.name
        : undefined;

      if (
        appStateRef.current === 'active' &&
        nextAppState.match(/inactive|background/)
      ) {
        void logScreenDwellTime(currentScreen, startTimeRef.current);
      } else if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        startTimeRef.current = Date.now();
      }

      appStateRef.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  GoogleSignin.configure({
    webClientId:
      '537777711724-t4tej50rs9h787ihjm45as1h2n4jnhs3.apps.googleusercontent.com',
  });

  const trackCurrentScreen = useCallback(() => {
    if (!navigationRef.isReady()) {
      return;
    }

    const previousRouteName = routeNameRef.current;
    const currentRouteName = navigationRef.getCurrentRoute()?.name;

    if (!currentRouteName || previousRouteName === currentRouteName) {
      return;
    }

    if (previousRouteName) {
      void logScreenDwellTime(previousRouteName, startTimeRef.current);
    }

    routeNameRef.current = currentRouteName;
    startTimeRef.current = Date.now();
    void logScreenView(currentRouteName);
  }, []);

  const onNavigationReady = useCallback(() => {
    if (!navigationRef.isReady()) {
      return;
    }

    const currentRouteName = navigationRef.getCurrentRoute()?.name;
    routeNameRef.current = currentRouteName;
    startTimeRef.current = Date.now();

    if (currentRouteName) {
      void logScreenView(currentRouteName);
    }
  }, []);

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
