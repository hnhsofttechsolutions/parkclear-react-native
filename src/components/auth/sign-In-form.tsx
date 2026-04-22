import { Formik } from 'formik';
import { Apple, Eye, EyeOff, LockKeyhole } from 'lucide-react-native';
import React, { useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import GoogleLogo from '../../assets/images/google_logo.svg';
import { FlutterStrings } from '../../constants/flutterStrings';
import { loginSchema } from '../../schema/authSchema';
import { useLoginMutation } from '../../store/api/authApi';
import { setCredentials } from '../../store/slices/authSlice';
import { Colors } from '../../utils/colors';
import AppText from '../ui/app-text';
import { AppTextField } from '../ui/app-text-field';
import ErrorText from '../ui/error-text';
import { GradientButton, GreyPillButton } from '../ui/gradient-button';
import PhonePrefix from '../ui/phone-prefix';
import ForgotPasswordForm from './forgot-password-form';

function SignInForm({ navigation }: any) {
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [securePassword, setSecurePassword] = useState(true);
  const [isForgotVisible, setIsForgotVisible] = useState(false);

  const handleLogin = async (values: any) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        formData.append(key, values[key]);
      });
      const response = await login({ formData }).unwrap();
      if (response?.status) {
        dispatch(
          setCredentials({
            token: response?.access_token,
            user: response?.data,
          }),
        );
        Toast.show({
          type: 'success',
          text1: 'Login Successful!',
          text2: response?.message,
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error?.data?.message || 'Invalid credentials, please try again.',
      });
    }
  };

  return (
    <>
      <Formik
        initialValues={{ phone_no: '', password: '' }}
        validationSchema={loginSchema}
        onSubmit={handleLogin}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={{ paddingTop: 20 }}>
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
            <View style={{ height: 20 }} />
            <AppTextField
              label={FlutterStrings.password}
              prefix={
                <LockKeyhole width={22} height={22} color={Colors.greyIcon} />
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
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setIsForgotVisible(true)}
              style={styles.forgotButton}
            >
              <AppText font="medium" size={14} color={Colors.primary}>
                {FlutterStrings.forgotPassword}
              </AppText>
            </TouchableOpacity>
            <View style={{ height: 20 }} />
            <GradientButton
              label={FlutterStrings.signIn}
              onPress={handleSubmit}
              isLoading={isLoading}
            />
            <View style={{ height: 35 }} />
            <AppText size={14} color={Colors.grey} align="center">
              {FlutterStrings.orSignInWith}
            </AppText>
            <View style={{ height: 15 }} />
            <GreyPillButton>
              <GoogleLogo width={24} height={24} />
              <AppText font="medium" color={Colors.primary}>
                {FlutterStrings.signInWithGoogle}
              </AppText>
            </GreyPillButton>
            {Platform.OS === 'ios' ? (
              <View style={{ marginTop: 15 }}>
                <GreyPillButton onPress={() => {}}>
                  <Apple size={32} color={Colors.primary} />
                  <AppText font="medium" color={Colors.primary}>
                    {FlutterStrings.signInWithApple}
                  </AppText>
                </GreyPillButton>
              </View>
            ) : null}
          </View>
        )}
      </Formik>

      <ForgotPasswordForm
        isForgotVisible={isForgotVisible}
        setIsForgotVisible={setIsForgotVisible}
      />
    </>
  );
}

export default SignInForm;

const styles = StyleSheet.create({
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
});
