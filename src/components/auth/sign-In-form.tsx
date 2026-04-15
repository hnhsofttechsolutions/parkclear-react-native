import { Apple } from 'lucide-react-native';
import { Platform, View } from 'react-native';
import GoogleLogo from '../../assets/images/google_logo.svg';
import { FlutterStrings } from '../../constants/flutterStrings';
import { PATHS } from '../../navigation/paths';
import { Colors } from '../../utils/colors';
import { GradientButton, GreyPillButton } from '../ui/gradient-button';
import PhonePrefix from '../ui/phone-prefix';
import AppText from '../ui/app-text';
import { AppTextField } from '../ui/app-text-field';

function SignInForm({ navigation }: any) {
  return (
    <View style={{ paddingTop: 20 }}>
      <AppTextField
        label={FlutterStrings.phoneNumber}
        prefix={<PhonePrefix />}
        placeholder={FlutterStrings.enterYourPhoneNumber}
        keyboardType="phone-pad"
        maxLength={10}
      />
      <View style={{ height: 35 }} />
      <GradientButton
        label={FlutterStrings.signIn}
        onPress={() =>
          navigation.navigate(PATHS.Otp, { verificationId: 'demo-id' })
        }
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
      <GreyPillButton onPress={() => navigation.navigate(PATHS.Trial)}>
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
      {Platform.OS === 'ios' ? (
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
      ) : null}
    </View>
  );
}

export default SignInForm;
