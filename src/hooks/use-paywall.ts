import { PAYWALL_RESULT } from 'react-native-purchases-ui';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import { RootState } from '../store/store';
import {
  handlePaywallResult,
  initRevenueCat,
  showPaywall,
} from '../utils/revenuecat-service';

interface UsePaywallProps {
  triggerGetProfile: () => any;
  onClose: () => any;
}

export const usePaywall = ({ onClose, triggerGetProfile }: UsePaywallProps) => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);

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
      console.log(error);
    }
  };
  return { openPaywall };
};
