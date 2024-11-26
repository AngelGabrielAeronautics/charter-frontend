"use client";

import React, { useEffect, useState } from "react";

import { Button, Divider, Drawer, TableColumnType } from "antd";

import DataTable from "@/app/components/DataTable";
import CreateFlightDrawer from "@/app/components/Drawers/CreateFlightDrawer";
import UpdateFlightDrawer from "@/app/components/Drawers/updateFlightDrawer";
import PageHeader from "@/app/components/PageHeader";

import { IFlight } from "@/lib/models/flight.model";
import {
  cancelFlight,
  getOperatorFlights,
  selectFlight,
} from "@/lib/state/flights/flights.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";

const Flights = () => {
  const { flights, loading, success } = useAppSelector(
    (state) => state.flights
  );
  const { authenticatedUser } = useAppSelector((state) => state.auth);
  const [selectedFlight, setSelectedFlight] = useState<IFlight>();
  const [drawerOpen, setDrawerOpen] = useState({
    create: false,
    edit: false,
    view: false,
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getOperatorFlights(authenticatedUser?.operatorId!));
    return () => {};
  }, [dispatch, authenticatedUser]);

  useEffect(() => {
    if (loading.createRecord == false && success.createRecord) {
      setDrawerOpen({
        ...drawerOpen,
        create: false,
      });
    }
    return () => {};
  }, [loading, success]);

  const onCloseCreateDrawer = () => {
    setDrawerOpen({
      ...drawerOpen,
      create: false,
    });
  };

  const onCloseUpdateDrawer = () => {
    setDrawerOpen({
      ...drawerOpen,
      edit: false,
    });
  };

  const createDrawerConfig = {
    isOpen: drawerOpen.create,
    openDrawer: () => {
      setDrawerOpen({
        ...drawerOpen,
        create: true,
      });
    },
    closeDrawer: () => {
      setDrawerOpen({
        ...drawerOpen,
        create: false,
      });
    },
    drawer: (
      <CreateFlightDrawer
        onClose={onCloseCreateDrawer}
        open={drawerOpen.create}
      />
    ),
  };

  const editDrawerConfig = {
    isOpen: drawerOpen.edit,
    openDrawer: (record: any) => {
      if (selectedFlight) {
        if (typeof selectedFlight === "string") {
          const flight = flights.find(
            (flight) => flight._id === selectedFlight
          );
          setSelectedFlight(flight);
          if (flight) dispatch(selectFlight(flight));
        } else {
          setSelectedFlight(selectedFlight);
          dispatch(selectFlight(selectedFlight));
        }
      }

      setDrawerOpen({
        ...drawerOpen,
        edit: true,
      });
    },
    closeDrawer: () => {
      setDrawerOpen({ ...drawerOpen, edit: false });
    },
    drawer: (
      <UpdateFlightDrawer
        selectedFlight={selectedFlight!}
        onClose={onCloseUpdateDrawer}
        open={drawerOpen.edit}
      />
    ),
  };

  const columns: TableColumnType<any>[] = [
    {
      title: "Aircraft Registration Number",
      key: "aircraftRegistrationNumber",
      dataIndex: "aircraftRegistrationNumber",
      render: (value: string) => value,
    },
    {
      title: "Max Luggage Per Person",
      key: "maxLuggagePerPerson",
      dataIndex: "maxLuggagePerPerson",
      render: (value: string) => value,
    },
    {
      title: "Duration In Hours",
      key: "duration",
      dataIndex: "duration",
      render: (value: string) => value,
    },
  ];

  const onSelectRow = (record: any) => {
    setSelectedFlight(record);
  };

  const handleCancel = (id: string) => {
    dispatch(cancelFlight(id));
  };

  const onViewSelected = (record: any) => {
    setSelectedFlight(record);
    setDrawerOpen({
      ...drawerOpen,
      view: true,
    });
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
        customColumns={columns}
        canEdit={true}
        customEditDrawer={editDrawerConfig}
        onSelectRow={onSelectRow}
        onRowView={onViewSelected}
        canCancel={true}
        onCancel={handleCancel}
      />
      <Drawer
        title="Flight Details"
        width={"87.5%"}
        open={drawerOpen.view}
        onClose={() => setDrawerOpen({ ...drawerOpen, view: false })}
      >
        <p>Viewing flight details</p>
        <p>
          Aircraft Registration Number:{" "}
          {selectedFlight?.aircraftRegistrationNumber}
        </p>
        <p>Max Luggage Per Person: {selectedFlight?.maxLuggagePerPerson}</p>
        <p>Duration: {selectedFlight?.duration}</p>
        <p>Departure Airport: {selectedFlight?.departureAirport?.shortLabel}</p>
        <p>Arrival Airport: {selectedFlight?.arrivalAirport?.shortLabel}</p>
        <p>Departure Time: {selectedFlight?.departureTime}</p>
        <p>Arrival Time: {selectedFlight?.arrivalTime}</p>
      </Drawer>
    </div>
  );
};

export default Flights;
