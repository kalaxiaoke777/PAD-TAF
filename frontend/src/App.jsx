import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import UserManagement from './pages/UserManagement';
import PrivateRoute from './components/PrivateRoute';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'antd';
import { logout } from './store/authSlice';
import Register from './pages/Register';

const Home = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  return (
    <div style={{ padding: 24 }}>
      <h2>企业信息管理平台</h2>
      <div style={{ marginBottom: 16 }}>
        {user && <span>欢迎，{user.username}（{user.role}）</span>}
        {user && <Button style={{ marginLeft: 16 }} onClick={() => { dispatch(logout()); localStorage.removeItem('token'); }}>退出登录</Button>}
      </div>
      <nav>
        <Link to="/users">用户管理</Link>
      </nav>
    </div>
  );
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/users" element={<PrivateRoute><UserManagement /></PrivateRoute>} />
      <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/register" element={<Register />} />
    </Routes>
  </Router>
);

export default App;
