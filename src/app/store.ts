import { configureStore } from "@reduxjs/toolkit";
import commonSlice from "./features/common/commonSlice";
import { pokemonApi } from "@/services/pokemon";
import { setupListeners } from "@reduxjs/toolkit/query";
import authSlice from "./features/auth/authSlice";

export const store = configureStore({
  reducer: {
    common: commonSlice,
    auth: authSlice,
    // Add the generated reducer as a specific top-level slice
    [pokemonApi.reducerPath]: pokemonApi.reducer
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pokemonApi.middleware)
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
