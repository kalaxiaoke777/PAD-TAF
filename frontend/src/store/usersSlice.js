import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action) {
      state.list = action.payload;
    },
    clearUsers(state) {
      state.list = [];
    },
  },
});

export const { setUsers, clearUsers } = usersSlice.actions;
export default usersSlice.reducer; 