import { RootState } from "@/app/store";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CommonState {
  sidebarVisible: boolean;
  loading: {
    isLoading: boolean;
    message: string;
  };
}

const initialState: CommonState = {
  sidebarVisible: false,
  loading: {
    isLoading: false,
    message: ""
  }
};

export const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarVisible = !state.sidebarVisible;
    },
    setLoading: (
      state,
      action: PayloadAction<Partial<CommonState["loading"]>>
    ) => {
      state.loading.isLoading = action.payload?.isLoading;
      state.loading.message = action.payload?.message;
    }
  }
});

// Action creators are generated for each case reducer function
export const { toggleSidebar, setLoading } = commonSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectLoading = (state: RootState) => state.common.loading;
export const selectSidebarVisible = (state: RootState) =>
  state.common.sidebarVisible;

export default commonSlice.reducer;
