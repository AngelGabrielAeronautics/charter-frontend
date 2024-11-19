"use client";

import { useEffect, useState } from "react";



import { CheckCircleOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Divider, Space, TableProps, notification } from "antd";



import DataTable from "@/app/components/DataTable";
import OperatorVettingDrawer from "@/app/components/Drawers/OperatorVettingDrawer";



import { IOperator } from "@/lib/models/IOperators";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import { fetchOperators, showOperatorDrawer } from "@/lib/state/operators/operators.slice";



import PageHeader from "../../../components/PageHeader";


const Operators = () => {
  const dispatch = useAppDispatch();
  const { operators } = useAppSelector((state) => state.operators);
  const [selectedOperator, setSelectedOperator] = useState<IOperator>();

  const showOperatorDetails = () => {
    if (selectedOperator) {
      dispatch(showOperatorDrawer(selectedOperator));
    } else {
      notification.error({
        message: "Please select an operator to view details",
      });
    }
  };

  useEffect(() => {
    dispatch(fetchOperators());
    return () => {};
  }, [dispatch]);

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
      />
      <OperatorVettingDrawer />
    </>
  );
};

export default Operators;