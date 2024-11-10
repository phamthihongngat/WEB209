import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Image,
  message,
  Popconfirm,
  Skeleton,
  Space,
  Table,
  Tag,
} from "antd";
import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";

const ProductList = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:3000/products`);
      return res.data.map((item) => ({
        ...item,
        key: item.id,
      }));
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (id) => {
      return await axios.delete(`http://localhost:3000/products/${id}`);
    },
    onSuccess() {
      messageApi.success("Xoa thanh cong");
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (imageUrl) => <Image src={imageUrl} width={100} />,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Available",
      dataIndex: "available",
      key: "available",
      render: (_, item) => {
        return item.available ? (
          <Tag color="green"> Còn hàng</Tag>
        ) : (
          <Tag color="red"> Hết hàng</Tag>
        );
      },
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Action",
      key: "action",
      render: (_, item) => {
        return (
          <>
            <Space>
              <Popconfirm
                title="Ban co muon xoa khong?"
                description="Are you sure to delete this task?"
                onConfirm={() => mutate(item.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button danger>Delete</Button>
              </Popconfirm>
            </Space>

            <Link to={`/product/${item.id}/edit`}>
              <Button>Update</Button>
            </Link>
          </>
        );
      },
    },
  ];
  if (isLoading) return <Skeleton active />;
  return (
    <>
      {contextHolder}
      <Link to={`/product/add`}>
        <Button type="primary">Thêm sản phẩm</Button>
      </Link>
      <Table dataSource={data} columns={columns} />;
    </>
  );
};

export default ProductList;
