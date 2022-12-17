import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserState = {
  value: {
    email: string | null;
    username: string | null;
    avatar: string | null;
    profile_id: string | null;
  };
};

const initialState: UserState = {
  value: { email: null, username: null, avatar: null, profile_id: null },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUserProfile: (state: UserState, action: PayloadAction<object>) => {
      state.value = action.payload;
    },
  },
});

export const { updateUserProfile } = userSlice.actions;
export default userSlice.reducer;
