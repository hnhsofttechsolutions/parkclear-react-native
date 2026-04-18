import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PATHS } from './paths';

export type RootStackParamList = {
  [PATHS.Home]: undefined;
  [PATHS.Result]: {
    variant: 'resolve' | 'reject';
    summarize_message: string;
  };
  [PATHS.ReminderSet]: {
    reminderMinutes: number;
  };

  [PATHS.Splash]: undefined;
  [PATHS.Onboard]: undefined;
  [PATHS.LoginRegister]: undefined;
  [PATHS.Trial]: undefined;
  [PATHS.OtpRegister]: { verificationId?: string };
  [PATHS.CreateNewPassword]: undefined;
  [PATHS.Dashboard]: undefined;
  [PATHS.Settings]: undefined;
  [PATHS.AboutUs]: undefined;
  [PATHS.PrivacyPolicy]: undefined;
  [PATHS.Terms]: undefined;
  [PATHS.ContactUs]: undefined;
  [PATHS.MyProfile]: undefined;
  [PATHS.Gallery]: undefined;
  [PATHS.UploadPhoto]: undefined;
  [PATHS.Subscription]: undefined;
  [PATHS.SubscriptionPackages]: undefined;
  [PATHS.Update]: undefined;
  [PATHS.Camera]: undefined;
  [PATHS.GalleryDetails]: { imageUrl: string };
};

export type HomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  typeof PATHS.Home
>;
export type ResultScreenProps = NativeStackScreenProps<
  RootStackParamList,
  typeof PATHS.Result
>;
export type ReminderSetScreenProps = NativeStackScreenProps<
  RootStackParamList,
  typeof PATHS.ReminderSet
>;
