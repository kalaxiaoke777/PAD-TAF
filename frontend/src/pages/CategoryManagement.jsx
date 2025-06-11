import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Popconfirm } from "antd";
import axios, { getCategories } from "../api";
import { message as antdMessage } from "antd";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = antdMessage.useMessage();

  // 获取类别列表
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/categories", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCategories(res.data);
    } catch (e) {
      messageApi.error("获取类别失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    getCategories().then((res) => {
      setCategoryOptions((res.data || []).map((c) => ({ value: c.name, label: c.name })));
    });
  }, []);

  // 新增/编辑弹窗
  const openModal = (record) => {
    setEditing(record || null);
    setModalVisible(true);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
  };

  // 提交表单
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        await axios.put(`/categories/${editing.id}`, values, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        messageApi.success("编辑成功");
      } else {
        await axios.post("/categories", values, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        messageApi.success("添加成功");
      }
      setModalVisible(false);
      fetchCategories();
    } catch (e) {
      messageApi.error("操作失败，类别名需唯一");
    }
  };

  // 删除类别
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/categories/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      messageApi.success("删除成功");
      fetchCategories();
    } catch (e) {
      messageApi.error("删除失败");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "类别名称", dataIndex: "name" },
    { title: "描述", dataIndex: "description" },
    {
      title: "操作",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => openModal(record)}>
            编辑
          </Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: "#fff", minHeight: "80vh" }}>
      {contextHolder}
      <h2>类别管理</h2>
      <Button type="primary" onClick={() => openModal(null)} style={{ marginBottom: 16 }}>
        新增类别
      </Button>
      <Table rowKey="id" columns={columns} dataSource={categories} loading={loading} />
      <Modal
        open={modalVisible}
        title={editing ? "编辑类别" : "新增类别"}
        onCancel={() => setModalVisible(false)}
        onOk={handleOk}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="类别名称"
            rules={[{ required: true, message: "请输入类别名称" }]}
          >
            <Input placeholder="请输入类别名称" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea placeholder="描述（可选）" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
