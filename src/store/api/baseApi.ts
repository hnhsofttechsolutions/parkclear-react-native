import { CommonActions } from '@react-navigation/native';
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
} from '@reduxjs/toolkit/query/react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Purchases from 'react-native-purchases';
import { navigationRef } from '../../navigation/RootNavigation';
import { PATHS } from '../../navigation/paths';
import { logout } from '../slices/authSlice';

/** Same cleanup as manual logout (side drawer), without blocking on failures. */
async function signOutThirdPartyForSessionEnd() {
  try {
    await GoogleSignin.signOut();
  } catch (e) {
    console.log('Session-end Google sign-out error', e);
  }
  try {
    if (!(await Purchases.isAnonymous())) {
      await Purchases.logOut();
    }
  } catch (e) {
    console.log('Session-end RevenueCat logOut error', e);
  }
}

// export const baseURL = "https://laree-appraisive-randa.ngrok-free.dev/"
// export const baseURL = "http://167.114.96.66:2009/"
// export const baseURL = 'https://jlsxgq9c-8000.inc1.devtunnels.ms/';
// export const baseURL = 'http://167.114.96.66:3209/';
export const baseURL = 'https://parkclearapi.hnhsofttechsolutions.com/';

type AuthSliceState = {
  auth: { token: string | null | undefined; hasSeenOnboard: boolean };
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: baseURL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as AuthSliceState).auth?.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    return headers;
  },
});

const baseQueryWith401Logout: BaseQueryFn = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  const err = result.error;
  const isUnauthorized =
    err != null && typeof err === 'object' && 'status' in err && err.status === 401;

  if (!isUnauthorized) {
    return result;
  }

  const { token, hasSeenOnboard } = (api.getState() as AuthSliceState).auth;

  // Avoid clearing session / resetting nav when 401 happens on login-style calls (no active session).
  if (!token) {
    return result;
  }

  await signOutThirdPartyForSessionEnd();
  api.dispatch(logout());
  api.dispatch(baseApi.util.resetApiState());

  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: hasSeenOnboard ? PATHS.LoginRegister : PATHS.Onboard },
        ],
      }),
    );
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWith401Logout,
  tagTypes: ['UPLOAD_IMAGE'],
  endpoints: () => ({}),
});
