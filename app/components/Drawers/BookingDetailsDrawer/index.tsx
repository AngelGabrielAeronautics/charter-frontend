import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  IssuesCloseOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Carousel,
  Col,
  Collapse,
  Divider,
  Drawer,
  Flex,
  Image,
  Modal,
  Rate,
  Row,
  Typography,
} from "antd";
import { BsAirplaneEngines } from "react-icons/bs";
import { FaPlaneArrival, FaPlaneDeparture } from "react-icons/fa";
import { GiPressureCooker } from "react-icons/gi";
import { IoMdDownload } from "react-icons/io";
import { IoAirplane } from "react-icons/io5";
import {
  MdOutlineAirplanemodeActive,
  MdOutlineMasks,
  MdSpeed,
} from "react-icons/md";

import themeColors from "@/app/(config)/colors";

import {
  formatToMoneyWithCurrency,
  formatUCTtoISO,
} from "@/lib/helpers/formatters.helpers";
import { IBooking } from "@/lib/models/IBooking";
import { IOperator } from "@/lib/models/IOperators";
import { IFlight } from "@/lib/models/flight.model";
import { IPerson } from "@/lib/models/person.model";
import { reset, update } from "@/lib/state/bookings/bookings.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import { filter } from "@/lib/state/tickets/slice";

import StatusTag from "../../StatusTag";
import PassengerList from "./PassengerList";

const Panel = Collapse.Panel;
const { Text, Title } = Typography;

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: "450px",
  color: "#f0eae3",
  lineHeight: "450px",
  textAlign: "center",
  background: "#f0eae3",
  borderRadius: "16px",
};

interface Passenger {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
}

const { confirm } = Modal;

interface BookingsDetailProps {
  visible: boolean;
  onClose: () => void;
}

