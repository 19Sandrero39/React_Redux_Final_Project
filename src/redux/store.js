// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import partsReducer from './slices/partsSlice';
import authReducer from './slices/authSlice';

const store = configureStore({
    reducer: {
        parts: partsReducer,
        auth: authReducer,
    },
});

export default store;