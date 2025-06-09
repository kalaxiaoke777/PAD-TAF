import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm } from 'antd';
import { useSelector } from 'react-redux';
import { getUsers, register, updateUser, deleteUser } from '../api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const role = useSelector((state) => state.auth.user?.role);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (e) {
      message.error('获取用户失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

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
        message.success('更新成功');
      } else {
        await register(values);
        message.success('添加成功');
      }
      setModalOpen(false);
      fetchUsers();
    } catch {}
  };

  const handleDelete = async (id) => {
    await deleteUser(id);
    message.success('删除成功');
    fetchUsers();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: '用户名', dataIndex: 'username' },
    { title: '角色', dataIndex: 'role' },
    {
      title: '操作',
      render: (_, record) => (
        <>
          <Button size="small" onClick={() => openModal(record)}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger style={{ marginLeft: 8 }}>删除</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  if (role !== 'admin' && role !== 'superadmin') return null;

  return (
    <div>
      <Button type="primary" onClick={() => openModal(null)} style={{ marginBottom: 16 }}>添加用户</Button>
      <Table rowKey="id" columns={columns} dataSource={users} loading={loading} />
      <Modal open={modalOpen} onCancel={() => setModalOpen(false)} onOk={handleOk} title={editing ? '编辑用户' : '添加用户'}>
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="用户名" rules={[{ required: true }]}> <Input /> </Form.Item>
          {!editing && <Form.Item name="password" label="密码" rules={[{ required: true }]}> <Input.Password /> </Form.Item>}
          <Form.Item name="role" label="角色" rules={[{ required: true }]}> <Select options={[{ value: 'user', label: '普通用户' }, { value: 'admin', label: '管理员' }, { value: 'superadmin', label: '超级管理员' }]} /> </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement; 