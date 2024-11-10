import React from "react";
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Skeleton,
  Switch,
} from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";

const EditProduct = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const nav = useNavigate();
  const { id } = useParams();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:3000/products/${id}`);
      return res.data;
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (product) => {
      return await axios.put(`http://localhost:3000/products/${id}`, product);
    },
    onSuccess() {
      messageApi.success("Sua thanh cong");
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      setTimeout(() => {
        nav("/products");
      }, 1000);
    },
  });

  const onFinish = (values) => {
    mutate(values);
  };
  if (isLoading) return <Skeleton active />;
  return (
    <>
      {contextHolder}
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={data}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Vui long nhap ten san pham!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Image"
          name="imageUrl"
          rules={[
            {
              required: true,
              message: "Vui long nhap anh san pham!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[
            {
              required: true,
              message: "Vui long nhap gia san pham!",
            },
            {
              type: "number",
              min: 0,
              message: "Gia k am",
            },
          ]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item label="Trang thai" name="available" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item
          label="Danh muc"
          name="category"
          rules={[
            {
              required: true,
              message: "Vui long nhap ten san pham!",
            },
          ]}
        >
          <Select>
            <Select.Option value="cate1">Danh muc 1</Select.Option>
            <Select.Option value="cate2">Danh muc 2</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              required: true,

              message: "Vui long dien mo ta!",
            },
          ]}
        >
          <TextArea />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
export default EditProduct;
