import Image from "next/image";

import { Divider, Flex } from "antd";

import { IOperator } from "@/lib/models/IOperators";

interface IProps {
  id: string;
  operator: IOperator;
  flag: string;
}

export const OperatorBanner = ({ id, operator, flag }: IProps) => {
  // const operator = operators.find((operator: IOperator) => operator._id === id);
  return (
    <Flex
      justify="center"
      align="center"
      gap={16}
      style={{
        backgroundColor: "#EEEAE6",
        padding: "0.5rem",
        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
      }}
    >
      <p>{operator?.airline ?? "Unknown Airline"}</p>
      <Divider type="vertical" />
      <p style={{ fontWeight: 600 }}>
        {operator?.status == "Verified"
          ? "VERIFIED OPERATOR"
          : "UNVERIFIED OPERATOR"}
      </p>
      <Divider type="vertical" />
      {flag && (
        <Image alt="Destination flag" src={flag} width={36} height={36} />
      )}
    </Flex>
  );
};
