"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Flex,
  Form,
  Input,
  Modal,
  Result,
  Row,
  Select,
} from "antd";
import { GiWorld } from "react-icons/gi";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { SiUnlicense } from "react-icons/si";

import themeColors from "@/app/(config)/colors";
import { eRoutes } from "@/app/(config)/routes";
import UnauthenticatedLayout from "@/app/(layouts)/UnauthenticatedLayout";

import { countries } from "@/lib/helpers/countries";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import {
  ICreateOperatorDto,
  createOperator,
} from "@/lib/state/operators/operators.slice";

const AppLogo = () => (
  <Image
    alt="logo"
    src="/images/logo_blue.svg"
    width={100}
    height={145}
    className="mb-8"
    style={{ width: "20rem", height: "auto" }}
  />
);

const formItemStyle = {};

const CompanyDetails = () => {
  const [company, setCompany] = useState<ICreateOperatorDto>({
    airline: "",
    email: "",
    phone: "",
    country: "",
    auditFields: {
      dateCreated: new Date(),
      createdBy: "",
      createdById: "",
    },
  });

  const [dialCode, setDialCode] = useState("--");

  const [form] = Form.useForm();

  const { createdOperator, loading } = useAppSelector(
    (state) => state.operators
  );
  const { authenticatedUser } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = (values: any[]) => {
    dispatch(createOperator(company));
  };

  useEffect(() => {
    if (authenticatedUser && authenticatedUser.displayName) {
      setCompany((prevCompany) => ({
        ...prevCompany,
        email: authenticatedUser.email,
        auditFields: {
          dateCreated: new Date(),
          createdBy: authenticatedUser.displayName,
          createdById: authenticatedUser._id!,
        },
      }));
    }
    return () => {};
  }, [authenticatedUser]);

  const success = () => {
    Modal.info({
      footer: null,
      icon: null,
      content: (
        <Result
          status="success"
          title="Welcome to Charter"
          subTitle="Congratulations on successfully setting up your Operator Profile."
          extra={[
            <Button
              type="primary"
              style={{ backgroundColor: themeColors.light.primary }}
              key="console"
              onClick={() => {
                router.replace("/operator/dashboard");
                Modal.destroyAll();
              }}
            >
              Continue to Dashboard
            </Button>,
          ]}
        />
      ),
    });
  };

  useEffect(() => {
    if (createdOperator && !loading.createRecord) {
      success();
    }
    return () => {};
  }, [createdOperator, loading.createRecord]);

  const selectedCountry = Form.useWatch("country", form);

  useEffect(() => {
    if (selectedCountry) {
      setCompany((prev) => ({ ...prev, country: selectedCountry }));
      const countryData = countries.find(
        (_country) => _country.name == selectedCountry
      );
      if (countryData) setDialCode(countryData.dialCode);
    }
    return () => {};
  }, [selectedCountry]);

  return (
    <UnauthenticatedLayout>
      <Row className="h-full">
        <Col span={9} style={{ backgroundColor: themeColors.background.login }}>
          <div
            className="flex flex-col items-center px-24 py-8"
            style={{ minHeight: "65vh" }}
          >
            <Form
              form={form}
              layout="vertical"
              name="sign-in-form"
              className="w-full self-center text-start"
              onFinish={handleSubmit}
            >
              <Link href={eRoutes.homePage}>
                <AppLogo />
              </Link>
              <h3 className="mb-2">Company Details</h3>
              <h6>Let's get your basic company profile setup</h6>
              <Divider />
              <Form.Item
                style={formItemStyle}
                label="Company Name"
                name="airline"
              >
                <Input
                  size="large"
                  type="text" // instead of "name", which is not a standard input type
                  placeholder="Company Name"
                  autoComplete="off" // instead of an empty string, which can cause issues
                  allowClear
                  value={company?.airline || ""} // add a default value to avoid undefined
                  onChange={(event) => {
                    const airline = event.target.value;
                    setCompany((prev) => ({ ...prev, airline }));
                  }}
                  prefix={
                    <HiOutlineBuildingOffice
                      style={{
                        marginRight: "0.5rem", // use a string with units for consistency
                      }}
                    />
                  }
                />
              </Form.Item>
              <Form.Item
                style={formItemStyle}
                label="Email Address"
                name="email"
              >
                <Input
                  size="large"
                  type="text" // instead of "name", which is not a standard input type
                  placeholder="Email Address"
                  autoComplete="off" // instead of an empty string, which can cause issues
                  allowClear
                  value={company?.email || ""} // add a default value to avoid undefined
                  onChange={(event) => {
                    const email = event.target.value;
                    setCompany((prev) => ({ ...prev, email }));
                  }}
                  prefix={
                    <MailOutlined
                      style={{
                        marginRight: "0.5rem", // use a string with units for consistency
                      }}
                    />
                  }
                />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    style={formItemStyle}
                    label="Country"
                    name="country"
                  >
                    <Select
                      size="large"
                      style={{
                        width: "100%",
                        background: "#ffffff",
                        borderRadius: "10px",
                      }}
                      showSearch
                    >
                      {countries.map((country, index) => (
                        <Select.Option key={index} value={country.name}>
                          <p className="flex items-center space-x-3">
                            {country && (
                              <Image
                                src={country.flag!}
                                alt={country.name!}
                                width={20}
                                height={20}
                                style={{ width: "auto" }}
                              />
                            )}
                            <span style={{ display: "block" }}>
                              {country.name}
                            </span>
                          </p>
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    style={formItemStyle}
                    label="Phone Number"
                    name="phone"
                  >
                    <Input
                      size="large"
                      type="text" // instead of "name", which is not a standard input type
                      placeholder="Phone Number"
                      autoComplete="off" // instead of an empty string, which can cause issues
                      allowClear
                      prefix={<span>{dialCode}</span>}
                      value={company?.phone || ""} // add a default value to avoid undefined
                      onChange={(event) => {
                        const phone = event.target.value;
                        setCompany((prev) => ({ ...prev, phone }));
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Flex gap={16}>
                <Button type="primary" block onClick={handleBack}>
                  BACK
                </Button>
                <Button type="primary" block htmlType="submit">
                  SUBMIT
                </Button>
              </Flex>
            </Form>
          </div>
        </Col>
        <Col span={15} className='bg-[url("/images/bg1.png")] bg-cover' />
      </Row>
    </UnauthenticatedLayout>
  );
};

export default CompanyDetails;
