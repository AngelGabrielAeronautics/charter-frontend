"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CreditCardOutlined,
  ExclamationCircleFilled,
  IssuesCloseOutlined,
  MinusOutlined,
  PlusOutlined,
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
  Flex,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Space,
  Typography,
  message,
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
import { IAddress } from "@/lib/models/IAddress";
import { IBooking } from "@/lib/models/IBooking";
import { createBooking, reset } from "@/lib/state/bookings/bookings.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import { updateUser } from "@/lib/state/users/users.slice";

const { confirm, info } = Modal;

const formItemStyle = {};
const inputStyle = { width: "100%" };

const FlightDetailsComponent = () => {
  const dispatch = useAppDispatch();
  const [showAddressForm, setShowAddressForm] = useState(false);

  const { authenticatedUser, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  // const { selectedFlight?.operator } = useAppSelector((state) => state.operators);
  const { selectedFlight } = useAppSelector((state) => state.flights);
  const { redirect } = useAppSelector((state) => state.bookings);

  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalFlightPrice, setTotalFlightPrice] = useState(0);

  const router = useRouter();
  const pathname = usePathname();

  const Panel = Collapse.Panel;
  const { Text, Title } = Typography;

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
    if (selectedFlight?.capacity) {
      calculateTotalFlightPrice(selectedFlight.capacity);
    }
  }, [selectedFlight]);

  const calculateTotalFlightPrice = (totalSeats: number) => {
    if (selectedFlight?.capacity) {
      const totalAmount = totalSeats * selectedFlight.pricePerSeat;
      setTotalFlightPrice(totalAmount);
    }
  };

  const calculateTotalPrice = (seats: number) => {
    if (selectedFlight?.pricePerSeat) {
      const total = seats * selectedFlight.pricePerSeat;
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

  const processPurchase = (numberOfSeats: number | string) => {
    if (selectedFlight) {
      const bookingPayload = getBookingPayload(
        typeof numberOfSeats == "string" && numberOfSeats == "All"
          ? selectedFlight.maxSeatsAvailable
          : (numberOfSeats as number)
      );
      if (bookingPayload) dispatch(createBooking(bookingPayload));
    }
  };

  const purchaseAllTickets = () => {
    confirm({
      title: "Confirm Purchase",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to book this entire flight?",
      onOk: () => {
        if (isAuthenticated && authenticatedUser) {
          if (authenticatedUser.address) {
            processPurchase("All");
          } else setShowAddressForm(true);
        } else {
          info({
            title: "Unauthenticated",
            content: "You must be signed in to book a flight",
            okText: "Sign in now",
            onOk: () => {
              router.push(`/login?returnUrl=${pathname}`);
            },
          });
        }
      },
    });
  };

  const purchaseSingleTicket = () => {
    confirm({
      title: "Confirm Purchase",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to book a seat on this flight?",
      onOk: () => {
        if (isAuthenticated && authenticatedUser) {
          if (authenticatedUser.address) {
            processPurchase(1);
          } else setShowAddressForm(true);
        } else {
          info({
            title: "Unauthenticated",
            content: "You must be signed in to book a flight",
            okText: "Sign in now",
            onOk: () => {
              router.push(`/login?returnUrl=${pathname}`);
            },
          });
        }
      },
    });
  };

  const purchaseMultipleTickets = () => {
    confirm({
      title: "Confirm Purchase",
      icon: <ExclamationCircleFilled />,
      content: `Are you sure you want to book ${numberOfSeats} seats on this flight?`,
      onOk: () => {
        if (isAuthenticated && authenticatedUser) {
          if (authenticatedUser.address) {
            processPurchase(numberOfSeats);
          } else setShowAddressForm(true);
        } else {
          info({
            title: "Unauthenticated",
            content: "You must be signed in to book a flight",
            okText: "Sign in now",
            onOk: () => {
              router.push(`/login?returnUrl=${pathname}`);
            },
          });
        }
      },
    });
  };

  const [address, setAddress] = useState<IAddress>(authenticatedUser?.address!);

  const handleAddressSave = () => {
    if (address.street && address.city && address.state && address.country) {
      const payload = { address };
      dispatch(updateUser({ id: authenticatedUser?._id!, payload }));
    }
  };

  useEffect(() => {
    if (authenticatedUser?.address && showAddressForm) {
      setShowAddressForm(false);
      message.success({
        content: "Address saved successfully",
      });
    }
    return () => {};
  }, [authenticatedUser?.address]);

  return (
    <main>
      <div>
        <Row
          className="p-2"
          style={{ background: "#EBE5DF", borderRadius: 20 }}
        >
          <Col span={24}>
            <Card
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
                      {formatUCTtoISO(`${selectedFlight?.departure}`)}
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
                      {formatUCTtoISO(`${selectedFlight?.arrivalDate}`)}
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
                      {selectedFlight?.capacity} Max
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
                    <strong style={{ fontSize: 12 }}>
                      {petFriendly()} Max
                    </strong>
                  </div>
                </Flex>
              </div>
              <br />
            </Card>
          </Col>
          <Row style={{ width: "100%" }}>
            <Col span={24} className="flex p-4">
              {selectedFlight?.capacity ==
                selectedFlight?.maxSeatsAvailable && (
                <>
                  <Flex justify="space-between">
                    <span
                      className="centre-content"
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#49666f",
                      }}
                    >
                      Book dead leg flight
                    </span>
                    <div className="flex flex-col items-end">
                      <span
                        style={{
                          color: "#736764",
                          fontSize: 16,
                          fontWeight: "bold",
                        }}
                      >
                        Total: {formatToMoneyWithCurrency(totalFlightPrice)}
                      </span>
                      <Button
                        style={{
                          height: "1rem",
                          width: "5.5rem",
                          backgroundColor: "#736764",
                          marginTop: 10,
                          fontSize: 12,
                        }}
                        type="primary"
                        onClick={purchaseAllTickets}
                      >
                        BUY
                      </Button>
                    </div>
                  </Flex>
                  <Divider style={{ margin: "1rem 0" }} />
                </>
              )}
              <Flex justify="space-between">
                <span
                  className="centre-content"
                  style={{ fontSize: 18, fontWeight: "bold", color: "#49666f" }}
                >
                  Book by seat
                </span>
                <div className="flex flex-col items-end">
                  <h4 className="mb-0" style={{ color: "#736764" }}>
                    {selectedFlight?.pricePerSeat
                      ? formatToMoneyWithCurrency(selectedFlight?.pricePerSeat)
                      : formatToMoneyWithCurrency(0)}
                  </h4>
                  <p style={{ color: "#736764" }}>per seat</p>
                </div>
              </Flex>
              <Card style={{ marginTop: 40, backgroundColor: "#fcf8f4" }}>
                <Flex
                  align="center"
                  justify="space-between"
                  style={{ fontSize: 16, color: "#42454F" }}
                >
                  <p>Seats</p>
                  <Space>
                    <MinusOutlined
                      style={{ color: "#736764" }}
                      onClick={() => {
                        if (numberOfSeats > 1) {
                          setNumberOfSeats(numberOfSeats - 1);
                        }
                      }}
                    />{" "}
                    {numberOfSeats}{" "}
                    <PlusOutlined
                      style={{ color: "#736764" }}
                      onClick={() => {
                        if (selectedFlight?.maxSeatsAvailable) {
                          if (selectedFlight?.maxSeatsAvailable > numberOfSeats)
                            setNumberOfSeats(numberOfSeats + 1);
                        }
                      }}
                    />
                  </Space>
                </Flex>
              </Card>
              <Flex justify="end">
                <p
                  style={{
                    fontSize: 20,
                    color: "#0B3746",
                    fontWeight: "bold",
                    paddingTop: 30,
                    paddingBottom: 20,
                  }}
                >
                  Total: {formatToMoneyWithCurrency(totalPrice)}
                </p>
              </Flex>
              <Flex>
                <Row
                  justify="end"
                  style={{ width: "100%", height: 58 }}
                  className="content-center"
                >
                  <Button
                    icon={<CreditCardOutlined />}
                    style={{
                      width: "14rem",
                      marginTop: "1rem",
                      backgroundColor: "#736764",
                    }}
                    type="primary"
                    onClick={() => {
                      numberOfSeats > 1
                        ? purchaseMultipleTickets()
                        : purchaseSingleTicket();
                    }}
                  >
                    BUY NOW
                  </Button>
                </Row>
              </Flex>
            </Col>
          </Row>
        </Row>
        {/* Operator Section */}
        <h3 style={{ marginTop: 30 }}>Operator</h3>
        <Card
          style={{
            marginBottom: "20px",
            borderRadius: "20px",
            border: "none",
            backgroundColor: "#f0eae3",
          }}
        >
          <Row gutter={16} align="middle" justify="start">
            <Col span={8}>
              <div style={{ textAlign: "center" }}>
                <Image
                  preview={false}
                  style={{ width: 80, height: 80, borderRadius: "50%" }}
                  src={`data:${selectedFlight?.operator?.logo?.mimetype};base64,${selectedFlight?.operator?.logo?.data}`}
                />
                <Title level={5}>{selectedFlight?.operator?.airline}</Title>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ textAlign: "center" }}>
                {selectedFlight?.operator?.status == "Verified" && (
                  <CheckCircleOutlined
                    style={{
                      fontSize: "63px",
                      color: "#52c41a",
                      marginTop: 10,
                    }}
                  />
                )}
                {selectedFlight?.operator?.status == "Unverified" && (
                  <CloseCircleOutlined
                    style={{
                      fontSize: "63px",
                      color: "#fa4f50",
                      marginTop: 10,
                    }}
                  />
                )}
                <Title style={{ marginTop: 10 }} level={5}>
                  {selectedFlight?.operator?.status} Operator
                </Title>
              </div>
            </Col>
            {/* <Col span={8}>
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
            </Col> */}
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
              <div style={{ textAlign: "left", marginLeft: 10 }}>
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
                  {selectedFlight?.operator?.certifications
                    ?.airOperatingCertificate && (
                    <Link
                      style={{ color: "#0c3747" }}
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`data:application/pdf;base64,${selectedFlight?.operator?.certifications?.airOperatingCertificate?.file?.data}`}
                      download={
                        selectedFlight?.operator?.certifications
                          ?.airOperatingCertificate?.file?.name
                      }
                    >
                      <IoMdDownload
                        style={{
                          marginLeft: 8,
                          marginRight: 40,
                          marginTop: 10,
                          fontSize: 16,
                        }}
                      />
                    </Link>
                  )}
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
                  {selectedFlight?.operator?.certifications
                    ?.certificateOfInsurance && (
                    <Link
                      style={{ color: "#0c3747" }}
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`data:application/pdf;base64,${selectedFlight?.operator?.certifications?.certificateOfInsurance?.file?.data}`}
                      download={
                        selectedFlight?.operator?.certifications
                          ?.certificateOfInsurance?.file?.name
                      }
                    >
                      <IoMdDownload
                        style={{
                          marginLeft: 8,
                          marginRight: 40,
                          marginTop: 10,
                          fontSize: 16,
                        }}
                      />
                    </Link>
                  )}
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
                  {selectedFlight?.operator?.certifications
                    ?.certificateOfAirworthiness && (
                    <Link
                      style={{ color: "#0c3747" }}
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`data:application/pdf;base64,${selectedFlight?.operator?.certifications?.certificateOfAirworthiness?.file?.data}`}
                      download={
                        selectedFlight?.operator?.certifications
                          ?.certificateOfAirworthiness?.file?.name
                      }
                    >
                      <IoMdDownload
                        style={{
                          marginLeft: 8,
                          marginRight: 40,
                          marginTop: 10,
                          fontSize: 16,
                        }}
                      />
                    </Link>
                  )}
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
          <Title level={5}>
            {selectedFlight?.aircraft?.manufacturer}{" "}
            {selectedFlight?.aircraft?.model}
          </Title>
          <Carousel
            fade={true}
            autoplaySpeed={2800}
            adaptiveHeight={true}
            autoplay={true}
            arrows
            infinite={false}
          >
            {selectedFlight?.aircraft?.images?.map((file, index) => (
              <div key={index}>
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
                    backgroundImage: file
                      ? `url('data:${file.mimetype};base64,${file.data}')`
                      : "none",
                  }}
                ></div>
              </div>
            ))}
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
                          {selectedFlight?.aircraft?.powerPlant}
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
                          {selectedFlight?.aircraft?.cruiseSpeedInKnots}
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
                          {selectedFlight?.aircraft?.pressurized ? "Yes" : "No"}
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
                            Cabin Size
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
                          {selectedFlight?.aircraft?.cabinHeight}m
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
                          {selectedFlight?.aircraft?.cabinWidth}m
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
                          {selectedFlight?.aircraft?.cabinLength}m
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
                            Heated
                          </Text>
                        </div>
                      </div>
                    </Col>
                    <Col style={{ marginLeft: 20 }}>
                      <div style={{ marginBottom: 10 }}>
                        <Text style={{ fontSize: 16, color: "#736764" }} strong>
                          {selectedFlight?.aircraft?.hasWashCloset
                            ? "Yes"
                            : "No"}
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
                          {selectedFlight?.aircraft?.airConAvailable
                            ? "Yes"
                            : "No"}
                        </Text>
                        <br />
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Text style={{ fontSize: 16, color: "#736764" }} strong>
                          {selectedFlight?.aircraft?.heated ? "Yes" : "No"}
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
                          {selectedFlight?.aircraft?.minimumCockpitCrew}
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
                          {selectedFlight?.aircraft?.inflightServicePersonnel}
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
            <Panel header="Terms and Conditions" key="12">
              <p>
                {selectedFlight?.operator?.termsAndConditions?.data && (
                  <Link
                    style={{ color: "#0c3747" }}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`data:application/pdf;base64,${selectedFlight?.operator.termsAndConditions.data}`}
                    download={
                      selectedFlight?.operator.termsAndConditions.name ||
                      "TermsAndConditions.pdf"
                    }
                  >
                    {selectedFlight?.operator.termsAndConditions.name ||
                      "Terms and Conditions"}
                  </Link>
                )}
              </p>
            </Panel>
            <Panel header="Cancellation Policy" key="2">
              <p>{selectedFlight?.operator?.cancellationPolicy}</p>
            </Panel>
            <Panel header="Refund Policy" key="3">
              <p>{selectedFlight?.operator?.refundPolicy}</p>
            </Panel>
          </Collapse>
        </Card>
      </div>
      <Modal
        title="Billing Address Required"
        open={showAddressForm}
        onOk={() => {
          handleAddressSave();
          setShowAddressForm(false);
        }}
        onCancel={() => setShowAddressForm(false)}
        footer={null}
      >
        <p>A billing address is required in order to generate your invoice</p>
        <Divider style={{ marginTop: "1rem" }} />
        <Form layout="vertical" style={{ width: "35%" }}>
          <Form.Item style={formItemStyle} label="Street Address">
            <Input
              size="large"
              type="name"
              className="custom-field-input"
              placeholder="Street Address"
              autoComplete=""
              allowClear
              defaultValue={authenticatedUser?.address?.street}
              value={address?.street}
              style={inputStyle}
              onChange={(event) =>
                setAddress({ ...address, street: event.target.value })
              }
            />
          </Form.Item>
          <Form.Item style={formItemStyle} label="City">
            <Input
              size="large"
              type="name"
              className="custom-field-input"
              placeholder="City"
              autoComplete=""
              allowClear
              defaultValue={authenticatedUser?.address?.city}
              value={address?.city}
              style={inputStyle}
              onChange={(event) =>
                setAddress({ ...address, city: event.target.value })
              }
            />
          </Form.Item>
          <Form.Item style={formItemStyle} label="State / Province">
            <Input
              size="large"
              type="name"
              className="custom-field-input"
              placeholder="State / Province"
              autoComplete=""
              allowClear
              defaultValue={authenticatedUser?.address?.state}
              value={address?.state}
              style={inputStyle}
              onChange={(event) =>
                setAddress({ ...address, state: event.target.value })
              }
            />
          </Form.Item>
          <Form.Item style={formItemStyle} label="Country">
            <Input
              size="large"
              type="name"
              className="custom-field-input"
              placeholder="Country"
              autoComplete=""
              allowClear
              defaultValue={authenticatedUser?.address?.country}
              value={address?.country}
              style={inputStyle}
              onChange={(event) =>
                setAddress({ ...address, country: event.target.value })
              }
            />
          </Form.Item>
          <Form.Item style={formItemStyle} label="Postal Code">
            <Input
              size="large"
              type="name"
              className="custom-field-input"
              placeholder="Postal Code"
              autoComplete=""
              allowClear
              defaultValue={authenticatedUser?.address?.postalCode}
              value={address?.postalCode}
              style={inputStyle}
              onChange={(event) =>
                setAddress({ ...address, postalCode: event.target.value })
              }
            />
          </Form.Item>
          <Flex gap={16} style={{ width: "100%" }}>
            <Button
              style={{ width: "12rem" }}
              block
              type="primary"
              onClick={handleAddressSave}
            >
              SAVE CHANGES
            </Button>
          </Flex>
        </Form>
      </Modal>
    </main>
  );
};

export default FlightDetailsComponent;
