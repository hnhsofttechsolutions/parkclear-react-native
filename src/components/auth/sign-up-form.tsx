import { Formik } from 'formik';
import { Apple, Eye, EyeOff, LockKeyhole } from 'lucide-react-native';
import React, { useState } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import EmailImg from '../../assets/images/email.svg';
import GoogleLogo from '../../assets/images/google_logo.svg';
import UserImg from '../../assets/images/user_img.svg';
import { FlutterStrings } from '../../constants/flutterStrings';
import { useFirebase } from '../../hooks/use-firebase';
import { signUpSchema } from '../../schema/authSchema';
import { useSignupMutation } from '../../store/api/authApi';
import { Colors } from '../../utils/colors';
import RegisterModal from '../modals/register-modal';
import AppText from '../ui/app-text';
import { AppTextField } from '../ui/app-text-field';
import ErrorText from '../ui/error-text';
import { GradientButton, GreyPillButton } from '../ui/gradient-button';
import PhonePrefix from '../ui/phone-prefix';

function SignUpForm({ navigation }: any) {
  const { fcmToken } = useFirebase();
  const [signup, { isLoading }] = useSignupMutation();
  const [isRegisterVisible, setIsRegisterVisible] = useState(false);
  const [securePassword, setSecurePassword] = useState(true);

  const handleSignUp = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append('fcm_token', fcmToken);
      Object.keys(values).forEach(key => {
        formData.append(key, values[key]);
      });
      const response = await signup({ formData }).unwrap();
      if (response?.status) {
        setIsRegisterVisible(true);
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Sign Up Failed',
        text2: error?.data?.message,
      });
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          first_name: '',
          last_name: '',
          email: '',
          password: '',
          phone_no: '',
        }}
        validationSchema={signUpSchema}
        onSubmit={handleSignUp}
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
            <View style={{ paddingTop: 20 }}>
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
              <ErrorText visible={touched.last_name} error={errors.last_name} />
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
                label="Password"
                prefix={
                  <LockKeyhole width={22} height={22} color={Colors.grey} />
                }
                placeholder={FlutterStrings.enterYourPassword}
                secureTextEntry={securePassword}
                autoCapitalize="none"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                suffix={
                  <TouchableOpacity
                    onPress={() => setSecurePassword(value => !value)}
                    hitSlop={8}
                  >
                    {securePassword ? (
                      <EyeOff size={22} color={Colors.greyIcon} />
                    ) : (
                      <Eye size={22} color={Colors.greyIcon} />
                    )}
                  </TouchableOpacity>
                }
              />
              <ErrorText visible={touched.password} error={errors.password} />
              <View style={{ height: 20 }} />
              <AppTextField
                label={FlutterStrings.phoneNumber}
                prefix={<PhonePrefix />}
                placeholder={FlutterStrings.enterYourPhoneNumber}
                keyboardType="phone-pad"
                maxLength={10}
                onChangeText={handleChange('phone_no')}
                onBlur={handleBlur('phone_no')}
                value={values.phone_no}
              />
              <ErrorText visible={touched.phone_no} error={errors.phone_no} />
              <View style={{ height: 35 }} />
              <GradientButton
                isLoading={isLoading}
                label={FlutterStrings.createAccount}
                onPress={handleSubmit}
              />
              <View style={{ height: 35 }} />
              <AppText
                size={14}
                color={Colors.grey}
                align="center"
                style={{ fontWeight: '400' }}
              >
                {FlutterStrings.orSignInWith}
              </AppText>
              <View style={{ height: 15 }} />
              <GreyPillButton>
                <GoogleLogo width={24} height={24} />
                <AppText
                  font="medium"
                  size={18}
                  color={Colors.primary}
                  style={{ fontWeight: '500' }}
                >
                  {FlutterStrings.signInWithGoogle}
                </AppText>
              </GreyPillButton>
              {Platform.OS === 'ios' && (
                <View style={{ marginTop: 15 }}>
                  <GreyPillButton onPress={() => {}}>
                    <Apple size={32} color={Colors.primary} />
                    <AppText
                      font="medium"
                      size={18}
                      color={Colors.primary}
                      style={{ fontWeight: '500' }}
                    >
                      {FlutterStrings.signInWithApple}
                    </AppText>
                  </GreyPillButton>
                </View>
              )}
            </View>
            <RegisterModal
              isVisible={isRegisterVisible}
              setIsVisible={setIsRegisterVisible}
              email={values?.email}
            />
          </>
        )}
      </Formik>
    </>
  );
}

export default SignUpForm;
