import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PATHS } from './paths';

export type RootStackParamList = {
  [PATHS.Home]: undefined;
  [PATHS.Result]: {
    data: {
      id: string;
      summarize_message: string;
      end_time_iso: string;
      has_arrow: boolean;
      park_status: boolean;
      right_end_time_iso: string;
      left_end_time_iso: string;
      days_offset: number;
    };
    screen_name: string;
  };
  [PATHS.ReminderSet]: {
    reminderMinutes: number;
    parking_end_time_iso: string;
    reminder_time_iso: string;
    alert_id: string;
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
