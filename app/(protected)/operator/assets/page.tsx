"use client";

import React, { useEffect, useState } from "react";



import { Descriptions, Divider, TableColumnType } from "antd";



import DataTable from "@/app/components/DataTable";
import CreateAssetsDrawer from "@/app/components/Drawers/CreateAssetDrawer";
import PageHeader from "@/app/components/PageHeader";
import EditAssetDrawer from "@/app/components/editAssetDrawer";



import { IAsset } from "@/lib/models/IAssets";
import { filter } from "@/lib/state/assets/assets.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import dayjs from "dayjs";


const Assets = () => {
  const { authenticatedUser } = useAppSelector((state) => state.auth);
  const { assets } = useAppSelector((state) => state.assets);
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const payload = { operatorId: authenticatedUser?.operatorId };
    dispatch(filter(payload));
    return () => {};
  }, [dispatch]);

  const onCloseAssetDrawer = () => {
    setCreateDrawerOpen(false);
  };

  const onCloseEditDrawer = () => {
    setEditDrawerOpen(false);
  };

  const handleEditAsset = (asset: string) => {
    setSelectedAsset(asset);
    setEditDrawerOpen(true);
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

  const editDrawerConfig = {
    drawer: (
      <EditAssetDrawer
        onClose={onCloseEditDrawer}
        visible={editDrawerOpen}
        asset={selectedAsset ?? ""}
      />
    ),
    isOpen: editDrawerOpen,
    openDrawer: () => {
      setEditDrawerOpen(true);
    },
    closeDrawer: () => {
      setEditDrawerOpen(false);
    },
  };

  return (
    <div>
      <PageHeader
        title="Assets"
        subtitle="Get an overview of all your assets here"
      />
      <Divider />
      <DataTable
        title="Assets"
        data={assets}
        canEdit={true}
        canCreate={true}
        customEditDrawer={editDrawerConfig}
        customCreateDrawer={createDrawerConfig}
        customColumns={columns}
        onSelectRow={handleEditAsset}
        hiddenColumns={["operatorId", "baggageCompartmentMaxWeightUnits", "cargoCapacityUnits"]}
      />
    </div>
  );
};

export default Assets;