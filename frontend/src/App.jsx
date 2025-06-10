import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import UserManagement from "./pages/UserManagement";
import PrivateRoute from "./components/PrivateRoute";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "antd";
import { setAuth, logout } from "./store/authSlice";
import Register from "./pages/Register";
import { jwtDecode } from "jwt-decode";
import MainLayout from "./components/MainLayout";
import Overview from "./pages/Overview";
import ReportProblem from "./pages/ReportProblem";
import MyReports from "./pages/MyReports";
import ProblemDetail from "./pages/ProblemDetail";
import ReportSummary from "./pages/ReportSummary";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    // 登录持久化：页面刷新时自动从localStorage恢复登录状态
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        dispatch(
          setAuth({
            user: {
              username: decoded.username,
              role: decoded.role,
              id: decoded.sub,
            },
            token,
          })
        );
      } catch {
        dispatch(logout());
        localStorage.removeItem("token");
      }
    }
  }, [dispatch]);
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="/" element={<Overview />} />
          <Route path="/report" element={<ReportProblem />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/my-reports" element={<ReportSummary />} />
          <Route path="/problems/:id" element={<ProblemDetail />} />
          <Route path="/users" element={<UserManagement />} />
          {/* 其他页面路由可在此添加，如信息总览、上报、类别管理等 */}
          {/* 兼容旧路由，重定向 /my-reports 到 /overview */}
          <Route path="/my-reports" element={<Overview />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
