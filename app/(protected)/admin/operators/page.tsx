"use client";

import { useEffect, useState } from "react";

import { CheckCircleOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Divider, Space, TableProps, notification } from "antd";

import DataTable from "@/app/components/DataTable";
import OperatorVettingDrawer from "@/app/components/Drawers/OperatorVettingDrawer";

import { IOperator } from "@/lib/models/IOperators";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import {
  fetchOperators,
  showOperatorDrawer,
} from "@/lib/state/operators/operators.slice";

import PageHeader from "../../../components/PageHeader";

const columns: TableProps<IOperator>["columns"] = [
  {
    title: "Operator",
    dataIndex: "airline",
    key: "airline",
    sorter: (a, b) => {
      return a.airline.localeCompare(b.airline);
    },
  },
  {
    title: "Contact Details",
    dataIndex: "email",
    key: "email",
    sorter: (a, b) => {
      return a.email.localeCompare(b.email);
    },
  },
  {
    title: "Country",
    dataIndex: "country",
    key: "country",
    sorter: (a, b) => {
      return a.country.localeCompare(b.country);
    },
  },
  {
    title: "Profile Status",
    dataIndex: "profile_status",
    key: "profile_status",
    sorter: (a, b) => {
      return a.profileCompletePercentage
        .toString()
        .localeCompare(b.profileCompletePercentage.toString());
    },
  },
  {
    title: "Profile Verification",
    dataIndex: "status",
    key: "status",
    sorter: (a, b) => {
      return a.status.toString().localeCompare(b.status.toString());
    },
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

const Operators = ({}: IProps) => {
  const dispatch = useAppDispatch();
  const { operators, loading } = useAppSelector((state) => state.operators);
  const [operatorDetailsDrawer, setOperatorDetailsDrawer] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState<IOperator>();

  const showOperatorDetails = () => {
    if (selectedOperator) {
      // setOperatorDetailsDrawer(true);
      dispatch(showOperatorDrawer(selectedOperator));
    } else {
      notification.error({
        message: "Please select an operator to view details",
      });
    }
  };

  const onClose = () => {
    setOperatorDetailsDrawer(false);
  };

  const getOperators = () => {
    dispatch(fetchOperators());
  };

  useEffect(() => {
    getOperators();
    return () => {};
  }, []);

  return (
    <>
      <PageHeader
        title="Operators"
        subtitle="Get an overview of all the operators here"
      />
      <Divider />
      <DataTable
        title="Operators"
        data={operators}
        canCreate={false}
        canEdit={false}
        onSelectRow={(value) => setSelectedOperator(value)}
        additionalActions={[
          <Button
            type="default"
            onClick={showOperatorDetails} // Trigger the CSV export function
          >
            <CheckCircleOutlined />
          </Button>,
        ]}
        // onRowClick={handleRowClick}
      />
      <OperatorVettingDrawer />
    </>
  );
};

export default Operators;
