import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accesstoken: sessionStorage.getItem("accesstoken") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.accesstoken = action.payload.accesstoken;

      sessionStorage.setItem("accesstoken", action.payload.accesstoken);
    },
    updateToken: (state, action) => {
      state.accesstoken = action.payload.accesstoken;
      sessionStorage.setItem("accesstoken", action.payload.accesstoken);
    },
    logout: (state) => {
      state.user = null;
      state.accesstoken = null;

      sessionStorage.removeItem("accesstoken");
    },
  },
});

export const { setCredentials, logout, updateToken } = authSlice.actions;
export default authSlice.reducer;
