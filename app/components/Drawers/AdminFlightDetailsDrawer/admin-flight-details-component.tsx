"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  IssuesCloseOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Card,
  Carousel,
  Col,
  Collapse,
  Divider,
  Flex,
  Image,
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

import { formatUCTtoISO } from "@/lib/helpers/formatters.helpers";
import { reset } from "@/lib/state/bookings/bookings.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";

const AdminFlightDetailsComponent = () => {
  const dispatch = useAppDispatch();

  const { selectedFlight } = useAppSelector((state) => state.flights);
  const { redirect } = useAppSelector((state) => state.bookings);

  const router = useRouter();

  const Panel = Collapse.Panel;
  const { Text, Title } = Typography;

  useEffect(() => {
    if (redirect.shouldRedirect && redirect.redirectPath) {
      router.push(redirect.redirectPath);
      dispatch(reset());
    }
  }, [redirect]);

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

  return (
    <main>
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
            <CalendarOutlined style={{ fontSize: 12 }} className="mr-2" />{" "}
            <span style={{ fontSize: 12 }}>
              {formatUCTtoISO(`${selectedFlight?.departure}`)}
            </span>
          </Flex>
          <Flex align="center">
            <FaPlaneDeparture style={{ fontSize: 12 }} className="mr-2" />{" "}
            <span style={{ fontSize: 12 }}>
              Departure {getDepartureTime()} local
            </span>
          </Flex>
          <Flex align="center">
            <CalendarOutlined style={{ fontSize: 12 }} className="mr-2" />{" "}
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
          <div style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 8 }}>
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
            <strong style={{ fontSize: 12 }}>{petFriendly()} Max</strong>
          </div>
        </Flex>
      </div>
      {/* Operator Section */}
      <Flex
        justify="space-between"
        align="center"
        style={{ margin: "30px 6px 10px 6px" }}>
        <p className="font-bold">Operator</p>
        <p className="inline-block cursor-pointer font-bold hover:text-dark-tableHeaderBackground">
          <EyeOutlined /> View Details
        </p>
      </Flex>
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
                    href={`data:application/pdf;base64,${selectedFlight?.operator?.certifications?.airOperatingCertificate.data}`}
                    download={
                      selectedFlight?.operator?.certifications
                        ?.airOperatingCertificate.name
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
                    href={`data:application/pdf;base64,${selectedFlight?.operator?.certifications?.certificateOfInsurance.data}`}
                    download={
                      selectedFlight?.operator?.certifications
                        ?.certificateOfInsurance.name
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
                    href={`data:application/pdf;base64,${selectedFlight?.operator?.certifications?.certificateOfAirworthiness.data}`}
                    download={
                      selectedFlight?.operator?.certifications
                        ?.certificateOfAirworthiness.name
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
      <Flex
        justify="space-between"
        align="center"
        style={{ margin: "30px 6px 10px 6px" }}>
        <p className="font-bold">Aircraft</p>
        <p className="inline-block cursor-pointer font-bold hover:text-dark-tableHeaderBackground">
          <EyeOutlined /> View Details
        </p>
      </Flex>
      <Card
        style={{
          marginBottom: "20px",
          borderRadius: "20px",
          border: "none",
          backgroundColor: "#f0eae3",
        }}>
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
          infinite={false}>
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
          justify="center">
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
                        }}>
                        <BsAirplaneEngines
                          style={{
                            marginRight: 8,
                            fontSize: 15,
                            color: "#736764",
                          }}
                        />
                        <Text style={{ fontSize: 14, color: "#736764" }} strong>
                          Power Plant
                        </Text>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: 16,
                        }}>
                        <MdSpeed
                          style={{
                            marginRight: 8,
                            fontSize: 15,
                            color: "#736764",
                          }}
                        />
                        <Text style={{ fontSize: 14, color: "#736764" }} strong>
                          Cruise Speed kts
                        </Text>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: 16,
                        }}>
                        <GiPressureCooker
                          style={{
                            marginRight: 8,
                            fontSize: 15,
                            color: "#736764",
                          }}
                        />
                        <Text style={{ fontSize: 14, color: "#736764" }} strong>
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
                      }}>
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
                        <Text style={{ fontSize: 16, color: "#736764" }} strong>
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
                        <Text style={{ fontSize: 14, color: "#736764" }} strong>
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
                        <Text style={{ fontSize: 14, color: "#736764" }} strong>
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
                        <Text style={{ fontSize: 14, color: "#736764" }} strong>
                          Heated
                        </Text>
                      </div>
                    </div>
                  </Col>
                  <Col style={{ marginLeft: 20 }}>
                    <div style={{ marginBottom: 10 }}>
                      <Text style={{ fontSize: 16, color: "#736764" }} strong>
                        {selectedFlight?.aircraft?.hasWashCloset ? "Yes" : "No"}
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
                        <Text style={{ fontSize: 14, color: "#736764" }} strong>
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
                        <Text style={{ fontSize: 14, color: "#736764" }} strong>
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
      <Flex
        justify="space-between"
        align="center"
        style={{ margin: "30px 6px 10px 6px" }}>
        <p className="font-bold">Terms &amp; Policies</p>
      </Flex>
      <Card
        style={{
          borderRadius: "20px",
          border: "none",
          backgroundColor: "#f0eae3",
          width: "100%",
        }}>
        <Collapse
          style={{ width: "100%", fontSize: 16, backgroundColor: "#f0eae3" }}
          accordion
          bordered={false}>
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
    </main>
  );
};

export default AdminFlightDetailsComponent;
