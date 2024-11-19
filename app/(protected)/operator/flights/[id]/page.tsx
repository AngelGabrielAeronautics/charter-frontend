"use client";

import React from "react";

import { ArrowLeftOutlined } from "@ant-design/icons";
import { Collapse } from "antd";

import BookingCard from "@/app/components/Cards/booking";
import FlightCard from "@/app/components/Cards/flight";
import OperatorCard from "@/app/components/Cards/operator";

import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";

const { Panel } = Collapse;

interface IProps {}

const FlightDetails = ({}: IProps) => {
  const { flights, isFetchingFlights } = useAppSelector(
    (state) => state.flights
  );
  const onChange = (key: string | string[]) => {};
  
  const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

  return (
    <div className="space-y-2 py-2 pb-5">
      <div className="mb-5 flex space-x-2">
        <ArrowLeftOutlined size={20} color="#EAE4E0" />
        <p>Back</p>
      </div>
      <div
        className="flex h-1/2 space-x-2 rounded-md"
        style={{ backgroundColor: "##E9E2DD" }}
      >
        <FlightCard />
        {/* <Divider type="vertical" style={{ padding: 0 }} /> */}
        <BookingCard />
      </div>
      {/* operator row */}
      <h2 style={{ color: "#0B3746" }}>Operator</h2>
      <OperatorCard />
      {/* air craft details */}
      <h2 style={{ color: "#0B3746" }}>Terms</h2>
      {/* terms collapsible */}
      <Collapse onChange={onChange}>
        <Panel header="Dead leg terms and conditions" key="1">
          <p>data</p>
        </Panel>
        <Panel header="Terms and conditions" key="2">
          <p>{text}</p>
        </Panel>
        <Panel header="Cancellation policy" key="3">
          <p>{text}</p>
        </Panel>
      </Collapse>
      <></>
    </div>
  );
};

export default FlightDetails;
