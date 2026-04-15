import { Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import SafeAreaWrapper from '../../components/safe-area-wrapper';
import { GradientButton } from '../../components/ui/gradient-button';
import AppText from '../../components/ui/app-text';
import { FlutterStrings } from '../../constants/flutterStrings';
import { PATHS } from '../../navigation/paths';
import { Colors } from '../../utils/colors';
import PasswordImg from '../../assets/images/password.svg';
import { AppTextField } from '../../components/ui/app-text-field';

const CreateNewPasswordScreen = ({ navigation }: any) => {
  const [secure1, setSecure1] = useState(true);
  const [secure2, setSecure2] = useState(true);

  return (
    <SafeAreaWrapper style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.pad}
        keyboardShouldPersistTaps="handled"
      >
        <AppText
          font="semiBold"
          size={20}
          color={Colors.primary}
          style={{ fontWeight: '600' }}
        >
          {FlutterStrings.createNewPassword}
        </AppText>
        <AppText
          size={17}
          color={Colors.grey}
          style={{ marginTop: 8, fontWeight: '400' }}
        >
          {FlutterStrings.passDescription}
        </AppText>
        <View style={{ height: 35 }} />
        <AppText
          font="medium"
          size={16}
          color={Colors.primary}
          style={{ marginBottom: 10, fontWeight: '500' }}
        >
          {FlutterStrings.newPassword}
        </AppText>
        <AppTextField
          prefix={<PasswordImg width={22} height={22} />}
          placeholder={FlutterStrings.enterYourNewPassword}
          secureTextEntry={secure1}
          textContentType="newPassword"
          suffix={
            <TouchableOpacity onPress={() => setSecure1(s => !s)} hitSlop={8}>
              {secure1 ? (
                <EyeOff size={22} color={Colors.greyIcon} />
              ) : (
                <Eye size={22} color={Colors.greyIcon} />
              )}
            </TouchableOpacity>
          }
        />
        <View style={{ height: 20 }} />
        <AppText
          font="medium"
          size={16}
          color={Colors.primary}
          style={{ marginBottom: 10, fontWeight: '500' }}
        >
          {FlutterStrings.confirmPassword}
        </AppText>
        <AppTextField
          prefix={<PasswordImg width={22} height={22} />}
          placeholder={FlutterStrings.confirmYourNewPassword}
          secureTextEntry={secure2}
          textContentType="newPassword"
          suffix={
            <TouchableOpacity onPress={() => setSecure2(s => !s)} hitSlop={8}>
              {secure2 ? (
                <EyeOff size={22} color={Colors.greyIcon} />
              ) : (
                <Eye size={22} color={Colors.greyIcon} />
              )}
            </TouchableOpacity>
          }
        />
        <View style={{ height: 35 }} />
        <GradientButton
          label={FlutterStrings.submit}
          onPress={() => navigation.navigate(PATHS.LoginRegister)}
        />
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default CreateNewPasswordScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  pad: { padding: 20, paddingBottom: 40 },
});
