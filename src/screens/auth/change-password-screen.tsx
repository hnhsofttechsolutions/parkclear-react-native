import { Formik } from 'formik';
import { Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import PasswordImg from '../../assets/images/password.svg';
import SafeAreaWrapper from '../../components/safe-area-wrapper';
import { AppBar } from '../../components/ui/app-bar';
import { AppTextField } from '../../components/ui/app-text-field';
import ErrorText from '../../components/ui/error-text';
import { GradientButton } from '../../components/ui/gradient-button';
import { FlutterStrings } from '../../constants/flutterStrings';
import { changePasswordSchema } from '../../schema/authSchema';
import { useChangePasswordMutation } from '../../store/api/authApi';
import { Colors } from '../../utils/colors';

const ChangePasswordScreen = ({ navigation }: any) => {
  const [secure1, setSecure1] = useState(true);
  const [secure2, setSecure2] = useState(true);
  const [secure3, setSecure3] = useState(true);

  const [createNewPassword, { isLoading }] = useChangePasswordMutation();

  const handleSubmitPassword = async (values: any) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        formData.append(key, values[key]);
      });
      const response = await createNewPassword({ formData }).unwrap();
      if (response?.status) {
        Toast.show({
          type: 'success',
          text1: 'Password Changed!',
          text2: response?.message,
        });
        navigation.goBack();
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Reset Failed',
        text2: error?.data?.message || error?.data?.errors,
      });
    }
  };

  return (
    <SafeAreaWrapper style={styles.safe}>
      <View style={styles.padH}>
        <AppBar
          title={FlutterStrings.changePassword}
          onBack={() => navigation.goBack()}
        />
        <Formik
          initialValues={{
            current_password: '',
            new_password: '',
            confirm_password: '',
          }}
          validationSchema={changePasswordSchema}
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
              <View style={{ height: 30 }} />
              <AppTextField
                label="Current Password"
                prefix={<PasswordImg width={22} height={22} />}
                placeholder="Enter current password"
                secureTextEntry={secure1}
                onChangeText={handleChange('current_password')}
                onBlur={handleBlur('current_password')}
                value={values.current_password}
                suffix={
                  <TouchableOpacity onPress={() => setSecure1(s => !s)}>
                    {secure1 ? (
                      <EyeOff size={22} color={Colors.greyIcon} />
                    ) : (
                      <Eye size={22} color={Colors.greyIcon} />
                    )}
                  </TouchableOpacity>
                }
              />
              <ErrorText
                visible={touched.current_password}
                error={errors.current_password}
              />
              <View style={{ height: 20 }} />
              <AppTextField
                label="New Password"
                prefix={<PasswordImg width={22} height={22} />}
                placeholder="Enter new password"
                secureTextEntry={secure2}
                onChangeText={handleChange('new_password')}
                onBlur={handleBlur('new_password')}
                value={values.new_password}
                suffix={
                  <TouchableOpacity onPress={() => setSecure2(s => !s)}>
                    {secure2 ? (
                      <EyeOff size={22} color={Colors.greyIcon} />
                    ) : (
                      <Eye size={22} color={Colors.greyIcon} />
                    )}
                  </TouchableOpacity>
                }
              />
              <ErrorText
                visible={touched.new_password}
                error={errors.new_password}
              />
              <View style={{ height: 20 }} />
              <AppTextField
                label="Confirm Password"
                prefix={<PasswordImg width={22} height={22} />}
                placeholder="Confirm new password"
                secureTextEntry={secure3}
                onChangeText={handleChange('confirm_password')}
                onBlur={handleBlur('confirm_password')}
                value={values.confirm_password}
                suffix={
                  <TouchableOpacity onPress={() => setSecure3(s => !s)}>
                    {secure3 ? (
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
              <View style={{ height: 30 }} />
              <GradientButton
                label="Submit"
                onPress={() => handleSubmit()}
                isLoading={isLoading}
              />
            </>
          )}
        </Formik>
      </View>
    </SafeAreaWrapper>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  padH: { paddingHorizontal: 20 },
});
