
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
 proximity: [],
 liked: [],
 isSwipeVisible: true,
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
    if(state.proximity.length === 0) {
      state.isSwipeVisible =  false
    }
   },
   onDisLike: (state, action) => {
    state.proximity.shift()
   },
   setSwipeVisibility: (state, action) => {
      state.isSwipeVisible = !state.isSwipeVisible
   }
 },
});

export const { addNewLike, getDefaultPlaces, updateAndLikePlaces, onDisLike, setSwipeVisibility} = placesSlice.actions;
export default placesSlice.reducer;