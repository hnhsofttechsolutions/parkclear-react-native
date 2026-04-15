import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import AboutUsImg from '../assets/images/about_us.svg';
import ContactUsImg from '../assets/images/contact_us.svg';
import DeleteImg from '../assets/images/delete.svg';
import FeedbackImg from '../assets/images/feedback.svg';
import PrivacyPolicyImg from '../assets/images/privacy_policy.svg';
import RestoreImg from '../assets/images/restore.svg';
import TermsImg from '../assets/images/terms_and_condition.svg';
import SafeAreaWrapper from '../components/safe-area-wrapper';
import SettingRow from '../components/settings/setting-row';
import SettingsBoxRow from '../components/settings/settings-box-row';
import { AppBar } from '../components/ui/app-bar';
import AppText from '../components/ui/app-text';
import { FlutterStrings } from '../constants/flutterStrings';
import { PATHS } from '../navigation/paths';
import { Colors } from '../utils/colors';

const chevron = <ChevronRight size={15} color={Colors.primary} />;

const SettingsScreen = ({ navigation }: any) => {
  return (
    <SafeAreaWrapper style={styles.safe}>
      <View style={styles.hPad}>
        <AppBar
          title={FlutterStrings.settings}
          onBack={() => navigation.goBack()}
        />
        <ScrollView>
          <AppText
            size={14}
            color={Colors.grey}
            style={{ marginBottom: 10, fontWeight: '400' }}
          >
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
          <View style={{ height: 20 }} />
          <SettingsBoxRow
            icon={<FeedbackImg width={20} height={20} />}
            title={FlutterStrings.feedback}
            suffix={chevron}
            onPress={() => {}}
          />
          <View style={{ height: 20 }} />
          <SettingsBoxRow
            icon={<RestoreImg width={20} height={20} />}
            title={FlutterStrings.restorePurchase}
            suffix={chevron}
            onPress={() => {}}
          />
          <View style={{ height: 20 }} />
          <SettingsBoxRow
            icon={<DeleteImg width={20} height={20} />}
            title={FlutterStrings.deleteAccount}
            suffix={<ChevronRight size={15} color={Colors.settingsRed} />}
            danger
            onPress={() => {}}
          />
        </ScrollView>
      </View>
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
