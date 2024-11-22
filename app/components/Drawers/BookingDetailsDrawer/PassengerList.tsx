import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button, Card, Flex, List } from "antd";

import { ITicket } from "@/lib/models/ITicket";
import { IPerson } from "@/lib/models/person.model";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";

import PassengerListForm from "./PassengerListForm";
import PassengerListLabel from "./PassengerListLabel";

interface Props {}

const PassengerList = ({}: Props) => {
  const [ticketList, setTicketList] = useState<ITicket[]>([]);

  const { selectedBooking } = useAppSelector((state) => state.bookings);
  const {
    records: tickets,
  } = useAppSelector((state) => state.tickets);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const passengerDetailsComplete = (_ticket: ITicket) => {
    const { passengerDetails } = _ticket;

    if (!passengerDetails) return false;
    if (!passengerDetails.firstNames) return false;
    if (!passengerDetails.lastName) return false;
    if (!passengerDetails.gender) return false;
    if (!passengerDetails.passportNumber) return false;

    return true;
  };

  useEffect(() => {
    if (tickets) {
      const preppedTickets = tickets.map((ticket: ITicket, index: number) => {
        const passengerDetails: IPerson = {
          firstNames: ticket.passengerDetails?.firstNames ?? "",
          lastName: ticket.passengerDetails?.lastName ?? "",
          gender: ticket.passengerDetails?.gender ?? undefined,
          passportNumber: ticket.passengerDetails?.passportNumber ?? "",
        };
        return {
          ...ticket,
          passengerDetails,
          key: ticket._id,
          index: index,
        };
      });

      setTicketList(preppedTickets);
    }
    return () => {};
  }, [tickets]);

  const openBookingInvoice = () => {
    const invoice = selectedBooking?.invoiceId;
    if (typeof invoice == "object") {
      router.push(`/invoices/${invoice._id}`);
    }
  };

  return (
    <div>
      <Flex justify="space-between" align="center" style={{ marginTop: 30 }}>
        <h3>Passengers</h3>
        <Button
          onClick={openBookingInvoice}
          style={{
            width: "8rem",
            backgroundColor: "#ebe5df",
            color: "#886f65",
            borderColor: "#886f65",
          }}
          className="mb-3 mr-6 hover:font-medium"
          type="primary"
        >
          View Invoice
        </Button>
      </Flex>
      <Card
        style={{
          marginBottom: "20px",
          borderRadius: "20px",
          border: "none",
          backgroundColor: "#f0eae3",
        }}
      >
        {ticketList && (
          <List
            dataSource={ticketList}
            renderItem={(ticket) => {
              return passengerDetailsComplete(ticket) ? (
                <PassengerListLabel ticketId={ticket._id!} />
              ) : (
                <PassengerListForm ticketId={ticket._id!} />
              );
            }}
          />
        )}
      </Card>
    </div>
  );
};

export default PassengerList;
