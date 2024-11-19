"use client";

import React, { useEffect } from "react";

import { EyeOutlined } from "@ant-design/icons";
import { Divider, Space, Table, TableProps } from "antd";

import DataTable from "@/app/components/DataTable";
import PageHeader from "@/app/components/PageHeader";

import { IUser } from "@/lib/models/IUser";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import { fetchUsers } from "@/lib/state/users/users.slice";

const columns: TableProps<IUser>["columns"] = [
  {
    title: "",
    dataIndex: "displayName",
    key: "displayName",
  },
  {
    title: "Contact Details",
    dataIndex: "email",
    key: "email",
    render: (_, data: IUser) => {
      return (
        <p>
          {data.email}
          {/* {data.phone} */}
        </p>
      );
    },
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
  },
  {
    title: "Total Bookings",
    dataIndex: "total_bookings",
    key: "total_bookings",
  },
  {
    title: "Quotation Requests",
    dataIndex: "quotation_requests",
    key: "quotation_requests",
  },
  {
    title: "Company",
    dataIndex: "company",
    key: "company",
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>
          <EyeOutlined />
        </a>
      </Space>
    ),
  },
];

interface IProps {}

const Users = ({}: IProps) => {
  const dispatch = useAppDispatch();
  const { users, isFetchingUsers } = useAppSelector((state) => state.users);

  const getUsers = () => {
    dispatch(fetchUsers());
  };

  useEffect(() => {
    getUsers();
    return () => {};
  }, []);

  return (
    <>
      <PageHeader
        title="Users"
        subtitle="Get an overview of all the users here"
      />
      <Divider />
      <DataTable
        title="Users"
        data={users}
        canCreate={false}
        canEdit={false}
        hiddenColumns={["provider", "fid", "__v"]}
      />
    </>
  );
};

export default Users;
