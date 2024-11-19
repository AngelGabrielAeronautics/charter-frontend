"use client";

import React, { useEffect, useState } from "react";

import { Divider, TableColumnType } from "antd";

import { PageHeader } from "@/app/components";
import DataTable from "@/app/components/DataTable";
import CreateAssetsDrawer from "@/app/components/Drawers/CreateAssetDrawer";

import { findAll } from "@/lib/state/assets/assets.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";

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
      title: "Baggage Compartment Size",
      key: "baggageCompartmentSize",
      dataIndex: "baggageCompartmentSize",
      render: (value) => `L x W x H`,
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
      />
    </div>
  );
};

export default AdminAssets;
