import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  user: any | null;
  hasSeenOnboard: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  hasSeenOnboard: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: any }>,
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    setHasSeenOnboard: state => {
      state.hasSeenOnboard = true;
    },
    logout: state => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { setCredentials, setHasSeenOnboard, logout } = authSlice.actions;
export default authSlice.reducer;
