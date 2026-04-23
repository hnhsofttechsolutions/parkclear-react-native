import { PAYWALL_RESULT } from 'react-native-purchases-ui';
import { useDispatch, useSelector } from 'react-redux';
import { useLazyGetProfileQuery } from '../store/api/settingApi';
import { setCredentials } from '../store/slices/authSlice';
import { RootState } from '../store/store';
import {
  handlePaywallResult,
  initRevenueCat,
  showPaywall,
} from '../utils/revenuecat-service';

interface UsePaywallProps {
  onClose: () => any;
}

export const usePaywall = ({ onClose }: UsePaywallProps) => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [triggerGetProfile, { isLoading: isProfileLoading }] =
    useLazyGetProfileQuery();

  const openPaywall = async () => {
    try {
      await initRevenueCat(user?.id);
      const result = await showPaywall();
      if (
        result === PAYWALL_RESULT.PURCHASED ||
        result === PAYWALL_RESULT.RESTORED
      ) {
        const profileR = await triggerGetProfile().unwrap();
        dispatch(setCredentials({ token, user: profileR?.data }));
        onClose();
      }
      handlePaywallResult(result);
    } catch (error) {
      console.log(error, 'error');
    }
  };
  return { openPaywall, isProfileLoading };
};
