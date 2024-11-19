"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import {
  ArrowLeftOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
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
  Empty,
  Flex,
  Form,
  Image,
  Input,
  Modal,
  Rate,
  Row,
  Select,
  Space,
  Table,
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
import ClientAppBar from "@/app/components/ClientAppBar";

import {
  formatToMoneyWithCurrency,
  formatUCTtoISO,
} from "@/lib/helpers/formatters.helpers";
import { IBooking } from "@/lib/models/IBooking";
import { IOperator } from "@/lib/models/IOperators";
import { IFlight } from "@/lib/models/flight.model";
import { IPerson } from "@/lib/models/person.model";
import {
  getBookingById,
  reset,
  update,
} from "@/lib/state/bookings/bookings.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";

import PassengerList from "../components/Drawers/BookingDetailsDrawer/PassengerList";

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

const BookingDetails = ({ closeDrawer }: { closeDrawer: () => void }) => {
  const dispatch = useAppDispatch();
  const { authenticatedUser } = useAppSelector((state) => state.auth);
  const { redirect, selectedBooking } = useAppSelector(
    (state) => state.bookings
  );

  const [selectedFlight, setSelectedFlight] = useState<IFlight>();
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalFlightPrice, setTotalFlightPrice] = useState(0);
  const [purchaseAmount, setPurchaseAmount] = useState(0);
  const [passengers, setPassengers] = useState<IPerson[]>([]);

  const router = useRouter();
  const pathname = usePathname();

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

  const addPassengerDetails = () => {
    // Function to add a new passenger (you can expand this with a form/modal)
    setPassengers([
      ...passengers,
      {
        firstNames: "",
        lastName: "",
        gender: "male",
      },
    ]);
  };

  const data = passengers.map((passenger, index) => ({
    key: index,
    firstName: passenger.firstNames || "N/A",
    lastName: passenger.lastName || "N/A",
  }));

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

  return <main></main>;
};

export default BookingDetails;
