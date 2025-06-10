import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
} from "antd";
import { useSelector } from "react-redux";
import { getUsers, register, updateUser, deleteUser } from "../api";
import { SearchOutlined } from "@ant-design/icons";

const UserManagement = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const role = useSelector((state) => state.auth.user?.role);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (e) {
      messageApi.error("获取用户失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = (record) => {
    setEditing(record);
    setModalOpen(true);
    if (record) form.setFieldsValue(record);
    else form.resetFields();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        await updateUser(editing.id, values);
        messageApi.success("更新成功");
      } else {
        await register(values);
        messageApi.success("添加成功");
      }
      setModalOpen(false);
      fetchUsers();
    } catch (e) {
      if (e.response?.status === 409) {
        messageApi.error("用户名已存在");
      } else {
        messageApi.error(e.response?.data?.message || "操作失败");
      }
    }
  };

  const handleDelete = async (id) => {
    await deleteUser(id);
    messageApi.success("删除成功");
    fetchUsers();
  };

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "用户名", dataIndex: "username" },
    { title: "角色", dataIndex: "role" },
    {
      title: "操作",
      render: (_, record) => (
        <>
          <Button size="small" onClick={() => openModal(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button size="small" danger style={{ marginLeft: 8 }}>
              删除
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  // 只允许超级管理员访问
  if (role !== "superadmin")
    return <div style={{ padding: 32, color: "red" }}>无权限访问</div>;

  // 权限分组
  const groupedUsers = {
    superadmin: users.filter((u) => u.role === "superadmin"),
    admin: users.filter((u) => u.role === "admin"),
    user: users.filter((u) => u.role === "user"),
  };

  // 角色下拉筛选
  const roleOptions = [
    { value: "all", label: "全部" },
    { value: "superadmin", label: "超级管理员" },
    { value: "admin", label: "管理员" },
    { value: "user", label: "普通用户" },
  ];

  // 搜索+角色过滤
  const filteredUsers = users.filter(
    (u) =>
      (roleFilter === "all" || u.role === roleFilter) &&
      u.username.includes(search)
  );

  return (
    <div>
      {contextHolder}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
          gap: 16,
        }}
      >
        <Button type="primary" onClick={() => openModal(null)}>
          添加用户
        </Button>
        <Input
          prefix={<SearchOutlined />}
          placeholder="搜索用户名"
          style={{ width: 240 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
        />
        <Select
          style={{ width: 160 }}
          value={roleFilter}
          options={roleOptions}
          onChange={setRoleFilter}
        />
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredUsers}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleOk}
        title={editing ? "编辑用户" : "添加用户"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          {!editing && (
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item name="role" label="角色" rules={[{ required: true }]}>
            <Select options={roleOptions.slice(1)} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
