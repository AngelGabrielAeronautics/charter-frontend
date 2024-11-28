"use client";

import { useEffect, useState } from "react";

import { Descriptions, Divider, TableColumnType } from "antd";

import { PageHeader } from "@/app/components";
import DataTable from "@/app/components/DataTable";
import CreateAssetsDrawer from "@/app/components/Drawers/CreateAssetDrawer";

import { findAll } from "@/lib/state/assets/assets.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import dayjs from "dayjs";

const AdminAssets = () => {
  const { assets } = useAppSelector((state) => state.assets);
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(findAll());
    return () => {};
  }, [dispatch]);

  const onCloseAssetDrawer = () => {
    setCreateDrawerOpen(false);
  };

  const createDrawerConfig = {
    isOpen: createDrawerOpen,
    openDrawer: () => {
      setCreateDrawerOpen(true);
    },
    closeDrawer: () => {
      setCreateDrawerOpen(false);
    },
    drawer: (
      <CreateAssetsDrawer
        onClose={onCloseAssetDrawer}
        visible={createDrawerOpen}
      />
    ),
  };

  const columns: TableColumnType<any>[] = [
    {
      title: "Cruise Speed (Knots)",
      key: "cruiseSpeedInKnots",
      dataIndex: "cruiseSpeedInKnots",
      render: (value) => {
        return value;
      },
    },
    {
      title: "Registration Number",
      key: "registrationNumber",
      dataIndex: "registrationNumber",
      render: (value) => {
        return value;
      },
    },
    {
      title: "Year of Manufacture",
      key: "yearOfManufacture",
      dataIndex: "yearOfManufacture",
      render: (value) => {
        return value;
      },
    },
    {
      title: "Last Refurbishment Date",
      key: "lastRefurbishmentDate",
      dataIndex: "lastRefurbishmentDate",
      render: (value) => {
        return dayjs(value).format("DD MMM YYYY");
      },
    },
    {
      title: "Cargo Capacity",
      key: "cargoCapacity",
      dataIndex: "cargoCapacity",
      render: (value, record) => {
        return `${value ?? "--"} ${record.cargoCapacityUnits ?? ""}`;
      },
    },
    {
      title: "Baggage Compartment Max Weight",
      key: "baggage_compartment_max_weight",
      dataIndex: "baggage_compartment_max_weight",
      render: (value, record) => {
        return `${value} ${record.baggageCompartmentMaxWeightUnits}`;
      },
    },
    {
      title: "Baggage Compartment Size",
      key: "baggageCompartmentSize",
      dataIndex: "baggageCompartmentSize",
      render: (value) => {
        return (
          <Descriptions size="small" bordered column={3} layout="vertical">
            <Descriptions.Item
              label="L"
              labelStyle={{ fontWeight: "bold" }}
              span={1}
            >
              {value[0]}m
            </Descriptions.Item>
            <Descriptions.Item
              label="W"
              labelStyle={{ fontWeight: "bold" }}
              span={1}
            >
              {value[1]}m
            </Descriptions.Item>
            <Descriptions.Item
              label="H"
              labelStyle={{ fontWeight: "bold" }}
              span={1}
            >
              {value[2]}m
            </Descriptions.Item>
          </Descriptions>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Assets"
        subtitle="Get an overview of all the assets here"
      />
      <Divider />
      <DataTable
        title="Assets"
        data={assets}
        customCreateDrawer={createDrawerConfig}
        canCreate={true}
        customColumns={columns}
        hiddenColumns={["operatorId", "baggageCompartmentMaxWeightUnits", "cargoCapacityUnits"]}
      />
    </div>
  );
};

export default AdminAssets;
