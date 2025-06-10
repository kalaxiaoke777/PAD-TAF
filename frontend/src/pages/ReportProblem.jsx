import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  Upload,
  Button,
  message as antdMessage,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { reportProblem } from "../api";

const { TextArea } = Input;

const typeOptions = [
  { value: "安全", label: "安全" },
  { value: "环境", label: "环境" },
  { value: "电器损坏", label: "电器损坏" },
  { value: "食堂", label: "食堂" },
  { value: "办公", label: "办公" },
  { value: "其他", label: "其他" },
];
const severityOptions = [
  { value: "低", label: "低" },
  { value: "中", label: "中" },
  { value: "高", label: "高" },
];

const ReportProblem = () => {
  const [messageApi, contextHolder] = antdMessage.useMessage();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  // 表单初始值
  const [form] = Form.useForm();

  // 上传图片变化
  const handleUploadChange = ({ fileList }) => setFileList(fileList);

  // 表单提交
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("type", values.type);
      formData.append("severity", values.severity);
      formData.append("description", values.description);
      fileList.forEach((file) => {
        if (file.originFileObj) formData.append("images", file.originFileObj);
      });
      await reportProblem(formData);
      messageApi.success("上报成功！");
      form.resetFields();
      setFileList([]);
    } catch (e) {
      messageApi.error("上报失败，请重试");
    }
    setLoading(false);
  };

  return (
    <>
      {contextHolder}
      <Form
        form={form}
        name="report-problem"
        layout="vertical"
        style={{
          maxWidth: 600,
          margin: "0 auto",
          background: "#fff",
          padding: 24,
          borderRadius: 8,
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          name="type"
          label="问题类型"
          rules={[{ required: true, message: "请选择问题类型" }]}
        >
          <Select options={typeOptions} />
        </Form.Item>
        <Form.Item
          name="severity"
          label="严重程度"
          rules={[{ required: true, message: "请选择严重程度" }]}
        >
          <Select options={severityOptions} />
        </Form.Item>
        <Form.Item
          name="description"
          label="问题描述"
          rules={[{ required: true, message: "请填写问题描述" }]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item label="图片上传">
          <Upload
            listType="picture-card"
            fileList={fileList}
            beforeUpload={() => false}
            onChange={handleUploadChange}
            multiple={true}
            maxCount={5}
          >
            {fileList.length < 5 && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传</div>
              </div>
            )}
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            提交上报
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ReportProblem;
