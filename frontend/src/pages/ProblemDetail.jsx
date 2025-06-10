import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Descriptions, Image, Button, Spin, message } from "antd";
import api from "../api";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const ProblemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/problems/${id}`);
        if (res.code === 0) {
          setProblem(res.data);
        } else {
          message.error(res.message || "获取详情失败");
        }
      } catch (e) {
        message.error("获取详情失败");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <Spin style={{ marginTop: 100 }} />;
  if (!problem) return null;

  return (
    <Card
      title="上报详情"
      extra={<Button onClick={() => navigate(-1)}>返回</Button>}
      style={{ maxWidth: 700, margin: "0 auto" }}
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item label="标题">{problem.title}</Descriptions.Item>
        <Descriptions.Item label="类型">{problem.type}</Descriptions.Item>
        <Descriptions.Item label="严重程度">
          {problem.severity}
        </Descriptions.Item>
        <Descriptions.Item label="描述">
          {problem.description}
        </Descriptions.Item>
        <Descriptions.Item label="上报人">
          {problem.reporterName || problem.reporter}
        </Descriptions.Item>
        <Descriptions.Item label="上报时间">
          {problem.createdAt}
        </Descriptions.Item>
        <Descriptions.Item label="图片">
          {problem.images && problem.images.length > 0 ? (
            <Image.PreviewGroup>
              {problem.images.map((img, idx) => (
                <Image
                  key={idx}
                  width={120}
                  src={
                    img.startsWith("http") ? img : `${BASE_URL}/uploads/${img}`
                  }
                  style={{ marginRight: 8 }}
                />
              ))}
            </Image.PreviewGroup>
          ) : (
            "无"
          )}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default ProblemDetail;
