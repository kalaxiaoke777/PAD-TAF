import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

let token = localStorage.getItem("token");
let user = null;
if (token) {
  try {
    const decoded = jwtDecode(token);
    user = {
      username: decoded.username,
      role: decoded.role,
      id: decoded.sub,
    };
  } catch {
    token = null;
    user = null;
    localStorage.removeItem("token");
  }
}

const initialState = {
  user,
  token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      // 持久化到localStorage
      if (action.payload.token) {
        localStorage.setItem("token", action.payload.token);
      }
    },
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
