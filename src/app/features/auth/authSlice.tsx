import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { UserInfo } from "firebase/auth";

const initialState: UserInfo = {
  displayName: "",
  email: "",
  phoneNumber: "",
  photoURL: "",
  providerId: "",
  uid: ""
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<UserInfo>) => {
      state.displayName = action.payload.displayName;
      state.email = action.payload.email;
      state.phoneNumber = action.payload.phoneNumber;
      state.photoURL = action.payload.photoURL;
      state.providerId = action.payload.providerId;
      state.uid = action.payload.uid;
    },
    clearAuth: (state) => {
      state.displayName = "";
      state.email = "";
      state.phoneNumber = "";
      state.photoURL = "";
      state.providerId = "";
      state.uid = "";
    }
  }
});

// Action creators are generated for each case reducer function
export const { setAuth, clearAuth } = authSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAuthData = (state: any) => state.auth;

export default authSlice.reducer;
