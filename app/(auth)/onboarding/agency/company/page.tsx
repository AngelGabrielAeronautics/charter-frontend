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
  Space,
} from "antd";
import { GiWorld } from "react-icons/gi";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { SiUnlicense } from "react-icons/si";

import themeColors from "@/app/(config)/colors";
import { eRoutes } from "@/app/(config)/routes";
import UnauthenticatedLayout from "@/app/(layouts)/UnauthenticatedLayout";

import { countries } from "@/lib/helpers/countries";
import { IAgency } from "@/lib/models";
import { create } from "@/lib/state/agency/slice";
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

const AgencyCompanyDetails = () => {
  const [form] = Form.useForm();

  const { loading, success } = useAppSelector((state) => state.agency);
  const { authenticatedUser } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    if (authenticatedUser && authenticatedUser.displayName) {
      form.setFieldsValue({
        email: authenticatedUser.email,
        country: authenticatedUser.country,
      });
    }
    return () => {};
  }, [authenticatedUser]);

  useEffect(() => {
    if (success.createRecord && !loading.createRecord) {
      Modal.info({
        footer: null,
        icon: null,
        content: (
          <Result
            status="success"
            title="Welcome to Charter"
            subTitle="Congratulations on successfully setting up your Agency Profile."
            extra={[
              <Button
                type="primary"
                style={{ backgroundColor: themeColors.light.primary }}
                key="console"
                onClick={() => {
                  router.replace("/agency/dashboard");
                  Modal.destroyAll();
                }}
              >
                Continue to Dashboard
              </Button>,
            ]}
          />
        ),
      });
    }
    return () => {};
  }, [success.createRecord, loading.createRecord]);

  // const selectedCountry = Form.useWatch("country", form)

  const [selectedCountry, setSelectedCountry] = useState<string>();
  const [selectedDialCode, setSelectedDialCode] = useState<string>();

  useEffect(() => {
    if (selectedCountry) {
      const country = countries.find(
        (country) => country.name === selectedCountry
      );
      if (country) {
        form.setFieldsValue({
          dialCode: country.dialCode,
        });
        setSelectedDialCode(country.dialCode);
      }
    }
  }, [selectedCountry]);

  const countryOptions = countries.map((country) => ({
    value: country.name,
    label: country.name,
    flag: country.flag,
  }));

  const handleSubmit = (values: any) => {
    const payload = {
      name: values.name,
      userId: `${authenticatedUser?._id!}`,
      email: values.email,
      country: values.country,
      phone: values.phone,
      dialCode: selectedDialCode ?? "--",
      auditFields: {
        dateCreated: new Date(),
        createdBy: `${authenticatedUser?.displayName}`,
        createdById: `${authenticatedUser?._id!}`,
      },
    };
    dispatch(create(payload));
  };

  return (
    <UnauthenticatedLayout>
      <Row className="h-full">
        <Col span={9} style={{ backgroundColor: themeColors.background.login }}>
          <div
            className="flex flex-col items-center px-24 py-8"
            style={{ minHeight: "65vh" }}
          >
            <Form
              layout="vertical"
              name="agency-details-form"
              onFinish={handleSubmit}
              className="w-full self-center text-start"
            >
              <Link href={eRoutes.homePage}>
                <AppLogo />
              </Link>
              <h3 className="mb-2">Agency Details</h3>
              <h6>Let's get your basic agency profile setup</h6>
              <Divider />
              <Form.Item name="name" style={formItemStyle} label="Agency Name">
                <Input
                  size="large"
                  type="text" // instead of "name", which is not a standard input type
                  placeholder="Agency"
                  autoComplete="off" // instead of an empty string, which can cause issues
                  allowClear
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
                name="email"
                style={formItemStyle}
                label="Email Address"
              >
                <Input
                  size="large"
                  type="text" // instead of "name", which is not a standard input type
                  placeholder="Email Address"
                  autoComplete="off" // instead of an empty string, which can cause issues
                  allowClear
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
                    name="country"
                    label="Country"
                    required
                    rules={[{ required: true, message: "Country is required" }]}
                  >
                    <Select
                      style={{
                        width: "100%",
                        backgroundColor: "white",
                        borderRadius: 8,
                      }}
                      showSearch
                      allowClear
                      onChange={(value) => {
                        setSelectedCountry(value);
                        const dialCode = countries.find(
                          (country) => country.name === value
                        )?.dialCode;
                        setSelectedDialCode(dialCode);
                      }}
                      options={countryOptions}
                      optionRender={(option) => (
                        <Space>
                          <span role="img" aria-label={option.data.label}>
                            <Image
                              src={option.data.flag ?? ""}
                              alt={option.data.label ?? ""}
                              width={20}
                              height={20}
                            />
                          </span>
                          {option.data.label}
                        </Space>
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="phone"
                    label="Phone Number"
                    required
                    rules={[
                      { required: true, message: "Phone number is required" },
                    ]}
                  >
                    <Input
                      type="text"
                      style={{
                        backgroundColor: "white",
                        borderRadius: 8,
                        border: "none",
                      }}
                      prefix={<span>{selectedDialCode ?? "--"}</span>}
                      allowClear
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

export default AgencyCompanyDetails;
