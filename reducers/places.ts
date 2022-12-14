import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Proximity = {
  key: number;
  name: string | undefined;
  latitude: number;
  longitude: number;
  photo: string | null;
 rating:number | null;
 ratingTotal:number | null;

};

export type PlaceState = {
  value: {
    proximity: Proximity[];
    liked: Proximity[];
    isSwipeVisible: boolean;
  };
};

const initialState: PlaceState = {
  value: {
    proximity: [],
    liked: [],
    isSwipeVisible: true,
  },
};

export const placesSlice = createSlice({
  name: 'places',
  initialState,
  reducers: {
    addNewLike: (state: PlaceState, action: PayloadAction<Proximity>) => {
      state.value.liked.push(action.payload);
    },
    getDefaultPlaces: (state: PlaceState, action: PayloadAction<Proximity>) => {
      state.value.proximity.push(action.payload);
    },
    updateAndLikePlaces: (state: PlaceState, action: PayloadAction<Proximity>) => {
      state.value.liked.push(action.payload);
      state.value.proximity.shift();
      if (state.value.proximity.length === 0) {
        state.value.isSwipeVisible = false;
      }
    },
    onDisLike: (state: PlaceState) => {
      state.value.proximity.shift();
    },
    setSwipeVisibility: (state: PlaceState) => {
      state.value.isSwipeVisible = !state.value.isSwipeVisible;
    },
    resetLike: (state: PlaceState) => {
      state.value.liked = []
    }
  },
});

export const { resetLike, addNewLike, getDefaultPlaces, updateAndLikePlaces, onDisLike, setSwipeVisibility } =
  placesSlice.actions;
export default placesSlice.reducer;
