import Image from "next/image";
import React from "react";

import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  InfoCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";

import planeImage from "@/public/takeOff.svg";

interface IProps {
  // departureImageUrl: string;
  // departureDestination: string;
  // arrivalDestination: string;
  // departureTime: string;
  // arrivalTime: string;
  // flightDate: string;
  // petsAllowed: boolean;
  // seatsAvailable: number;
}

const FlightCard = (data: IProps) => {
  return (
    <div
      className="w-1/2 rounded-md p-3"
      style={{ backgroundColor: "#EAE4E0" }}
    >
      <div
        className="relative"
        style={{ height: 125, backgroundColor: "yellow" }}
      >
        <Image
          src="https://images.unsplash.com/photo-1552596159-39a4fc1a4f60?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          layout="fill"
          alt="Picture of the author"
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            objectFit: "cover",
          }}
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <p
            className="text-center font-bold text-white"
            style={{ fontSize: "24px" }}
          >
            {/* ${data.departureDestination} - ${data.arrivalDestination} */}
          </p>
        </div>
      </div>

      {/* small details section */}
      <div
        className="flex justify-between px-2 py-1"
        style={{ backgroundColor: "#D9D3CD", height: 30 }}
      >
        <p className="text-xs">29 July 2024, Monday</p>
        <div className="flex space-x-1 text-xs">
          <Image src={planeImage} alt="image icon" style={{ width: 20 }} />
          <p className="text-xs">Departure 10h30 local</p>
        </div>

        <p>1h 0m</p>
        <div className="flex space-x-1 text-xs">
          <Image src={planeImage} alt="image icon" style={{ width: 20 }} />
          <p className="text-xs">Arrival 10h30 local</p>
        </div>
      </div>
      {/* large destination and departure */}
      <div
        className="flex justify-around"
        style={{ height: 70, backgroundColor: "#F1E9E1" }}
      >
        <div className="">
          <h3>JHB</h3>
          <p>Johannesburg</p>
        </div>
        <ArrowRightOutlined size={30} />
        <div>
          <h3>JHB</h3>
          <p>Johannesburg</p>
        </div>
      </div>
      {/* small details section */}
      <div
        className="flex justify-between px-2 py-1"
        style={{ backgroundColor: "#D9D3CD", height: 30 }}
      >
        <div className="flex items-center space-x-1 text-xs">
          <UserOutlined />
          <p className="text-xs">8 max</p>
        </div>
        <p className="text-xs">29 July 2024, Monday</p>
        <div className="flex items-center space-x-1 text-xs">
          <InfoCircleOutlined />
          <p className="text-xs">Pets Allowed</p>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
