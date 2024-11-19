"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  LockOutlined,
  MailOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Flex,
  Form,
  Input,
  Row,
} from "antd";
import { BiSolidPlane } from "react-icons/bi";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { MdOutlineAirlineSeatReclineExtra } from "react-icons/md";

import themeColors from "@/app/(config)/colors";
import { APP_NAME } from "@/app/(config)/constants";
import { eRoutes } from "@/app/(config)/routes";
import UnauthenticatedLayout from "@/app/(layouts)/UnauthenticatedLayout";
import { PageHeader } from "@/app/components";
import { AppLogo } from "@/app/components/CustomIcon";

import { setRole } from "@/lib/state/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import { updateUser } from "@/lib/state/users/users.slice";

const RoleSelection = () => {
  const router = useRouter();

  const { authenticatedUser } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleSelect = (
    userType:
      | "Client"
      | "Operator"
      | "Agency"
      | "Administrator"
      | "Super User"
      | undefined
  ) => {
    if (authenticatedUser && authenticatedUser._id) {
      const payload = { role: userType };
      dispatch(setRole(userType));
      dispatch(
        updateUser({
          id: authenticatedUser._id,
          payload,
        })
      );

      if (userType == "Client") {
        router.push(eRoutes.clientFlights);
      }

      if (userType == "Agency") {
        if (authenticatedUser.agencyId) {
          router.push(eRoutes.agencyDashboard);
        } else {
          router.push(eRoutes.agencyOnboarding);
        }
      }

      if (userType == "Operator") {
        if (authenticatedUser.operatorId) {
          router.push(eRoutes.operatorDashboard);
        } else {
          router.push(eRoutes.operatorOnboarding);
        }
      }
    }
  };

  return (
    <UnauthenticatedLayout>
      <Row className="h-full">
        <Col span={9} style={{ backgroundColor: themeColors.background.login }}>
          <div
            className="flex flex-col items-start px-24 py-8"
            style={{ minHeight: "65vh" }}
          >
            <Link href={eRoutes.homePage}>
              <AppLogo />
            </Link>
            <Form
              layout="vertical"
              name="sign-in-form"
              className="w-full self-center text-start"
            >
              <h2 className="mb-2">{`How will you be using ${APP_NAME}?`}</h2>
              <p>{`Select a user type based on how you intend to use ${APP_NAME}`}</p>
              <Divider />
              <Flex vertical gap={12} className="mb-4">
                <RoleCard
                  title="Passenger"
                  description="Browse available flights, search for flights, as well as request quotations on flights"
                  setSelection={() => handleSelect("Client")}
                  icon={
                    <MdOutlineAirlineSeatReclineExtra
                      color={themeColors.light.primary}
                      style={{ fontSize: "2.5rem", padding: ".25rem" }}
                    />
                  }
                />
                <RoleCard
                  title="Travel Agency"
                  description="Manage multiple clients flight searches, quotes and bookings in one place"
                  setSelection={() => handleSelect("Agency")}
                  icon={
                    <HiBuildingOffice2
                      color={themeColors.light.primary}
                      style={{ fontSize: "2.5rem", padding: ".25rem" }}
                    />
                  }
                />
                <RoleCard
                  title="Aircraft Operator"
                  description={`Join the ${APP_NAME} marketplace. Register your fleet of aircraft to receive quotation requests specific to your area of operations, market your dead legs to an extensive audience, and manage bookings all for FREE and with no hidden costs.`}
                  setSelection={() => handleSelect("Operator")}
                  icon={
                    <BiSolidPlane
                      color={themeColors.light.primary}
                      style={{ fontSize: "2.5rem", padding: ".25rem" }}
                    />
                  }
                />
              </Flex>
            </Form>
          </div>
        </Col>
        <Col span={15} className='bg-[url("/images/bg1.png")] bg-cover' />
      </Row>
    </UnauthenticatedLayout>
  );
};

interface IRoleCard {
  title: string;
  description: string;
  setSelection: (role: string) => void;
  icon: React.ReactElement;
}

const RoleCard = ({ title, description, setSelection, icon }: IRoleCard) => {
  const handleClick = () => {
    setSelection(title);
  };

  return (
    <Card
      styles={{ body: { padding: ".25rem .75rem", cursor: "pointer" } }}
      style={{ borderColor: themeColors.cardBorder }}
      onClick={handleClick}
    >
      <Flex justify="space-between" align="center">
        {icon}
        <div style={{ width: "100%", marginLeft: ".75rem" }}>
          <p>
            <span style={{ fontWeight: "500" }}>{title}</span>
            <br />
            {description}
          </p>
        </div>
      </Flex>
    </Card>
  );
};

export default RoleSelection;
