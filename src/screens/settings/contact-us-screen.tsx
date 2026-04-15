import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import SafeAreaWrapper from '../../components/safe-area-wrapper';
import CallIcon from '../../assets/images/call.svg';
import EmailImg from '../../assets/images/email.svg';
import MailLogo from '../../assets/images/mail_icon.svg';
import UserImg from '../../assets/images/user_img.svg';
import AppText from '../../components/ui/app-text';
import { FlutterStrings } from '../../constants/flutterStrings';
import { Colors, Gradient } from '../../utils/colors';
import { GradientButton } from '../../components/ui/gradient-button';
import { AppBar } from '../../components/ui/app-bar';
import { AppTextField } from '../../components/ui/app-text-field';

function PhonePrefix() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <CallIcon width={22} height={22} />
    </View>
  );
}

const ContactUsScreen = ({ navigation }: any) => {
  return (
    <SafeAreaWrapper style={styles.safe}>
      <View style={styles.appBarPad}>
        <AppBar
          title={FlutterStrings.contactUs}
          onBack={() => navigation.goBack()}
        />
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scroll}
      >
        <LinearGradient
          colors={[...Gradient.colors]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.hero}
        >
          <MailLogo width={48} height={48} />
          <TouchableOpacity activeOpacity={0.85}>
            <AppText
              size={17}
              color={Colors.white}
              style={{ marginTop: 5, fontWeight: '400' }}
            >
              contact@parkclear.co
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85}>
            <AppText
              size={17}
              color={Colors.white}
              style={{ fontWeight: '400' }}
            >
              www.parkclear.co
            </AppText>
          </TouchableOpacity>
        </LinearGradient>
        <View style={{ height: 25 }} />
        <AppTextField
          label={FlutterStrings.firstName}
          prefix={<UserImg width={22} height={22} />}
          placeholder={FlutterStrings.enterFirstName}
          autoCapitalize="words"
        />
        <View style={{ height: 20 }} />
        <AppTextField
          label={FlutterStrings.lastName}
          prefix={<UserImg width={22} height={22} />}
          placeholder={FlutterStrings.enterLastName}
          autoCapitalize="words"
        />
        <View style={{ height: 20 }} />
        <AppTextField
          label={FlutterStrings.email}
          prefix={<EmailImg width={22} height={22} />}
          placeholder={FlutterStrings.enterYourEmailAddress}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View style={{ height: 20 }} />
        <AppTextField
          label={FlutterStrings.phoneNumber}
          prefix={<PhonePrefix />}
          placeholder={FlutterStrings.enterYourPhoneNumber}
          keyboardType="phone-pad"
          maxLength={10}
        />
        <View style={{ height: 20 }} />
        <AppTextField
          label={FlutterStrings.message}
          placeholder={FlutterStrings.writeYourMessage}
          multiline
        />
        <View style={{ height: 35 }} />
        <GradientButton label={FlutterStrings.sendMessage} onPress={() => {}} />
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default ContactUsScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  appBarPad: { paddingHorizontal: 20 },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  hero: {
    borderRadius: 15,
    paddingVertical: 60,
    paddingHorizontal: 50,
    alignItems: 'center',
  },
});
