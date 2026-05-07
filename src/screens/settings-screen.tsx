import { appleAuth } from '@invertase/react-native-apple-authentication';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { ChevronRight, KeyRound } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import AboutUsImg from '../assets/images/about_us.svg';
import ContactUsImg from '../assets/images/contact_us.svg';
import DeleteImg from '../assets/images/delete.svg';
import FeedbackImg from '../assets/images/feedback.svg';
import PrivacyPolicyImg from '../assets/images/privacy_policy.svg';
import RemoveAdsIcon from '../assets/images/remove_ads_black.svg';
import TermsImg from '../assets/images/terms_and_condition.svg';
import FeedBackForm from '../components/feedback/feedback-from';
import DeleteModal from '../components/modals/delete-modal';
import SafeAreaWrapper from '../components/safe-area-wrapper';
import SettingRow from '../components/settings/setting-row';
import SettingsBoxRow from '../components/settings/settings-box-row';
import { AppBar } from '../components/ui/app-bar';
import AppText from '../components/ui/app-text';
import PageLoader from '../components/ui/page-loader';
import { FlutterStrings } from '../constants/flutterStrings';
import { PATHS } from '../navigation/paths';
import {
  useDeleteAccountMutation,
  useLazyGetProfileQuery,
} from '../store/api/settingApi';
import { logout, setCredentials } from '../store/slices/authSlice';
import { RootState } from '../store/store';
import { Colors } from '../utils/colors';
import Purchases from 'react-native-purchases';
import { baseApi } from '../store/api/baseApi';
const chevron = <ChevronRight size={15} color={Colors.primary} />;

const SettingsScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [isDeletetModal, setIsDeletetModal] = useState(false);
  const [isAdsRemoved, setIsAdsRemoved] = useState(false);
  const [deleteAccount, { isLoading }] = useDeleteAccountMutation();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [isPaid, setIsPaid] = useState(user.is_paid);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [triggerGetProfile, { isLoading: isProfileLoading }] =
    useLazyGetProfileQuery();

  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await triggerGetProfile().unwrap();
      setIsPaid(profile?.data?.is_paid);
      dispatch(setCredentials({ token, user: profile?.data }));
    };
    fetchProfile();
  }, []);

  const handleDeleteAccount = async () => {
    try {
      setLogoutLoading(true);
      const response = await deleteAccount({}).unwrap();
      if (response?.status) {
        Toast.show({
          type: 'success',
          text1: 'Account Deleted',
          text2: response?.message,
        });
        try {
          await GoogleSignin.signOut();

          if (!(await Purchases.isAnonymous())) {
            await Purchases.logOut();
          }
          dispatch(logout());
          dispatch(baseApi.util.resetApiState());
        } catch (e) {
          console.log('Google logout error', e);
        }
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Delete Failed',
        text2: error?.data?.message,
      });
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <SafeAreaWrapper style={styles.safe}>
      <PageLoader visible={isLoading || isProfileLoading} />
      <View style={styles.hPad}>
        <AppBar
          title={FlutterStrings.settings}
          onBack={() => navigation.goBack()}
        />
        <ScrollView>
          <AppText size={14} color={Colors.grey} style={{ marginBottom: 10 }}>
            {FlutterStrings.supportAbout}
          </AppText>
          <View style={styles.card}>
            <SettingRow
              icon={<AboutUsImg width={20} height={20} />}
              title={FlutterStrings.aboutUs}
              onPress={() => navigation.navigate(PATHS.AboutUs)}
              showDivider
            />
            <SettingRow
              icon={<ContactUsImg width={20} height={20} />}
              title={FlutterStrings.contactUs}
              onPress={() => navigation.navigate(PATHS.ContactUs)}
              showDivider
            />
            <SettingRow
              icon={<PrivacyPolicyImg width={20} height={20} />}
              title={FlutterStrings.privacyPolicy}
              onPress={() => navigation.navigate(PATHS.PrivacyPolicy)}
              showDivider
            />
            <SettingRow
              icon={<TermsImg width={20} height={20} />}
              title={FlutterStrings.termsConditions}
              onPress={() => navigation.navigate(PATHS.Terms)}
              showDivider={false}
            />
          </View>
          {!isPaid && (
            <>
              <View style={{ height: 20 }} />
              <SettingsBoxRow
                icon={
                  <RemoveAdsIcon width={20} height={20} color={Colors.black} />
                }
                title={FlutterStrings.removeAds}
                suffix={
                  <Switch
                    value={isPaid && isAdsRemoved}
                    onValueChange={val => {
                      setIsAdsRemoved(val);
                      if (val) {
                        navigation.navigate(PATHS.Subscription);
                      }
                    }}
                    trackColor={{
                      false: Colors.textFieldBorder,
                      true: Colors.gradientEnd,
                    }}
                    thumbColor={Colors.white}
                  />
                }
                onPress={() => {}}
              />
            </>
          )}
          <View style={{ height: 20 }} />
          <SettingsBoxRow
            icon={<FeedbackImg width={20} height={20} />}
            title={FlutterStrings.feedback}
            suffix={chevron}
            onPress={() => setIsVisible(true)}
          />
          <View style={{ height: 20 }} />
          <SettingsBoxRow
            icon={<KeyRound color={Colors.black} width={20} height={20} />}
            title={FlutterStrings.resetPassword}
            suffix={chevron}
            onPress={() => navigation.navigate(PATHS.ChangePassword)}
          />
          <View style={{ height: 20 }} />
          <SettingsBoxRow
            danger
            icon={<DeleteImg width={20} height={20} />}
            title={FlutterStrings.deleteAccount}
            suffix={<ChevronRight size={15} color={Colors.settingsRed} />}
            onPress={() => setIsDeletetModal(true)}
          />
        </ScrollView>
      </View>
      <FeedBackForm isVisible={isVisible} setIsVisible={setIsVisible} />
      <DeleteModal
        isLoading={logoutLoading}
        title="Delete “ParkClear” App ?"
        description="Deleting this app will also delete its data."
        visible={isDeletetModal}
        onClose={() => setIsDeletetModal(false)}
        onDelete={handleDeleteAccount}
      />
    </SafeAreaWrapper>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  hPad: { flex: 1, paddingHorizontal: 20 },
  card: {
    borderWidth: 1,
    borderColor: Colors.textFieldBorder,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
});
