"use client";

import Link from "next/link";

import { Button, Flex, Form } from "antd";

import { eRoutes } from "@/app/(config)/routes";

import { useAppSelector } from "@/lib/state/hooks";

const PassengerListLabel = ({ ticketId }: { ticketId: string }) => {
  const { records: tickets } = useAppSelector((state) => state.tickets);
  const ticket = tickets.find((item) => item._id == ticketId);

  const { authenticatedUser } = useAppSelector((state) => state.auth);

  if (!ticket) return <p>Ticket with ID {ticketId} not found...</p>;

  return (
    <Form layout="vertical">
      <Flex gap={16} align="center">
        <Form.Item className="flex-1" label="First Names" name="firstNames">
          <b>{ticket.passengerDetails?.firstNames}</b>
        </Form.Item>
        <Form.Item className="flex-1" label="Last Name" name="lastName">
          <b>{ticket.passengerDetails?.lastName}</b>
        </Form.Item>
        <Form.Item label="Gender" name="gender" className="flex-1">
          <b>{ticket.passengerDetails?.gender}</b>
        </Form.Item>
        <Form.Item
          className="flex-1"
          label="Passport Number"
          name="passportNumber"
        >
          <b>{ticket.passengerDetails?.passportNumber}</b>
        </Form.Item>
        <Link
          target="_blank"
          href={`${authenticatedUser?.role === "Agency" ? eRoutes.agencyTickets : eRoutes.clientTickets}/${ticket._id}`}
        >
          <Button
            style={{
              backgroundColor: "#ebe5df",
              color: "#886f65",
              borderColor: "#886f65",
            }}
            className="w-[8.75rem] mb-3 hover:font-medium"
            type="primary"
          >
            View Ticket
          </Button>
        </Link>
      </Flex>
    </Form>
  );
};

export default PassengerListLabel;
