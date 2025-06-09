import { configureStore } from '@reduxjs/toolkit';
import authReducer from './store/authSlice';
import usersReducer from './store/usersSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
  },
});

export default store; 