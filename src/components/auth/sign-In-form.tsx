import { Formik } from 'formik';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { FlutterStrings } from '../../constants/flutterStrings';
import { loginSchema } from '../../schema/authSchema';
import { useLoginMutation } from '../../store/api/authApi';
import { setCredentials } from '../../store/slices/authSlice';
import { logLoginSuccess } from '../../utils/analytics-service';
import { Colors } from '../../utils/colors';
import AppText from '../ui/app-text';
import { AppTextField } from '../ui/app-text-field';
import ErrorText from '../ui/error-text';
import { GradientButton } from '../ui/gradient-button';
import PhonePrefix from '../ui/phone-prefix';
import ForgotPasswordForm from './forgot-password-form';
import SocialButtons from './social-button';
import { getCachedFcmToken } from '../../utils/fcm-token';

function SignInForm({ navigation }: any) {
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [securePassword, setSecurePassword] = useState(true);
  const [isForgotVisible, setIsForgotVisible] = useState(false);

  const handleLogin = async (values: any) => {
    try {
      const fcmToken = getCachedFcmToken();
      const formData = new FormData();
      formData.append('fcm_token', fcmToken ?? '');
      Object.keys(values).forEach(key => {
        formData.append(key, values[key]);
      });
      const response = await login({ formData }).unwrap();
      if (response?.status) {
        void logLoginSuccess(response?.data?.id, 'email');
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
      console.log('error---->', error);
      Toast.show({
        type: 'info',
        text2: error?.data?.message || 'New account, please Sign Up',
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
            <SocialButtons mode="login" />
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
