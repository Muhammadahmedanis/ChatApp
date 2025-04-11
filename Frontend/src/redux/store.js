import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice.js';
import messageReducer from './slices/messageSlice.js';

const store = configureStore({
    reducer: {
        auth: authReducer,
        message: messageReducer
    }
})

export default store;