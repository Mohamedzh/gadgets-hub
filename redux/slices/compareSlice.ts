import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { DetailedPhoneType } from "../../types";

const initialState: DetailedPhoneType[] = [];

export const compareSlice = createSlice({
  name: "compare",
  initialState,
  reducers: {
    addToComparison: (state, action: PayloadAction<DetailedPhoneType>) => {
      state.push(action.payload);
    },
    removeFromComparison: (state, action: PayloadAction<DetailedPhoneType>) => {
      return state.filter((item) => item.url !== action.payload.url);
    },
  },
});

export const { addToComparison, removeFromComparison } = compareSlice.actions;
export default compareSlice.reducer;
