import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  message,
  Spin,
  Modal,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
} from "antd";
import axios from "../api";
import dayjs from "dayjs";

const ReportSummary = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);

  // 搜索与筛选状态
  const [filters, setFilters] = useState({
    type: undefined,
    description: "",
    severity: undefined,
    status: undefined,
    reporter: "",
    dateRange: [],
  });

  // 分页状态
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });

  // 处理筛选
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // 获取上报汇总
  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        // 构造查询参数
        const params = {};
        if (filters.type) params.type = filters.type;
        if (filters.description) params.description = filters.description;
        if (filters.severity) params.severity = filters.severity;
        if (filters.status) params.status = filters.status;
        if (filters.reporter) params.reporter = filters.reporter;
        if (filters.dateRange && filters.dateRange.length === 2) {
          params.startDate = filters.dateRange[0]?.format("YYYY-MM-DD");
          params.endDate = filters.dateRange[1]?.format("YYYY-MM-DD");
        }
        const res = await axios.get("/problems", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          params,
        });
        setData(res.data.data || res.data || []);
      } catch (e) {
        message.error("获取上报汇总失败");
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [filters]);

  // 分页切换
  const handleTableChange = (pag) => {
    setPagination(pag);
  };

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "类型", dataIndex: "type" },
    { title: "描述", dataIndex: "description" },
    { title: "严重程度", dataIndex: "severity" },
    {
      title: "状态",
      dataIndex: "status",
      render: (v) => <Tag color={v === "已处理" ? "green" : "orange"}>{v}</Tag>,
    },
    {
      title: "上报人",
      dataIndex: ["reporter", "username"],
      render: (v) => v || "-",
    },
    {
      title: "上报时间",
      dataIndex: "createdAt",
      render: (v) => v && new Date(v).toLocaleString(),
    },
    {
      title: "图片",
      dataIndex: "images",
      render: (imgs) =>
        imgs && imgs.length
          ? imgs.map((url) => {
              return (
                <img
                  key={url}
                  src={
                    url && url.startsWith("/uploads/")
                      ? `${import.meta.env.VITE_API_BASE_URL || ""}${url}`
                      : url
                  }
                  alt="img"
                  style={{ width: 40, marginRight: 4 }}
                />
              );
            })
          : "-",
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>上报汇总</h2>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={4}>
          <Select
            allowClear
            placeholder="类型"
            style={{ width: "100%" }}
            value={filters.type}
            onChange={(v) => handleFilterChange("type", v)}
            options={Array.from(new Set(data.map((d) => d.type))).map((t) => ({
              value: t,
              label: t,
            }))}
          />
        </Col>
        <Col span={4}>
          <Input
            allowClear
            placeholder="描述关键词"
            value={filters.description}
            onChange={(e) => handleFilterChange("description", e.target.value)}
          />
        </Col>
        <Col span={4}>
          <Select
            allowClear
            placeholder="严重程度"
            style={{ width: "100%" }}
            value={filters.severity}
            onChange={(v) => handleFilterChange("severity", v)}
            options={Array.from(new Set(data.map((d) => d.severity))).map(
              (t) => ({ value: t, label: t })
            )}
          />
        </Col>
        <Col span={4}>
          <Select
            allowClear
            placeholder="状态"
            style={{ width: "100%" }}
            value={filters.status}
            onChange={(v) => handleFilterChange("status", v)}
            options={Array.from(new Set(data.map((d) => d.status))).map(
              (t) => ({ value: t, label: t })
            )}
          />
        </Col>
        <Col span={4}>
          <Input
            allowClear
            placeholder="上报人"
            value={filters.reporter}
            onChange={(e) => handleFilterChange("reporter", e.target.value)}
          />
        </Col>
        <Col span={4}>
          <DatePicker.RangePicker
            style={{ width: "100%" }}
            value={filters.dateRange}
            onChange={(v) => handleFilterChange("dateRange", v || [])}
            allowClear
          />
        </Col>
      </Row>
      <Spin spinning={loading}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: data.length,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20, 50],
            showTotal: (total) => `共 ${total} 条`,
          }}
          onChange={handleTableChange}
          onRow={(record) => ({ onClick: () => handleRowClick(record) })}
        />
        <Modal
          open={detailVisible}
          title="上报详情"
          onCancel={() => setDetailVisible(false)}
          footer={null}
          width={600}
        >
          {detail && (
            <div>
              <p>
                <b>ID：</b>
                {detail.id}
              </p>
              <p>
                <b>类型：</b>
                {detail.type}
              </p>
              <p>
                <b>描述：</b>
                {detail.description}
              </p>
              <p>
                <b>严重程度：</b>
                {detail.severity}
              </p>
              <p>
                <b>状态：</b>
                {detail.status}
              </p>
              <p>
                <b>上报人：</b>
                {detail.reporter?.username || "-"}
              </p>
              <p>
                <b>上报时间：</b>
                {detail.createdAt &&
                  new Date(detail.createdAt).toLocaleString()}
              </p>
              <div>
                <b>图片：</b>
                {detail.images && detail.images.length
                  ? detail.images.map((url) => (
                      <img
                        key={url}
                        src={
                          url.startsWith("/uploads/")
                            ? `${import.meta.env.VITE_API_BASE_URL || ""}${url}`
                            : url
                        }
                        alt="img"
                        style={{ width: 80, marginRight: 8 }}
                      />
                    ))
                  : "-"}
              </div>
            </div>
          )}
        </Modal>
      </Spin>
    </div>
  );
};

export default ReportSummary;
