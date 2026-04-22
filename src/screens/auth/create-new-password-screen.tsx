import { Formik } from 'formik';
import { Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import PasswordImg from '../../assets/images/password.svg';
import SafeAreaWrapper from '../../components/safe-area-wrapper';
import AppText from '../../components/ui/app-text';
import { AppTextField } from '../../components/ui/app-text-field';
import ErrorText from '../../components/ui/error-text';
import { GradientButton } from '../../components/ui/gradient-button';
import { FlutterStrings } from '../../constants/flutterStrings';
import { PATHS } from '../../navigation/paths';
import { resetPasswordSchema } from '../../schema/authSchema';
import { useCreateNewPasswordMutation } from '../../store/api/authApi';
import { Colors } from '../../utils/colors';

const CreateNewPasswordScreen = ({ navigation, route }: any) => {
  const [secure1, setSecure1] = useState(true);
  const [secure2, setSecure2] = useState(true);
  const email = route?.params?.email;
  const otp = route?.params?.otp;

  const [createNewPassword, { isLoading }] = useCreateNewPasswordMutation();

  const handleSubmitPassword = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('otp', otp);
      Object.keys(values).forEach(key => {
        formData.append(key, values[key]);
      });
      const response = await createNewPassword({ formData }).unwrap();
      if (response?.status) {
        Toast.show({
          type: 'success',
          text1: 'Password Updated!',
          text2: response?.message,
        });
        navigation.reset({
          index: 0,
          routes: [{ name: PATHS.LoginRegister }],
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Reset Failed',
        text2: error?.data?.message,
      });
    }
  };

  return (
    <SafeAreaWrapper style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.pad}
        keyboardShouldPersistTaps="handled"
      >
        <AppText font="semiBold" size={20} color={Colors.primary}>
          {FlutterStrings.createNewPassword}
        </AppText>
        <AppText color={Colors.grey} style={{ marginTop: 5 }}>
          {FlutterStrings.passDescription}
        </AppText>
        <Formik
          initialValues={{ password: '', confirm_password: '' }}
          validationSchema={resetPasswordSchema}
          onSubmit={handleSubmitPassword}
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
              <View style={{ height: 35 }} />
              <AppText
                font="medium"
                size={16}
                color={Colors.primary}
                style={{ marginBottom: 10 }}
              >
                {FlutterStrings.newPassword}
              </AppText>
              <AppTextField
                prefix={<PasswordImg width={22} height={22} />}
                placeholder={FlutterStrings.enterYourNewPassword}
                secureTextEntry={secure1}
                textContentType="newPassword"
                autoCapitalize="none"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                suffix={
                  <TouchableOpacity
                    onPress={() => setSecure1(s => !s)}
                    hitSlop={8}
                  >
                    {secure1 ? (
                      <EyeOff size={22} color={Colors.greyIcon} />
                    ) : (
                      <Eye size={22} color={Colors.greyIcon} />
                    )}
                  </TouchableOpacity>
                }
              />
              <ErrorText visible={touched.password} error={errors.password} />
              <View style={{ height: 20 }} />
              <AppText
                font="medium"
                size={16}
                color={Colors.primary}
                style={{ marginBottom: 10 }}
              >
                {FlutterStrings.confirmYourNewPassword}
              </AppText>
              <AppTextField
                prefix={<PasswordImg width={22} height={22} />}
                placeholder={FlutterStrings.confirmYourNewPassword}
                secureTextEntry={secure2}
                textContentType="newPassword"
                autoCapitalize="none"
                onChangeText={handleChange('confirm_password')}
                onBlur={handleBlur('confirm_password')}
                value={values.confirm_password}
                suffix={
                  <TouchableOpacity
                    onPress={() => setSecure2(s => !s)}
                    hitSlop={8}
                  >
                    {secure2 ? (
                      <EyeOff size={22} color={Colors.greyIcon} />
                    ) : (
                      <Eye size={22} color={Colors.greyIcon} />
                    )}
                  </TouchableOpacity>
                }
              />
              <ErrorText
                visible={touched.confirm_password}
                error={errors.confirm_password}
              />
              <View style={{ height: 35 }} />
              <GradientButton
                label={FlutterStrings.submit}
                onPress={() => handleSubmit()}
                isLoading={isLoading}
              />
            </>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default CreateNewPasswordScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  pad: { padding: 20, paddingBottom: 40 },
});
