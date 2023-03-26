import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoged: localStorage.getItem("isLoged") || false,
};

export const loginSlice = createSlice({
  name: "log",
  initialState,
  reducers: {
    setIsLoged: (state, action) => {
      state.isLoged = action.payload;
      localStorage.setItem("isLoged", action.payload);
    },
  },
});

export const { setIsLoged } = loginSlice.actions;
export default loginSlice.reducer;
