import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type User = {
  email: string | null;
  username: string | null;
  picture: string | null;
  token: string | null;
  profile_id: string | null;
};

export type UserState = {
  value: User;
};

const initialState: UserState = {
  value: { email: null, username: null, picture: null, profile_id: null, token: null },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserProfile: (state: UserState, action: PayloadAction<User>) => {
      state.value = action.payload;
    },
  },
});

export const { updateUserProfile } = userSlice.actions;
export default userSlice.reducer;
