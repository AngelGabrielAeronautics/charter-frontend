"use client";

import React, { useEffect, useState } from "react";

import { Divider, TableColumnType } from "antd";

import DataTable from "@/app/components/DataTable";
import CreateAssetsDrawer from "@/app/components/Drawers/CreateAssetDrawer";
import PageHeader from "@/app/components/PageHeader";
import EditAssetDrawer from "@/app/components/editAssetDrawer";

import { IAsset } from "@/lib/models/IAssets";
import { filter } from "@/lib/state/assets/assets.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";

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
      title: "Baggage Compartment Size",
      key: "baggageCompartmentSize",
      dataIndex: "baggageCompartmentSize",
      render: (value: number[]) => `${value[0]}m x ${value[1]}m x ${value[2]}m`,
    },
    {
      title: "Year of Manufacture",
      key: "yearOfManufacture",
      dataIndex: "yearOfManufacture",
      render: (value: number) => value,
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
      />
    </div>
  );
};

export default Assets;
