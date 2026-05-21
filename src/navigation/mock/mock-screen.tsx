import ChangePasswordScreen from '../../screens/auth/change-password-screen';
import CreateNewPasswordScreen from '../../screens/auth/create-new-password-screen';
import LoginRegisterScreen from '../../screens/auth/login-register-screen';
import OtpForgotScreen from '../../screens/auth/otp-forgot-screen';
import OtpRegisterScreen from '../../screens/auth/otp-register-screen';
import GalleryDetailsScreen from '../../screens/gallery-details-screen';
import GalleryScreen from '../../screens/gallery-screen';
import CameraScreen from '../../screens/home/camera-screen';
import DashboardScreen from '../../screens/home/dashboard-screen';
import CaptureInstructionScreen from '../../screens/home/capture-instruction-screen';
import FutureParkingScreen from '../../screens/home/future-parking-screen';
import ReminderSetScreen from '../../screens/home/reminder-set-screen';
import ResultScreen from '../../screens/home/result-screen';
import MyProfileScreen from '../../screens/my-profile-screen';
import OnboardScreen from '../../screens/start/onboard-screen';
import SettingsScreen from '../../screens/settings-screen';
import AboutUsScreen from '../../screens/settings/about-us-screen';
import ContactUsScreen from '../../screens/settings/contact-us-screen';
import PrivacyPolicyScreen from '../../screens/settings/privacy-policy-screen';
import TermsScreen from '../../screens/settings/terms-screen';
import SubscriptionScreen from '../../screens/subcription/subscription-screen';
import SubscriptionFeatureScreen from '../../screens/subcription/subscription-feature-screen';
import TrialScreen from '../../screens/trial-screen';
import UpdateScreen from '../../screens/update-screen';
import UploadPhotoScreen from '../../screens/upload-photo-screen';
import { PATHS } from '../paths';
import BetaScreen from '../../screens/Beta/Beta-Screen';
import ActiveAlertScreen from '../../screens/active-alert-screen';

export const APP_SCREENS = [
  { name: PATHS.Dashboard, component: DashboardScreen },
  { name: PATHS.Settings, component: SettingsScreen },
  { name: PATHS.AboutUs, component: AboutUsScreen },
  { name: PATHS.PrivacyPolicy, component: PrivacyPolicyScreen },
  { name: PATHS.Terms, component: TermsScreen },
  { name: PATHS.ContactUs, component: ContactUsScreen },
  { name: PATHS.MyProfile, component: MyProfileScreen },
  { name: PATHS.Gallery, component: GalleryScreen },
  { name: PATHS.GalleryDetails, component: GalleryDetailsScreen },
  { name: PATHS.UploadPhoto, component: UploadPhotoScreen },
  { name: PATHS.Subscription, component: SubscriptionScreen },
  { name: PATHS.SubscriptionFeature, component: SubscriptionFeatureScreen },
  { name: PATHS.Update, component: UpdateScreen },
  { name: PATHS.Camera, component: CameraScreen },
  { name: PATHS.FutureParking, component: FutureParkingScreen },
  { name: PATHS.CaptureInstruction, component: CaptureInstructionScreen },
  { name: PATHS.ChangePassword, component: ChangePasswordScreen },
  { name: PATHS.ReminderSet, component: ReminderSetScreen },
  { name: PATHS.Result, component: ResultScreen },
  { name: PATHS.Trial, component: TrialScreen },
  { name: PATHS.Beta, component: BetaScreen },
  { name: PATHS.ActiveAlert, component: ActiveAlertScreen },
];

export const AUTH_SCREENS = [
  { name: PATHS.Onboard, component: OnboardScreen },
  { name: PATHS.LoginRegister, component: LoginRegisterScreen },
  { name: PATHS.OtpRegister, component: OtpRegisterScreen },
  { name: PATHS.OtpForgot, component: OtpForgotScreen },
  { name: PATHS.CreateNewPassword, component: CreateNewPasswordScreen },
  { name: PATHS.Update, component: UpdateScreen },
];
