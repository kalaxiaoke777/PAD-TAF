import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useDispatch } from "react-redux";
import { setAuth } from "../store/authSlice";
import { login } from "../api";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Login.module.scss";

const Login = () => {
  const [messageApi, contextHolder] = message.useMessage(); // ✅ 移到这里
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await login(values);
      dispatch(setAuth({ user: res.data.user, token: res.data.access_token }));
      localStorage.setItem("token", res.data.access_token);
      messageApi
        .open({
          type: "success",
          content: "登录成功",
          duration: 1,
        })
        .then(() => {
          navigate("/");
        });
    } catch (e) {
      if (e.response?.status === 401) {
        messageApi.error("用户名或密码错误");
      } else {
        messageApi.error(e.response?.data?.message || "登录失败");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authBg}>
      {contextHolder}
      <div className={styles.authGlass}>
        <h2>登录</h2>
        <Form name="login" onFinish={onFinish} autoComplete="off">
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="用户名" autoComplete="username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "请输入密码!" },
              {
                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/,
                message: "密码需为6-18位字母和数字组合",
              },
            ]}
          >
            <Input.Password
              placeholder="密码"
              autoComplete="current-password"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
        </Form>
        <div className={styles.switchLink}>
          没有账号？<Link to="/register">去注册</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
