import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
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
import ErrorText from '../../components/ui/error-text';
import { contactSchema } from '../../schema/contactSchema';
import { Formik } from 'formik';
import Toast from 'react-native-toast-message';
import { useContactMutation } from '../../store/api/settingApi';

function PhonePrefix() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <CallIcon width={22} height={22} />
    </View>
  );
}

const ContactUsScreen = ({ navigation }: any) => {
  const [contactApi, { isLoading }] = useContactMutation();

  const handleContact = async (values: any) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        formData.append(key, values[key]);
      });
      const response = await contactApi({ formData }).unwrap();
      if (response?.status) {
        Toast.show({
          type: 'success',
          text1: 'Message Sent!',
          text2: response?.message,
        });
        navigation.goBack();
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Message Failed',
        text2: error?.data?.message,
      });
    }
  };

  return (
    <SafeAreaWrapper style={styles.safe}>
      <View style={styles.appBarPad}>
        <AppBar
          title={FlutterStrings.contactUs}
          onBack={() => navigation.goBack()}
        />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scroll}
        >
          <LinearGradient
            colors={[...Gradient.colors]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.hero, Platform.OS === 'ios' && styles.heroIOS]}
          >
            <MailLogo width={48} height={48} />
            <TouchableOpacity activeOpacity={0.85}>
              <AppText size={17} color={Colors.white} style={{ marginTop: 5 }}>
                contact@parkclear.co
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.85}>
              <AppText size={17} color={Colors.white}>
                www.parkclear.co
              </AppText>
            </TouchableOpacity>
          </LinearGradient>
          <View style={{ height: 25 }} />
          <Formik
            initialValues={{
              first_name: '',
              last_name: '',
              email: '',
              phone_number: '',
              message: '',
            }}
            validationSchema={contactSchema}
            onSubmit={handleContact}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <>
                <AppTextField
                  label={FlutterStrings.firstName}
                  prefix={<UserImg width={22} height={22} />}
                  placeholder={FlutterStrings.enterFirstName}
                  autoCapitalize="words"
                  onChangeText={handleChange('first_name')}
                  onBlur={handleBlur('first_name')}
                  value={values.first_name}
                />
                <ErrorText
                  visible={touched.first_name}
                  error={errors.first_name}
                />
                <View style={{ height: 20 }} />
                <AppTextField
                  label={FlutterStrings.lastName}
                  prefix={<UserImg width={22} height={22} />}
                  placeholder={FlutterStrings.enterLastName}
                  autoCapitalize="words"
                  onChangeText={handleChange('last_name')}
                  onBlur={handleBlur('last_name')}
                  value={values.last_name}
                />
                <ErrorText
                  visible={touched.last_name}
                  error={errors.last_name}
                />
                <View style={{ height: 20 }} />
                <AppTextField
                  label={FlutterStrings.email}
                  prefix={<EmailImg width={22} height={22} />}
                  placeholder={FlutterStrings.enterYourEmailAddress}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                />
                <ErrorText visible={touched.email} error={errors.email} />
                <View style={{ height: 20 }} />
                <AppTextField
                  label={FlutterStrings.phoneNumber}
                  prefix={<PhonePrefix />}
                  placeholder={FlutterStrings.enterYourPhoneNumber}
                  keyboardType="phone-pad"
                  maxLength={10}
                  onChangeText={handleChange('phone_number')}
                  onBlur={handleBlur('phone_number')}
                  value={values.phone_number}
                />
                <ErrorText
                  visible={touched.phone_number}
                  error={errors.phone_number}
                />
                <View style={{ height: 20 }} />
                <AppTextField
                  label={FlutterStrings.message}
                  placeholder={FlutterStrings.writeYourMessage}
                  multiline
                  onChangeText={handleChange('message')}
                  onBlur={handleBlur('message')}
                  value={values.message}
                />
                <ErrorText visible={touched.message} error={errors.message} />
                <View style={{ height: 35 }} />
                <GradientButton
                  label={FlutterStrings.sendMessage}
                  onPress={handleSubmit}
                  isLoading={isLoading}
                />
              </>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
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
  heroIOS: {
    width: '100%',
    minHeight: 200,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
});
