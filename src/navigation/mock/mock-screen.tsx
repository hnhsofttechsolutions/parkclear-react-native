import HomeScreen from '../../screens/home/home-screen';
import { PATHS } from '../paths';
import ResultScreen from '../../screens/home/result-screen';
import OnboardScreen from '../../screens/onboard-screen';
import LoginRegisterScreen from '../../screens/auth/login-register-screen';
import TrialScreen from '../../screens/trial-screen';
import CreateNewPasswordScreen from '../../screens/auth/create-new-password-screen';
import DashboardScreen from '../../screens/home/dashboard-screen';
import SettingsScreen from '../../screens/settings-screen';
import AboutUsScreen from '../../screens/settings/about-us-screen';
import PrivacyPolicyScreen from '../../screens/settings/privacy-policy-screen';
import TermsScreen from '../../screens/settings/terms-screen';
import ContactUsScreen from '../../screens/settings/contact-us-screen';
import MyProfileScreen from '../../screens/my-profile-screen';
import GalleryScreen from '../../screens/gallery-screen';
import GalleryDetailsScreen from '../../screens/gallery-details-screen';
import UploadPhotoScreen from '../../screens/upload-photo-screen';
import SubscriptionScreen from '../../screens/subcription/subscription-screen';
import SubscriptionPackagesScreen from '../../screens/subcription/subscriptionPackagesScreen';
import UpdateScreen from '../../screens/update-screen';
import CameraScreen from '../../screens/camera-screen';
import OtpRegisterScreen from '../../screens/auth/otp-register-screen';
import OtpForgotScreen from '../../screens/auth/otp-forgot-screen';
import SplashScreen from '../../screens/splash-screen';
import ReminderSetScreen from '../../screens/home/reminder-set-screen';

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
  { name: PATHS.SubscriptionPackages, component: SubscriptionPackagesScreen },
  { name: PATHS.Update, component: UpdateScreen },
  { name: PATHS.Camera, component: CameraScreen },

  { name: PATHS.ReminderSet, component: ReminderSetScreen },
  { name: PATHS.Home, component: HomeScreen },
  { name: PATHS.Result, component: ResultScreen },
];

export const AUTH_SCREENS = [
  { name: PATHS.Onboard, component: OnboardScreen },
  { name: PATHS.Trial, component: TrialScreen },
  { name: PATHS.LoginRegister, component: LoginRegisterScreen },
  { name: PATHS.OtpRegister, component: OtpRegisterScreen },
  { name: PATHS.OtpForgot, component: OtpForgotScreen },
  { name: PATHS.CreateNewPassword, component: CreateNewPasswordScreen },
  { name: PATHS.Splash, component: SplashScreen },
];
