import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import Toast from 'react-native-toast-message';

import SafeAreaWrapper from '../../components/safe-area-wrapper';
import AppText from '../../components/ui/app-text';
import ErrorText from '../../components/ui/error-text';
import { GradientButton } from '../../components/ui/gradient-button';
import { FlutterStrings } from '../../constants/flutterStrings';
import { PATHS } from '../../navigation/paths';
import { useOtpRegisterMutation } from '../../store/api/authApi';
import { logSignupSuccess } from '../../utils/analytics-service';
import { Colors } from '../../utils/colors';

const CELL_COUNT = 5;

const OtpRegisterScreen = ({ navigation, route }: any) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const email = route?.params?.email || 'user@example.com';

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [useOtpRegister, { isLoading }] = useOtpRegisterMutation();

  const handleVerify = async () => {
    if (value.length < CELL_COUNT) {
      setError('Please enter a valid 5-digit OTP');
      return;
    }
    try {
      setError('');
      const formData = new FormData();
      formData.append('email', email);
      formData.append('otp', value);
      const response = await useOtpRegister({ formData }).unwrap();
      if (response?.status) {
        void logSignupSuccess(response?.data?.id, 'email');
        Toast.show({
          type: 'success',
          text1: 'Verified Successfully!',
          text2: response?.message,
        });
        navigation.navigate(PATHS.LoginRegister);
      }
    } catch (err: any) {
      setError(err?.data?.message || 'Invalid OTP. Please try again.');
      Toast.show({
        type: 'error',
        text1: 'Verification Failed',
        text2: err?.data?.message || 'Something went wrong',
      });
    }
  };

  return (
    <SafeAreaWrapper style={styles.safe}>
      <View style={styles.pad}>
        <AppText font="semiBold" size={24} color={Colors.primary}>
          {FlutterStrings.pleaseCheckYourMsg}
        </AppText>
        <AppText
          size={14}
          color={Colors.grey}
          style={{ marginTop: 10, lineHeight: 20 }}
        >
          We've sent a 5-digit verification code to{' '}
          <AppText font="semiBold" size={14} color={Colors.primary}>
            {email}
          </AppText>
          . Please enter the code below to continue.
        </AppText>
        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={text => {
            setValue(text);
            setError('');
          }}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <View
              key={index}
              style={[
                styles.cell,
                isFocused && styles.focusCell,
                error ? { borderColor: 'red' } : null,
              ]}
              onLayout={getCellOnLayoutHandler(index)}
            >
              <AppText size={22} font="semiBold" color={Colors.primary}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </AppText>
            </View>
          )}
        />
        <View style={{ marginVertical: 10, height: 20 }}>
          <ErrorText visible={!!error} error={error} />
        </View>
        <GradientButton
          isLoading={isLoading}
          label={FlutterStrings.verification}
          onPress={handleVerify}
          style={{ marginTop: 20 }}
        />
      </View>
    </SafeAreaWrapper>
  );
};

export default OtpRegisterScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  pad: { flex: 1, padding: 25 },
  codeFieldRoot: { marginTop: 30 },
  cell: {
    width: 45,
    height: 55,
    lineHeight: 55,
    fontSize: 24,
    borderWidth: 1.5,
    borderColor: Colors.textFieldBorder,
    borderRadius: 12,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  focusCell: {
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
    elevation: 3,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
