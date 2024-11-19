import React from "react";

import { TeamOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";

const buttonStyle = {
  width: 120,
  height: 30,
  backgroundColor: "#736764",
  fontWeight: "bold",
  color: "white",
};

const textStyle = { fontSize: 16, color: "#736764", fontWeight: "bold" };
const inputStyle = {
  backgroundColor: "#FFFFFFBF",
  width: "100%",
  color: "#42454F",
  fontSize: "1rem",
  fontWeight: "600",
  borderRadius: "30px",
};

const BookingCard = () => {
  return (
    <div
      className="h-full w-1/2 flex-col justify-evenly space-y-2 rounded-md p-3"
      style={{ backgroundColor: "#EAE4E0" }}
    >
      <div className="flex justify-between">
        <h3 style={{ fontSize: 20, color: "#0B3746" }}>Book dead leg flight</h3>
        <div className="space-y-2">
          <p style={{ fontSize: 14, color: "#736764", fontWeight: "bold" }}>
            Total: $2000
          </p>
          <Button style={buttonStyle}>Buy</Button>
        </div>
      </div>

      <div className="flex justify-between">
        <h3 style={{ fontSize: 20, color: "#0B3746" }}>Book by Seat</h3>
        <div className="space-y-2">
          <div className="w-full flex-col items-end">
            <p style={textStyle}>Total: $640</p>
            <p style={{ ...textStyle, fontSize: 14 }}>Per Seat</p>
          </div>
          <Button style={buttonStyle}>Buy</Button>
        </div>
      </div>
      <div>
        <Input
          type="number"
          className="rounded-md"
          style={inputStyle}
          suffix={<TeamOutlined />}
          placeholder="Seats"
        />
      </div>
      <h2 className="flex justify-end" style={{ color: "#1B4351" }}>
        Total: $200
      </h2>
      <div className="flex justify-center space-x-5">
        <Button style={buttonStyle}>Cart</Button>
        <Button style={buttonStyle}>Buy</Button>
      </div>
    </div>
  );
};

export default BookingCard;
