import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button, Card, Flex, Input, List, Select, Space, message } from "antd";

import { ITicket } from "@/lib/models/ITicket";
import { IPerson } from "@/lib/models/person.model";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import { update } from "@/lib/state/tickets/slice";

import { eRoutes } from "../../../(config)/routes";
import PassengerListForm from "./PassengerListForm";
import PassengerListLabel from "./PassengerListLabel";

interface Props {}

const PassengerList = ({}: Props) => {
  const [ticketList, setTicketList] = useState<ITicket[]>([]);

  const { selectedBooking } = useAppSelector((state) => state.bookings);
  const { authenticatedUser } = useAppSelector((state) => state.auth);
  const {
    records: tickets,
    loading,
    error,
    success,
  } = useAppSelector((state) => state.tickets);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstNames",
      key: "firstNames",
      render: (_: any, record: any) => {
        if (passengerDetailsComplete(record))
          return <p>{record.passengerDetails.firstNames}</p>;

        return (
          <Input
            className="custom-field-input"
            onChange={(event) => {
              record.passengerDetails.firstNames = event.target.value;
            }}
            style={{ width: "100%" }}
          />
        );
      },
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      render: (_: any, record: any) => {
        if (passengerDetailsComplete(record))
          return <p>{record.passengerDetails.lastName}</p>;

        return (
          <Input
            className="custom-field-input"
            onChange={(event) => {
              record.passengerDetails.lastName = event.target.value;
            }}
            style={{ width: "100%" }}
          />
        );
      },
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (_: any, record: any) => {
        if (passengerDetailsComplete(record))
          return <p>{record.passengerDetails.gender}</p>;

        return (
          <Select
            onChange={(value: any, option: any) => {
              record.passengerDetails.gender = value;
            }}
            style={{
              background: "#ffffff",
              borderRadius: "8px",
              width: "100%",
            }}
          >
            <Select.Option key="Male" value="Male">
              Male
            </Select.Option>
            <Select.Option key="Female" value="Female">
              Female
            </Select.Option>
          </Select>
        );
      },
    },
    {
      title: "Passport Number",
      dataIndex: "passportNumber",
      key: "passportNumber",
      render: (_: any, record: any) => {
        if (passengerDetailsComplete(record))
          return <p>{record.passengerDetails.passportNumber}</p>;

        return (
          <Input
            className="custom-field-input"
            onChange={(event) => {
              record.passengerDetails.passportNumber = event.target.value;
            }}
            style={{ width: "100%" }}
          />
        );
      },
    },
    {
      title: "",
      dataIndex: "",
      key: "",
      render: (_: any, record: ITicket, index: number) => {
        if (passengerDetailsComplete(record))
          return (
            <Link
              target="_blank"
              href={`${authenticatedUser?.role === "Agency" ? eRoutes.agencyTickets : eRoutes.clientTickets}/${record._id}`}
            >
              <Button
                style={{
                  width: "8rem",
                  backgroundColor: "#ebe5df",
                  color: "#886f65",
                  borderColor: "#886f65",
                }}
                className="mb-3 mr-6 hover:font-medium"
                type="primary"
              >
                View Ticket
              </Button>
            </Link>
          );

        return (
          <Space style={{ width: "100%" }}>
            <Button
              type="primary"
              onClick={() => {
                const isComplete = passengerDetailsComplete(record);
                if (isComplete) {
                  dispatch(
                    update({
                      id: record._id!,
                      payload: { passengerDetails: record.passengerDetails },
                    })
                  );
                } else {
                  message.error(
                    "Full passenger details required before you can generate a ticket"
                  );
                }
              }}
            >
              Generate Ticket
            </Button>
          </Space>
        );
      },
    },
  ];

  const passengerDetailsComplete = (_ticket: ITicket) => {
    const { passengerDetails } = _ticket;

    console.log(`🚀 ~ ${_ticket.ticketNumber} ~ Passenger Details => `, passengerDetails)

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

  const viewTicket = (id: string) => {
    router.push(
      `${authenticatedUser?.role === "Agency" ? eRoutes.agencyTickets : eRoutes.clientTickets}/${id}`
    );
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
              const shouldRenderPassengerListLabel =
                passengerDetailsComplete(ticket);
              console.log(
                "🚀 ~ PassengerList.tsx:251 ~ shouldRenderPassengerListLabel",
                shouldRenderPassengerListLabel
              );
              if (shouldRenderPassengerListLabel)
                return <PassengerListLabel ticketId={ticket._id!} />;
              return <PassengerListForm ticketId={ticket._id!} />;
            }}
          />
        )}
        {/* <Table
          className="ant-input.custom-field-input"
          dataSource={ticketList}
          columns={columns}
          rowKey={(_record, index) =>
            index !== undefined ? index.toString() : Math.random().toString()
          }
          pagination={false}
          style={{ marginTop: "1rem" }}
        /> */}
      </Card>
    </div>
  );
};

export default PassengerList;
