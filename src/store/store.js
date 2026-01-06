import { configureStore } from '@reduxjs/toolkit';
import mapDropReducer from './slices/mapDropSlice';

export const store = configureStore({
    reducer: {
        mapDrop: mapDropReducer,
    },
});
