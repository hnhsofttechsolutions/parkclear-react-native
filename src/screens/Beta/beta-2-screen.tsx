import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { WebView } from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';
import SafeAreaWrapper from '../../components/safe-area-wrapper';
import SideDrawer from '../../components/side-drawer';
import PageLoader from '../../components/ui/page-loader';
import {
  BETA_TABS,
  BetaCustomTabBar,
} from '../../navigation/beta-bottom-tabs';
import { PATHS } from '../../navigation/paths';
import { useScreenStatusMutation } from '../../store/api/uploadApi';
import { setCredentials } from '../../store/slices/authSlice';
import { RootState } from '../../store/store';
import ActiveAlertScreen from '../active-alert-screen';
import MyProfileScreen from '../my-profile-screen';
import { Colors } from '../../utils/colors';

const Tab = createBottomTabNavigator();
const BETA_2_URL = 'https://street-sense-spark.lovable.app';

const Beta2WebContent = () => {
  return (
    <SafeAreaWrapper style={styles.safe} edges={['top']}>
      <WebView
        source={{ uri: BETA_2_URL }}
        style={styles.webview}
        startInLoadingState={true}
      />
    </SafeAreaWrapper>
  );
};

const EmptyTabScreen = () => <View style={styles.emptyTab} />;

const Beta2Screen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const [drawer, setDrawer] = useState(false);
  const { user, token } = useSelector((state: RootState) => state.auth);
  const isPaid = user?.is_paid;
  const isScreen = user?.is_screen;
  const [statusUpdate, { isLoading: isStatusLoading }] =
    useScreenStatusMutation();

  const handleCameraPress = useCallback(async () => {
    if (!isPaid) {
      navigation.navigate(PATHS.Subscription);
      return;
    }

    if (isScreen) {
      navigation.navigate(PATHS.Camera);
      return;
    }

    try {
      const response = await statusUpdate({}).unwrap();
      if (response?.status) {
        dispatch(
          setCredentials({
            token,
            user: { ...user, is_screen: true },
          }),
        );
        navigation.navigate(PATHS.FutureParking);
      } else {
        Toast.show({
          type: 'error',
          text1: response?.message || 'Something went wrong',
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, isPaid, isScreen, navigation, statusUpdate, token, user]);

  return (
    <>
      <PageLoader visible={isStatusLoading} />
      <Tab.Navigator
        initialRouteName={BETA_TABS.Scanner}
        screenOptions={{
          headerShown: false,
        }}
        tabBar={props => (
          <BetaCustomTabBar
            {...props}
            onOpenDrawer={() => setDrawer(true)}
            onCameraPress={handleCameraPress}
          />
        )}
      >
        <Tab.Screen name={BETA_TABS.Menu} component={EmptyTabScreen} />
        <Tab.Screen name={BETA_TABS.Alerts} component={ActiveAlertScreen} />
        <Tab.Screen name={BETA_TABS.Scanner} component={Beta2WebContent} />
        <Tab.Screen name={BETA_TABS.Share} component={EmptyTabScreen} />
        <Tab.Screen name={BETA_TABS.Profile} component={MyProfileScreen} />
      </Tab.Navigator>
      <SideDrawer
        drawer={drawer}
        setDrawer={setDrawer}
        navigation={navigation}
      />
    </>
  );
};

export default Beta2Screen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  webview: { flex: 1 },
  emptyTab: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
