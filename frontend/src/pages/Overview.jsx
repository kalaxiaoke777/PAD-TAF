import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spin, message } from "antd";
import axios from "../api";
import * as echarts from "echarts";

const chartColors = [
  "#00c0ff",
  "#ff4d4f",
  "#ffb800",
  "#52c41a",
  "#722ed1",
  "#fa8c16",
  "#13c2c2",
  "#eb2f96",
];

const Overview = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    statusStats: [],
    typeStats: [],
    severityStats: [],
    total: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/problems/stats", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setStats(res.data.data || {});
      } catch (e) {
        message.error("获取统计数据失败");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    if (!stats.statusStats) return;
    // 状态分布
    const chart1 = echarts.init(document.getElementById("chart-status"));
    chart1.setOption({
      title: {
        text: "问题状态分布",
        left: "center",
        textStyle: { color: "#fff" },
      },
      tooltip: { trigger: "item" },
      legend: { bottom: 0, textStyle: { color: "#fff" } },
      series: [
        {
          name: "状态",
          type: "pie",
          radius: [40, 90],
          roseType: "area",
          itemStyle: { borderRadius: 8 },
          data: stats.statusStats.map((s, i) => ({
            value: s.count,
            name: s.status,
            itemStyle: { color: chartColors[i % chartColors.length] },
          })),
        },
      ],
      backgroundColor: "#222a36",
    });
    // 类型分布
    const chart2 = echarts.init(document.getElementById("chart-type"));
    chart2.setOption({
      title: {
        text: "问题类型分布",
        left: "center",
        textStyle: { color: "#fff" },
      },
      tooltip: { trigger: "item" },
      legend: { bottom: 0, textStyle: { color: "#fff" } },
      series: [
        {
          name: "类型",
          type: "pie",
          radius: [40, 90],
          roseType: "area",
          itemStyle: { borderRadius: 8 },
          data: stats.typeStats.map((s, i) => ({
            value: s.count,
            name: s.type,
            itemStyle: { color: chartColors[(i + 2) % chartColors.length] },
          })),
        },
      ],
      backgroundColor: "#222a36",
    });
    // 严重程度分布
    const chart3 = echarts.init(document.getElementById("chart-severity"));
    chart3.setOption({
      title: {
        text: "严重程度分布",
        left: "center",
        textStyle: { color: "#fff" },
      },
      tooltip: { trigger: "item" },
      legend: { bottom: 0, textStyle: { color: "#fff" } },
      series: [
        {
          name: "严重程度",
          type: "pie",
          radius: [40, 90],
          roseType: "area",
          itemStyle: { borderRadius: 8 },
          data:
            stats.severityStats?.map((s, i) => ({
              value: s.count,
              name: s.severity,
              itemStyle: { color: chartColors[(i + 4) % chartColors.length] },
            })) || [],
        },
      ],
      backgroundColor: "#222a36",
    });
    // 总体汇总
    const chart4 = echarts.init(document.getElementById("chart-total"));
    chart4.setOption({
      title: {
        text: "问题总数趋势",
        left: "center",
        textStyle: { color: "#fff" },
      },
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "category",
        data: ["总数"],
        axisLabel: { color: "#fff" },
      },
      yAxis: {
        type: "value",
        axisLabel: { color: "#fff" },
      },
      series: [
        {
          data: [stats.total || 0],
          type: "bar",
          barWidth: 60,
          itemStyle: {
            color: chartColors[1],
            shadowColor: chartColors[0],
            shadowBlur: 20,
          },
        },
      ],
      backgroundColor: "#222a36",
    });
    return () => {
      chart1.dispose();
      chart2.dispose();
      chart3.dispose();
      chart4.dispose();
    };
  }, [stats]);

  return (
    <div
      style={{
        padding: 6,
        background: "#222a36",
        minHeight: "vh",
        overflow: "hidden",
      }}
    >
      <Spin spinning={loading}>
        <Row gutter={[24, 24]} style={{ height: "100%" }}>
          <Col xs={24} sm={12} style={{ marginBottom: 0 }}>
            <Card bordered={false} style={{ background: "#222a36" }}>
              <div id="chart-status" style={{ height: 300 }} />
            </Card>
          </Col>
          <Col xs={24} sm={12} style={{ marginBottom: 0 }}>
            <Card bordered={false} style={{ background: "#222a36" }}>
              <div id="chart-type" style={{ height: 300 }} />
            </Card>
          </Col>
          <Col xs={24} sm={12} style={{ marginBottom: 0 }}>
            <Card bordered={false} style={{ background: "#222a36" }}>
              <div id="chart-severity" style={{ height: 300 }} />
            </Card>
          </Col>
          <Col xs={24} sm={12} style={{ marginBottom: 0 }}>
            <Card bordered={false} style={{ background: "#222a36" }}>
              <div id="chart-total" style={{ height: 300 }} />
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default Overview;
