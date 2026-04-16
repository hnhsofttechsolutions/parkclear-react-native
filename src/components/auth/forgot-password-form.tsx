import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';
import EmailImg from '../../assets/images/email.svg';
import ForgotLock from '../../assets/images/forgot_pass_img.svg';
import { FlutterStrings } from '../../constants/flutterStrings';
import { PATHS } from '../../navigation/paths';
import { forgotPasswordSchema } from '../../schema/authSchema';
import { useForgotPasswordMutation } from '../../store/api/authApi';
import { Colors } from '../../utils/colors';
import BottomSheetModal from '../bottom-sheet-modal';
import AppText from '../ui/app-text';
import { AppTextField } from '../ui/app-text-field';
import ErrorText from '../ui/error-text';
import { GradientButton } from '../ui/gradient-button';

interface Props {
  isForgotVisible: boolean;
  setIsForgotVisible: (value: boolean) => void;
}

function ForgotPasswordForm({ isForgotVisible, setIsForgotVisible }: Props) {
  const navigation = useNavigation<any>();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleForgotPassword = async (values: any) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        formData.append(key, values[key]);
      });
      const response = await forgotPassword({ formData }).unwrap();
      if (response?.status) {
        Toast.show({
          type: 'success',
          text1: 'Request Sent!',
          text2: response?.message,
        });
        setIsForgotVisible(false);
        navigation.navigate(PATHS.OtpForgot, {
          email: values?.email,
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Request Failed',
        text2: error?.data?.message,
      });
    }
  };

  return (
    <>
      <BottomSheetModal
        visible={isForgotVisible}
        onClose={() => setIsForgotVisible(false)}
      >
        <Formik
          initialValues={{ email: '' }}
          validationSchema={forgotPasswordSchema}
          onSubmit={handleForgotPassword}
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
              <View style={styles.sheetIconWrap}>
                <ForgotLock width={64} height={64} color="red" />
              </View>
              <AppText
                font="semiBold"
                size={20}
                color={Colors.primary}
                align="center"
                style={{ fontWeight: '600' }}
              >
                {FlutterStrings.forgotPassword}
              </AppText>
              <AppText
                size={16}
                color={Colors.grey}
                align="center"
                style={styles.sheetDescription}
              >
                {FlutterStrings.forgotPasswordDescription}
              </AppText>
              <AppTextField
                prefix={<EmailImg width={22} height={22} />}
                placeholder={FlutterStrings.enterYourEmailAddress}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
              />
              <ErrorText visible={touched.email} error={errors.email} />
              <View style={{ height: 24 }} />
              <GradientButton
                label={FlutterStrings.resetPassword}
                onPress={() => handleSubmit()}
                isLoading={isLoading}
              />
            </>
          )}
        </Formik>
      </BottomSheetModal>
    </>
  );
}

export default ForgotPasswordForm;

const styles = StyleSheet.create({
  sheetIconWrap: {
    alignItems: 'center',
    marginBottom: 18,
  },
  sheetDescription: {
    marginTop: 12,
    marginBottom: 24,
    lineHeight: 26,
    fontWeight: '400',
  },
});
