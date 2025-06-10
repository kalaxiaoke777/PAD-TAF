import React from "react";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
  DashboardOutlined,
  FileAddOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Layout,
  Menu,
  theme,
  Dropdown,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

const { Header, Content, Footer } = Layout;

const items1 = [
  {
    key: "/",
    icon: <DashboardOutlined />,
    label: <Link to="/">信息总览</Link>,
  },
  {
    key: "/report",
    icon: <FileAddOutlined />,
    label: <Link to="/report">信息上报</Link>,
  },
  {
    key: "/my-reports",
    icon: <AppstoreOutlined />,
    label: <Link to="/my-reports">上报汇总</Link>,
  },
  {
    key: "/users",
    icon: <UserOutlined />,
    label: <Link to="/users">用户管理</Link>,
  },
  {
    key: "/categories",
    icon: <AppstoreOutlined />,
    label: <Link to="/categories">类别管理</Link>,
  },
];

const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
  (icon, index) => {
    const key = String(index + 1);
    return {
      key: `sub${key}`,
      icon: React.createElement(icon),
      label: `subnav ${key}`,
      children: Array.from({ length: 4 }).map((_, j) => {
        const subKey = index * 4 + j + 1;
        return {
          key: subKey,
          label: `option${subKey}`,
        };
      }),
    };
  }
);

const MainLayout = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [form] = Form.useForm();

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      dispatch(logout());
    } else if (key === "edit") {
      setModalOpen(true);
    }
  };

  const handleOk = async () => {
    try {
      await form.validateFields();
      // 这里应调用后端API修改用户名/密码
      message.success("修改成功（请接入API）");
      setModalOpen(false);
      form.resetFields();
    } catch {}
  };

  const menu = {
    items: [
      { key: "edit", label: "修改用户名/密码", icon: <SettingOutlined /> },
      { key: "logout", label: "退出登录", icon: <LogoutOutlined /> },
    ],
    onClick: handleMenuClick,
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
          lineHeight: "64px",
          padding: 0,
        }}
      >
        <div
          className="demo-logo"
          style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: 20,
            marginLeft: 24,
          }}
        >
          企业举报信息管理平台
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={items1}
          style={{ flex: 1, minWidth: 0, marginLeft: 32 }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginRight: 24,
          }}
        >
          {user && <span style={{ color: "#fff" }}>{user.username}</span>}
          <Dropdown menu={menu} placement="bottomRight" trigger={["click"]}>
            <SettingOutlined
              style={{ color: "#fff", fontSize: 20, cursor: "pointer" }}
            />
          </Dropdown>
        </div>
      </Header>
      <Layout style={{ height: "calc(100vh - 64px)", overflow: "hidden" }}>
        <Content
          style={{
            padding: 24,
            minHeight: 0,
            background: colorBgContainer,
            width: "100%",
            height: "100%",
            overflow: "auto",
            backgroundColor: "rgb(16, 153, 222)",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
      <Footer
        style={{
          textAlign: "center",
          height: 48,
          lineHeight: "48px",
          padding: 0,
        }}
      >
        卡拉肖克 ©{new Date().getFullYear()}
      </Footer>
      <Modal
        title="修改用户名/密码"
        open={modalOpen}
        onOk={handleOk}
        onCancel={() => setModalOpen(false)}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="新用户名">
            <Input placeholder="请输入新用户名" />
          </Form.Item>
          <Form.Item name="password" label="新密码">
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default MainLayout;
