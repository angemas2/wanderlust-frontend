
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
 proximity: [],
 liked: [],
};

export const placesSlice = createSlice({
 name: 'places',

  initialState,
 reducers: {
   addNewLike: (state, action) => {
     state.liked.push(action.payload);
    //  state.value = []
   },
   getDefaultPlaces: (state, action) => {
    state.proximity.push(action.payload);
   },
   updateAndLikePlaces: (state, action) => {
    state.liked.push(action.payload);
    state.proximity.shift()
   },
   onDisLike: (state, action) => {
    state.proximity.shift()
   }
 },
});

export const { addNewLike, getDefaultPlaces, updateAndLikePlaces, onDisLike} = placesSlice.actions;
export default placesSlice.reducer;