import React, { useEffect, useState } from "react";
import { Table, Tag, Button, message, Image, Select } from "antd";
import { getProblems, getCategories } from "../api";
import { useNavigate } from "react-router-dom";

const statusColor = {
  待处理: "orange",
  处理中: "blue",
  已解决: "green",
};

const MyReports = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [filters, setFilters] = useState({ type: null });
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getProblems();
      setData(res.data);
    } catch {
      message.error("获取上报列表失败");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    getCategories().then((res) => {
      setCategoryOptions(
        (res.data || []).map((c) => ({ value: c.name, label: c.name }))
      );
    });
  }, []);

  const columns = [
    { title: "编号", dataIndex: "id", width: 60 },
    { title: "类型", dataIndex: "type" },
    { title: "描述", dataIndex: "description" },
    { title: "严重程度", dataIndex: "severity" },
    {
      title: "状态",
      dataIndex: "status",
      render: (v) => <Tag color={statusColor[v] || "default"}>{v}</Tag>,
    },
    { title: "上报时间", dataIndex: "createdAt" },
    {
      title: "图片",
      dataIndex: "images",
      render: (imgs) =>
        imgs && imgs.length
          ? imgs.map((url, i) => (
              <Image
                key={i}
                width={40}
                src={url.startsWith("http") ? url : `/uploads/${url}`}
                style={{ marginRight: 4 }}
              />
            ))
          : "-",
    },
    {
      title: "操作",
      dataIndex: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => navigate(`/problems/${record.id}`)}>
          详情
        </Button>
      ),
    },
  ];

  return (
    <div style={{ background: "#fff", padding: 24, borderRadius: 8 }}>
      <h2>上报汇总</h2>
      <Select
        allowClear
        placeholder="类型"
        style={{ width: 120, marginBottom: 16 }}
        value={filters.type}
        onChange={(v) => setFilters((f) => ({ ...f, type: v }))}
        options={categoryOptions}
        loading={!categoryOptions.length}
      />
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 8 }}
      />
    </div>
  );
};

export default MyReports;