const BookingDetailsDrawer: React.FC<BookingsDetailProps> = ({
  visible,
  onClose,
}) => {
  const { redirect, selectedBooking } = useAppSelector(
    (state) => state.bookings
  );
  const [selectedFlight, setSelectedFlight] = useState<IFlight>();
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalFlightPrice, setTotalFlightPrice] = useState(0);
  const [purchaseAmount, setPurchaseAmount] = useState(0);
  const [passengers, setPassengers] = useState<IPerson[]>([]);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const { authenticatedUser } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (selectedBooking) {
      dispatch(filter({ bookingId: selectedBooking._id }));
    }
  }, [selectedBooking, dispatch]);

  useEffect(() => {
    if (redirect.shouldRedirect && redirect.redirectPath) {
      router.push(redirect.redirectPath);
      dispatch(reset());
    }
  }, [redirect]);

  useEffect(() => {
    if (selectedFlight?.pricePerSeat) {
      calculateTotalPrice(numberOfSeats);
    }
  }, [selectedFlight, numberOfSeats]);

  useEffect(() => {
    if (
      typeof selectedBooking?.flightId == "object" &&
      selectedBooking?.flightId
    ) {
      setSelectedFlight(selectedBooking?.flightId);
    }
  }, [selectedBooking?.flightId]);

  useEffect(() => {
    if (selectedFlight?.capacity) {
      calculateTotalFlightPrice(selectedFlight.capacity);
    }
  }, [selectedFlight]);

  useEffect(() => {
    if (selectedBooking?.numberOfPassengers) {
      calculatePurchaseAmount(selectedBooking.numberOfPassengers);
    }
  });

  useEffect(() => {
    if (selectedBooking?.numberOfPassengers) {
      calculatePurchaseAmount(selectedBooking.numberOfPassengers);
      setPassengers(Array(selectedBooking.numberOfPassengers).fill({}));
    }
  }, [selectedBooking]);

  const calculatePurchaseAmount = (numberOfPassengers: number) => {
    if (selectedBooking?.numberOfPassengers && selectedFlight) {
      const purchaseAmount = numberOfPassengers * selectedFlight?.pricePerSeat;
      setPurchaseAmount(purchaseAmount);
    }
  };

  const calculateTotalFlightPrice = (totalSeats: number) => {
    if (selectedFlight?.capacity) {
      const totalAmount = totalSeats * selectedFlight.pricePerSeat;
      setTotalFlightPrice(totalAmount);
    }
  };

  const calculateTotalPrice = (seats: number) => {
    if (selectedFlight?.pricePerSeat) {
      const total = seats * selectedFlight?.pricePerSeat;
      setTotalPrice(total);
    }
  };

  const petFriendly = () => {
    if (selectedFlight?.petsAllowed == true) {
      return "Pet friendly flight";
    } else {
      return "No pets allowed";
    }
  };

  const getDepartureTime = () => {
    if (selectedFlight?.departure) {
      const departureDate = new Date(selectedFlight.departure);
      const hours = departureDate.getHours();
      const minutes = departureDate.getMinutes();
      const departureTime = `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
      return departureTime;
    }
  };

  const getArrivalTime = () => {
    if (
      selectedFlight?.departure &&
      selectedFlight.duration &&
      selectedFlight.durationMinutes
    ) {
      // Calculate the total duration in milliseconds
      const durationInMilliseconds =
        selectedFlight?.duration * 60 * 60 * 1000 +
        selectedFlight?.durationMinutes * 60 * 1000;
      const departureDate = new Date(selectedFlight.departure);
      // Calculate the arrival date and time by adding the duration to the departure date
      const arrivalDateTime = new Date(
        departureDate.getTime() + durationInMilliseconds
      );

      // Convert the arrivalDateTime to an ISO string or any desired format
      const arrivalDateTimeISO = arrivalDateTime.toISOString();
      // Extract hours and minutes in UTC
      const hours = String(arrivalDateTime.getUTCHours()).padStart(2, "0");
      const minutes = String(arrivalDateTime.getUTCMinutes()).padStart(2, "0");

      // Format as "HH:MM"
      const formattedArrivalTime = `${hours}:${minutes}`;

      return formattedArrivalTime;
    }
  };

  const getBookingPayload = (seatCount: number): IBooking | null => {
    if (!authenticatedUser) return null;
    if (!selectedFlight) return null;

    const total = seatCount * selectedFlight.pricePerSeat;

    return {
      customer: {
        _id: authenticatedUser?._id,
        firstNames: authenticatedUser?.firstNames,
        lastName: authenticatedUser?.lastName,
        displayName: authenticatedUser?.displayName,
        email: authenticatedUser?.email,
        rolePermissions: [],
      },
      numberOfPassengers: seatCount,
      flightNumber: selectedFlight?.flightNumber,
      flightId: selectedFlight?._id,
      operatorId: selectedFlight?.operatorId,
      operatorName: selectedFlight?.airline,
      items: [
        {
          adults: seatCount,
          children: 0,
          infants: 0,
          totalNumberOfPassengers: seatCount,
          totalPrice: total,
        },
      ],
      currency: "USD",
      subTotal: total,
      taxAmount: total * 0.15,
      totalAmount: total + total * 0.15,
      status: "Pending",
      auditFields: {
        createdBy: authenticatedUser.displayName,
        createdById: authenticatedUser._id ?? "",
        dateCreated: new Date(),
      },
    };
  };

  const cancelBooking = () => {
    const data = {
      id: selectedBooking?._id!,
      payload: { status: "Cancelled" },
    };
    confirm({
      title: "Confirm Cancel Booking",
      content: "Are you sure you want to cancel this booking?",
      onOk: () => {
        dispatch(update(data));
      },
    });
  };

  const renderVerificationBadge = () => {
    const operator = selectedBooking?.operatorId as IOperator;

    if (operator.status == "Verified") {
      return (
        <>
          <CheckCircleOutlined
            style={{ fontSize: "63px", color: "#52c41a", marginTop: 10 }}
          />
          <Title style={{ marginTop: 10 }} level={5}>
            Verified Operator
          </Title>
        </>
      );
    }

    return (
      <>
        <CloseCircleOutlined
          style={{ fontSize: "63px", color: "red", marginTop: 10 }}
        />
        <Title style={{ marginTop: 10 }} level={5}>
          Unverified Operator
        </Title>
      </>
    );
  };

  return (
    <Drawer
      title="Booking Details"
      extra={[
        <StatusTag key="status" status={selectedBooking?.status ?? ""} />,
      ]}
      width={1200}
      onClose={onClose}
      open={visible}
      style={{ backgroundColor: "#f7f2ed" }}
    >
      <div>
        <Row
          className="p-2"
          style={{ background: "#EBE5DF", borderRadius: 20 }}
        >
          <Col span={24}>
            <Card
              styles={{ body: { padding: "1rem", marginBottom: "0" } }}
              style={{
                background: "#ebe5df",
                borderRadius: 18,
                color: "#49666f",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: 218,
                  backgroundColor: themeColors.grey,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  marginBottom: 0,
                }}
                className="bg-[url('https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/33/f5/de/london.jpg?w=1400&h=1400&s=1')]"
              ></div>
              <div
                style={{
                  backgroundColor: "#d8d1ca",
                  width: "100%",
                  height: 58,
                }}
                className="content-center"
              >
                <Flex
                  justify="space-between"
                  style={{ fontSize: "1rem", marginLeft: 15, marginRight: 15 }}
                >
                  <Flex align="center">
                    <CalendarOutlined
                      style={{ fontSize: 12 }}
                      className="mr-2"
                    />{" "}
                    <span style={{ fontSize: 12 }}>
                      {selectedFlight &&
                        formatUCTtoISO(`${selectedFlight.departure}`)}
                    </span>
                  </Flex>
                  <Flex align="center">
                    <FaPlaneDeparture
                      style={{ fontSize: 12 }}
                      className="mr-2"
                    />{" "}
                    <span style={{ fontSize: 12 }}>
                      Departure {getDepartureTime()} local
                    </span>
                  </Flex>
                  <Flex align="center">
                    <CalendarOutlined
                      style={{ fontSize: 12 }}
                      className="mr-2"
                    />{" "}
                    <span style={{ fontSize: 12 }}>
                      {selectedFlight &&
                        formatUCTtoISO(`${selectedFlight.arrivalDate}`)}
                    </span>
                  </Flex>
                  <Flex align="center">
                    <FaPlaneArrival style={{ fontSize: 12 }} className="mr-2" />{" "}
                    <span style={{ fontSize: 12 }}>
                      Arrival {getArrivalTime()} local
                    </span>
                  </Flex>
                </Flex>
              </div>
              <div
                style={{
                  backgroundColor: "#f1eae1",
                  width: "100%",
                  height: 90,
                }}
              >
                <Row
                  justify="center"
                  className="content-center"
                  style={{
                    backgroundColor: "#f1eae1",
                    width: "100%",
                    height: 90,
                  }}
                >
                  <div>
                    <strong style={{ fontSize: 20 }}>
                      {selectedFlight?.departureAirport?.shortLabel}
                    </strong>
                  </div>
                  <div
                    style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 8 }}
                  >
                    <IoAirplane style={{ fontSize: 20 }} />
                  </div>
                  <div>
                    <strong style={{ fontSize: 20 }}>
                      {selectedFlight?.arrivalAirport?.shortLabel}
                    </strong>
                  </div>
                </Row>
              </div>
              <div
                style={{
                  backgroundColor: "#d8d1ca",
                  width: "100%",
                  height: 58,
                }}
                className="content-center"
              >
                <Flex
                  justify="space-between"
                  style={{ fontSize: "1rem", marginLeft: 15, marginRight: 15 }}
                >
                  <div>
                    <UserOutlined style={{ fontSize: 12 }} />{" "}
                    <strong style={{ fontSize: 12 }}>
                      {selectedBooking?.numberOfPassengers ?? 0} Seats
                    </strong>
                  </div>
                  <div>
                    <ShoppingOutlined style={{ fontSize: 12 }} />{" "}
                    <strong style={{ fontSize: 12 }}>
                      {selectedFlight?.maxLuggagePerPerson}{" "}
                      {selectedFlight?.luggageWeightUnits} per person
                    </strong>
                  </div>
                  <div>
                    <IssuesCloseOutlined style={{ fontSize: 12 }} />{" "}
                    <strong style={{ fontSize: 12 }}>{petFriendly()}</strong>
                  </div>
                </Flex>
              </div>
              <br />
            </Card>
          </Col>
          <Row style={{ width: "100%" }}>
            <Col span={24} className="flex p-4">
              <Flex justify="space-between">
                <span
                  className="centre-content"
                  style={{ fontSize: 20, fontWeight: "bold", color: "#49666f" }}
                >
                  Purchase Amount
                </span>
                <div className="flex flex-col items-end">
                  <span
                    style={{
                      color: "#736764",
                      fontSize: 16,
                      fontWeight: "bold",
                      marginBottom: 10,
                    }}
                  >
                    Total:{" "}
                    {formatToMoneyWithCurrency(
                      selectedBooking?.totalAmount ?? 0
                    )}
                  </span>
                  {selectedBooking?.status != "Cancelled" && (
                    <Button
                      onClick={cancelBooking}
                      style={{
                        width: "8rem",
                        backgroundColor: "#ebe5df",
                        color: "#886f65",
                        borderColor: "#886f65",
                      }}
                      className="hover:font-medium"
                      type="primary"
                    >
                      Cancel Booking
                    </Button>
                  )}
                </div>
              </Flex>
            </Col>
          </Row>
        </Row>
        <PassengerList />
        <h3 style={{ marginTop: 30 }}>Operator</h3>
        <Card
          style={{
            marginBottom: "20px",
            borderRadius: "20px",
            border: "none",
            backgroundColor: "#f0eae3",
          }}
        >
          <Row gutter={16} align="middle" justify="center">
            <Col span={8}>
              <div style={{ textAlign: "center" }}>
                <Image
                  src={
                    typeof selectedBooking?.operatorId === "object" &&
                    selectedBooking?.operatorId.logo
                      ? selectedBooking?.operatorId.logo.data
                      : "https://w7.pngwing.com/pngs/690/841/png-transparent-lufthansa-logo-lufthansa-cargo-flight-airline-logo-airline-miscellaneous-text-otto-firle.png"
                  }
                  preview={false}
                  style={{ width: 80, height: 80, borderRadius: "50%" }}
                />
                <Title level={5}>
                  {typeof selectedBooking?.operatorId === "object"
                    ? selectedBooking?.operatorId.airline
                    : ""}
                </Title>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ textAlign: "center" }}>
                {renderVerificationBadge()}
              </div>
            </Col>
            <Col span={8}>
              <div style={{ textAlign: "center" }}>
                <Rate
                  style={{ color: "#0b3746", fontSize: 20, marginTop: 30 }}
                  disabled
                  defaultValue={4}
                />
                <Title style={{ marginTop: 30 }} level={5}>
                  Customer Satisfaction
                </Title>
              </div>
            </Col>
          </Row>
        </Card>
        <Card
          style={{
            marginBottom: "20px",
            borderRadius: "20px",
            border: "none",
            backgroundColor: "#f0eae3",
          }}
        >
          <Row gutter={16} align="middle" justify="center">
            <Col span={24}>
              <div style={{ textAlign: "left", marginLeft: 60 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 30,
                  }}
                >
                  <Text style={{ fontSize: 14, marginTop: 10 }} strong>
                    Air Operating Certificate
                  </Text>
                  <IoMdDownload
                    style={{
                      marginLeft: 8,
                      marginRight: 40,
                      marginTop: 10,
                      fontSize: 16,
                    }}
                  />
                </div>
                <Divider />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 30,
                  }}
                >
                  <Text style={{ fontSize: 14 }} strong>
                    Certificate of Insurance
                  </Text>
                  <IoMdDownload
                    style={{ marginLeft: 8, marginRight: 40, fontSize: 16 }}
                  />
                </div>
                <Divider />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 14 }} strong>
                    Certificate of Air Worthiness
                  </Text>
                  <IoMdDownload
                    style={{ marginLeft: 8, marginRight: 40, fontSize: 16 }}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Card>
        {/* Aircraft Section */}
        <h3 style={{ marginTop: 30 }}>Your Aircraft</h3>
        <Card
          style={{
            marginBottom: "20px",
            borderRadius: "20px",
            border: "none",
            backgroundColor: "#f0eae3",
          }}
        >
          <Title level={5}>Phenom 100</Title>
          <Carousel
            fade={true}
            autoplaySpeed={2800}
            adaptiveHeight={true}
            autoplay={true}
            arrows
            infinite={false}
          >
            <div>
              <div
                style={{
                  width: "100%",
                  height: 300,
                  backgroundColor: themeColors.grey,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  marginBottom: 0,
                }}
                className="bg-[url('https://media.wired.com/photos/59095ba376f462691f012b38/master/pass/15C558_07_V2.jpg')]"
              ></div>
            </div>
            <div>
              <div
                style={{
                  width: "100%",
                  height: 300,
                  backgroundColor: themeColors.grey,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  marginBottom: 0,
                }}
                className="bg-[url('https://cdn.boatinternational.com/convert/bi_prd/bi/library_images/p5xmO2xTdmJTsaBLduQL_Lufthansa-Technik-Mercedes-Benz-Style-VIP-cabin.jpg/r%5Bwidth%5D=1920/p5xmO2xTdmJTsaBLduQL_Lufthansa-Technik-Mercedes-Benz-Style-VIP-cabin.jpg')]"
              ></div>
            </div>
            <div>
              <div
                style={{
                  width: "100%",
                  height: 300,
                  backgroundColor: themeColors.grey,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  marginBottom: 0,
                }}
                className="bg-[url('https://skystyle-design.com/wp-content/uploads/2021/08/BBJ-Max-7-Renderings-and-Animation-by-SkyStyle-Corporate-V11.jpg?40b4d9&40b4d9')]"
              ></div>
            </div>
            <div>
              <div
                style={{
                  width: "100%",
                  height: 300,
                  backgroundColor: themeColors.grey,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  marginBottom: 0,
                }}
                className="bg-[url('https://media.wired.com/photos/593724cdd80dd005b42b622d/master/w_2560%2Cc_limit/15C558_08_V2.jpg')]"
              ></div>
            </div>
          </Carousel>
          <Row
            style={{ marginTop: 20, marginLeft: 0, marginRight: 0 }}
            gutter={16}
            align="middle"
            justify="center"
          >
            <div className="w-full" style={{ borderRadius: 16 }}>
              <Flex justify="space-between">
                <div className="items-left justify-left flex h-full flex-col">
                  <Row>
                    <Col>
                      <div style={{ textAlign: "left" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 16,
                          }}
                        >
                          <BsAirplaneEngines
                            style={{
                              marginRight: 8,
                              fontSize: 15,
                              color: "#736764",
                            }}
                          />
                          <Text
                            style={{ fontSize: 14, color: "#736764" }}
                            strong
                          >
                            Power Plant
                          </Text>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 16,
                          }}
                        >
                          <MdSpeed
                            style={{
                              marginRight: 8,
                              fontSize: 15,
                              color: "#736764",
                            }}
                          />
                          <Text
                            style={{ fontSize: 14, color: "#736764" }}
                            strong
                          >
                            Cruise Speed kts
                          </Text>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 16,
                          }}
                        >
                          <GiPressureCooker
                            style={{
                              marginRight: 8,
                              fontSize: 15,
                              color: "#736764",
                            }}
                          />
                          <Text
                            style={{ fontSize: 14, color: "#736764" }}
                            strong
                          >
                            Pressurized
                          </Text>
                        </div>
                      </div>
                    </Col>
                    <Col style={{ marginLeft: 20 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: 12,
                        }}
                      >
                        <Text style={{ fontSize: 16, color: "#736764" }} strong>
                          Twin Jet
                        </Text>
                        <br />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: 11,
                        }}
                      >
                        <Text style={{ fontSize: 16, color: "#736764" }} strong>
                          200
                        </Text>
                        <br />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: 13,
                        }}
                      >
                        <Text style={{ fontSize: 16, color: "#736764" }} strong>
                          Yes
                        </Text>
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className="items-left justify-left flex h-full flex-col">
                  <Row>
                    <Col>
                      <div
                        style={{
                          textAlign: "left",
                          marginRight: 20,
                          marginLeft: 20,
                        }}
                      >
                        <div style={{ alignItems: "center", marginBottom: 16 }}>
                          <Text
                            style={{ fontSize: 16, color: "#736764" }}
                            strong
                          >
                            Power Plant
                          </Text>
                          <MdOutlineAirplanemodeActive
                            style={{
                              marginLeft: 18,
                              marginTop: 15,
                              fontSize: 35,
                              color: "#736764",
                            }}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: 14,
                        }}
                      >
                        <Text style={{ fontSize: 16, color: "#736764" }} strong>
                          <span style={{ color: "#736764", fontSize: 12 }}>
                            H{" "}
                          </span>
                          2.5m
                        </Text>
                        <br />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: 13,
                        }}
                      >
                        <Text style={{ fontSize: 16, color: "#736764" }} strong>
                          <span style={{ color: "#736764", fontSize: 12 }}>
                            W{" "}
                          </span>
                          4.5m
                        </Text>
                        <br />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: 13,
                        }}
                      >
                        <Text style={{ fontSize: 16, color: "#736764" }} strong>
                          <span style={{ color: "#736764", fontSize: 12 }}>
                            L{" "}
                          </span>
                          10m
                        </Text>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Flex>
            </div>
          </Row>
          <Divider />
          <Row
            style={{ marginLeft: 0, marginRight: 0 }}
            gutter={16}
            align="middle"
            justify="center"
          >
            <div className="w-full" style={{ borderRadius: 16 }}>
              <Flex justify="space-between">
                <div className="items-left justify-left flex h-full flex-col">
                  <Row>
                    <Col>
                      <div style={{ textAlign: "left" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 16,
                          }}
                        >
                          <MdOutlineMasks
                            style={{
                              marginRight: 8,
                              fontSize: 15,
                              color: "#736764",
                            }}
                          />
                          <Text
                            style={{ fontSize: 14, color: "#736764" }}
                            strong
                          >
                            WC
                          </Text>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 16,
                          }}
                        >
                          <MdOutlineMasks
                            style={{
                              marginRight: 8,
                              fontSize: 15,
                              color: "#736764",
                            }}
                          />
                          <Text
                            style={{ fontSize: 14, color: "#736764" }}
                            strong
                          >
                            AC
                          </Text>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 16,
                          }}
                        >
                          <MdOutlineMasks
                            style={{
                              marginRight: 8,
                              fontSize: 15,
                              color: "#736764",
                            }}
                          />
                          <Text
                            style={{ fontSize: 14, color: "#736764" }}
                            strong
                          >
                            Catering
                          </Text>
                        </div>
                      </div>
                    </Col>
                    <Col style={{ marginLeft: 20 }}>
                      <div style={{ marginBottom: 10 }}>
                        <Text style={{ fontSize: 16, color: "#736764" }} strong>
                          No
                        </Text>
                        <br />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: 14,
                        }}
                      >
                        <Text style={{ fontSize: 16, color: "#736764" }} strong>
                          Yes
                        </Text>
                        <br />
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Text style={{ fontSize: 16, color: "#736764" }} strong>
                          Basic
                        </Text>
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className="items-left justify-left flex h-full flex-col">
                  <Row>
                    <Col>
                      <div
                        style={{
                          textAlign: "left",
                          marginRight: 20,
                          marginLeft: 20,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 16,
                          }}
                        >
                          <MdOutlineMasks
                            style={{
                              marginRight: 8,
                              fontSize: 15,
                              color: "#736764",
                            }}
                          />
                          <Text
                            style={{ fontSize: 14, color: "#736764" }}
                            strong
                          >
                            Minimum Crew
                          </Text>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 16,
                          }}
                        >
                          <MdOutlineMasks
                            style={{
                              marginRight: 8,
                              fontSize: 15,
                              color: "#736764",
                            }}
                          />
                          <Text
                            style={{ fontSize: 14, color: "#736764" }}
                            strong
                          >
                            Hostess
                          </Text>
                        </div>
                      </div>
                    </Col>
                    <Col>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: 14,
                        }}
                      >
                        <Text style={{ fontSize: 16, color: "#736764" }} strong>
                          2
                        </Text>
                        <br />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: 13,
                        }}
                      >
                        <Text style={{ fontSize: 16, color: "#736764" }} strong>
                          0
                        </Text>
                        <br />
                      </div>
                    </Col>
                  </Row>
                </div>
              </Flex>
            </div>
          </Row>
        </Card>
        {/* Terms Section */}
        <h3 style={{ marginTop: 30 }}>Terms</h3>
        <Card
          style={{
            borderRadius: "20px",
            border: "none",
            backgroundColor: "#f0eae3",
            width: "100%",
          }}
        >
          <Collapse
            style={{ width: "100%", fontSize: 16, backgroundColor: "#f0eae3" }}
            accordion
            bordered={false}
          >
            <Panel header="Dead Leg Terms and Conditions" key="1">
              <p>Content for dead leg terms and conditions...</p>
            </Panel>
            <Panel header="Terms and Conditions" key="2">
              <p>Content for terms and conditions...</p>
            </Panel>
            <Panel header="Cancellation Policy" key="3">
              <p>Content for cancellation policy...</p>
            </Panel>
          </Collapse>
        </Card>
      </div>
    </Drawer>
  );
};

export default BookingDetailsDrawer;
