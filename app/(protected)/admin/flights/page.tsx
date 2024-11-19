"use client";

import React, { useEffect, useState } from "react";

import { Divider } from "antd";

import { PageHeader } from "@/app/components";
import DataTable from "@/app/components/DataTable";
import CreateFlightDrawer from "@/app/components/Drawers/CreateFlightDrawer";

import { fetchFlights } from "@/lib/state/flights/flights.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";

const AdminFlights = () => {
  const { flights } = useAppSelector((state) => state.flights);
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchFlights());
    return () => {};
  }, [dispatch]);

  const onCloseCreateDrawer = () => {
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
      <CreateFlightDrawer
        onClose={onCloseCreateDrawer}
        open={createDrawerOpen}
      />
    ),
  };

  return (
    <div>
      <PageHeader
        title="Flights"
        subtitle="Get an overview of all the flights here"
      />
      <Divider />
      <DataTable
        title="Flights"
        data={flights}
        customCreateDrawer={createDrawerConfig}
      />
    </div>
  );
};

export default AdminFlights;
