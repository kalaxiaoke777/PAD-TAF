import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { register } from "../api";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Register.module.scss";

const Register = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await register({ ...values, role: "user" });
      messageApi.success("注册成功，请登录");
      navigate("/login");
    } catch (e) {
      if (e.response?.status === 409) {
        messageApi.error("用户名已存在");
      } else {
        messageApi.error(e.response?.data?.message || "注册失败");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authBg}>
      <div className={styles.authGlass}>
        <h2>注册</h2>
        <Form
          name="register"
          form={form}
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
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
            <Input.Password placeholder="密码" autoComplete="new-password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              注册
            </Button>
          </Form.Item>
        </Form>
        <div className={styles.switchLink}>
          已有账号？<Link to="/login">去登录</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
