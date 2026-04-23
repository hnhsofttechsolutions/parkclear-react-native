import { NavigationContainer } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { useFirebase } from './src/hooks/use-firebase';
import StackNavigation from './src/navigation/stack-navigation';
import { persistor, store } from './src/store/store';
import { MyDarkTheme, MyLightTheme } from './src/utils/colors';
import { GoogleSignin } from '@react-native-google-signin/google-signin';


function App() {
  const isDark = useColorScheme() === 'dark';
  const { } = useFirebase();

  GoogleSignin.configure({
    webClientId: '429728101706-pa4t6569okuiqtj5eond0n77a48t7rba.apps.googleusercontent.com',
  });

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
