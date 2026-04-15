import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import StackNavigation from './src/navigation/stack-navigation';
import { useColorScheme } from 'react-native';
import { MyDarkTheme, MyLightTheme } from './src/utils/colors';
import { Provider } from 'react-redux';
import { persistor, store } from './src/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';

function App() {
  const isDark = useColorScheme() === 'dark';
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
