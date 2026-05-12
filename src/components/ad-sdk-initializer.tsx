import { useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import AdService from '../services/ad-service';
import { useGetAdStatusQuery } from '../store/api/settingApi';
import { RootState } from '../store/store';

/**
 * LevelPlay SDK should only initialize when the backend enables ads for this user.
 * Screens gate UI with the same flag; this avoids starting the mediation SDK when ads are off.
 */
export function AdSdkInitializer() {
  const token = useSelector((s: RootState) => s.auth.token);
  const isPaid = Boolean(useSelector((s: RootState) => s.auth.user?.is_paid));
  const skip = !token || isPaid;

  const { data: adStatus, isSuccess } = useGetAdStatusQuery(undefined, {
    skip,
  });

  useLayoutEffect(() => {
    if (skip || !isSuccess || !adStatus?.status) return;
    void AdService.init();
  }, [skip, isSuccess, adStatus?.status]);

  return null;
}
