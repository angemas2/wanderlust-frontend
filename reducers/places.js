
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
 value: [],
};

export const placesSlice = createSlice({
 name: 'places',

  initialState,
 reducers: {
   addNewPlace: (state, action) => {
     state.value.push(action.payload);
    //  state.value = []
   },
 },
});

export const { addNewPlace } = placesSlice.actions;
export default placesSlice.reducer;