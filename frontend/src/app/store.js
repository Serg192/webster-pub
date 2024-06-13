import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storageSession from "redux-persist/es/storage/session";

import { apiSlice } from "./api/apiSlice";
import authReducer from "../features/auth/authSlice";
import canvasReducer from "../features/canvas/canvasSlice";
import stageReducer from "../features/canvas/stageSlice";

import authTransform from "../features/auth/authTransform";

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
  canvas: canvasReducer,
  stage: stageReducer,
});

const persistConfig = {
  key: "root",
  storage: storageSession,
  version: 1,
  transforms: [authTransform],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      apiSlice.middleware
    ),
  devTools: true,
});

export const persistor = persistStore(store);
