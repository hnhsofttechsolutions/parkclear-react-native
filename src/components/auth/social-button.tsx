import { appleAuth } from '@invertase/react-native-apple-authentication';
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Platform, View } from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch } from 'react-redux';
import AppleLogo from '../../assets/images/apple.svg';
import GoogleLogo from '../../assets/images/google_logo.svg';
import { FlutterStrings } from "../../constants/flutterStrings";
import { useAppleLoginMutation, useGoogleLoginMutation } from "../../store/api/authApi";
import { setCredentials } from '../../store/slices/authSlice';
import { Colors } from "../../utils/colors";
import AppText from "../ui/app-text";
import { GreyPillButton } from "../ui/gradient-button";
import PageLoader from '../ui/page-loader';

function SocialButtons() {
    const dispatch = useDispatch();
    const [googleLogin, { isLoading: isLoadingGoogle }] = useGoogleLoginMutation();
    const [appleLogin, { isLoading: isLoadingApple }] = useAppleLoginMutation();

    async function onGoogleButtonPress() {
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const result = await GoogleSignin.signIn() as any;
            const token = result?.data?.idToken;
            const formData = new FormData();
            formData.append('token', token)
            const response = await googleLogin({ formData }).unwrap();
            if (response?.status) {
                dispatch(
                    setCredentials({
                        token: response?.access_token,
                        user: response?.data,
                    }),
                );
                Toast.show({
                    type: 'success',
                    text1: 'Login Successful!',
                    text2: response?.message,
                });
            }
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2: error?.data?.message || 'Invalid credentials, please try again.',
            });
        }
    }

    async function onAppleButtonPress() {
        try {
            const appleAuthRequestResponse = await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGIN,
                requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
            });

            console.log('appleAuthRequestResponse---->', appleAuthRequestResponse);

            const formData = new FormData();
            formData.append('token', appleAuthRequestResponse?.identityToken);
            formData.append('first_name', appleAuthRequestResponse?.fullName?.givenName);
            formData.append('last_name', appleAuthRequestResponse?.fullName?.familyName);
            const response = await appleLogin({ formData }).unwrap();
            if (response?.status) {
                dispatch(
                    setCredentials({
                        token: response?.access_token,
                        user: response?.data,
                    }),
                );
                Toast.show({
                    type: 'success',
                    text1: 'Login Successful!',
                    text2: response?.message,
                });
            }
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2: error?.data?.message || 'Invalid credentials, please try again.',
            });
        }
    }

    return (
        <>
            <PageLoader visible={isLoadingGoogle || isLoadingApple} />
            <GreyPillButton onPress={onGoogleButtonPress}>
                <GoogleLogo width={24} height={24} />
                <AppText font="medium" color={Colors.primary}>
                    {FlutterStrings.signInWithGoogle}
                </AppText>
            </GreyPillButton>
            {Platform.OS === 'ios' ? (
                <View style={{ marginTop: 15 }}>
                    <GreyPillButton onPress={onAppleButtonPress}>
                        <AppleLogo width={24} height={24} />
                        <AppText font="medium" color={Colors.primary}>
                            {FlutterStrings.signInWithApple}
                        </AppText>
                    </GreyPillButton>
                </View>
            ) : null}
        </>
    );
}

export default SocialButtons;


