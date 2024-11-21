"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  CrownOutlined,
  EnvironmentOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Flex, Form, Input, Row, Tabs } from "antd";

import { eRoutes } from "@/app/(config)/routes";
import ClientAppBar from "@/app/components/ClientAppBar";

import { IAddress } from "@/lib/models/IAddress";
import { IUser } from "@/lib/models/IUser";
import { signOut } from "@/lib/state/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import { updateUser } from "@/lib/state/users/users.slice";

import ClientChangePassword from "../components/ClientProfile/change-password-component";

const inputStyle = { width: "100%" };

const ClientProfile = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { authenticatedUser, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const handleSignOut = () => {
    dispatch(signOut());
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(eRoutes.login);
    }
    return () => {};
  }, [isAuthenticated]);

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#E9E2DB" }}>
      <ClientAppBar styles={{ padding: "1rem 2rem" }} />
      <div className="h-full min-h-full p-12">
        <h2 style={{ fontWeight: 500 }}>Profile</h2>
        <Tabs
          type="card"
          items={[
            {
              key: "1",
              label: "Account",
              icon: <UserOutlined />,
              children: (
                <UserSection
                  authenticatedUser={authenticatedUser!}
                  handleSignOut={handleSignOut}
                />
              ),
            },
            {
              key: "2",
              label: "Address",
              icon: <EnvironmentOutlined />,
              children: (
                <AddressSection
                  authenticatedUser={authenticatedUser!}
                  handleSignOut={handleSignOut}
                />
              ),
            },
            {
              key: "3",
              label: "ChangePassword",
              icon: <EnvironmentOutlined />,
              children: <ClientChangePassword />,
            },
          ]}
        />
      </div>
    </main>
  );
};

interface IUserProps {
  authenticatedUser: IUser;
  handleSignOut: () => void;
}

const UserSection = ({ authenticatedUser, handleSignOut }: IUserProps) => {
  const [user, setUser] = useState<any>();

  useEffect(() => {
    if (authenticatedUser) {
      setUser(authenticatedUser);
    }
    return () => {};
  }, [authenticatedUser]);

  return (
    <Row className="p-2" style={{ background: "#EBE5DF", borderRadius: 16 }}>
      <Form layout="vertical" style={{ width: "35%" }}>
        <Form.Item label="First Names">
          <Input
            size="large"
            type="name"
            className="custom-field-input"
            placeholder="First Names"
            autoComplete=""
            allowClear
            defaultValue={authenticatedUser?.firstNames}
            value={user?.firstNames}
            style={inputStyle}
            onChange={(event) =>
              setUser({ ...user, firstNames: event.target.value })
            }
            prefix={<UserOutlined style={{ marginRight: ".5rem" }} />}
          />
        </Form.Item>
        <Form.Item label="Last Name">
          <Input
            size="large"
            type="name"
            className="custom-field-input"
            placeholder="Last Name"
            autoComplete=""
            defaultValue={authenticatedUser?.lastName}
            value={user?.lastName}
            style={inputStyle}
            onChange={(event) =>
              setUser({ ...user, lastName: event.target.value })
            }
            prefix={<UserOutlined style={{ marginRight: ".5rem" }} />}
          />
        </Form.Item>
        <Form.Item label="Email Address">
          <Input
            size="large"
            type="email"
            className="custom-field-input"
            placeholder="Email Address"
            autoComplete=""
            value={user?.email}
            disabled
            defaultValue={authenticatedUser?.email}
            style={inputStyle}
            prefix={<MailOutlined style={{ marginRight: ".5rem" }} />}
          />
        </Form.Item>
        <Form.Item label="User Type">
          <Input
            size="large"
            autoComplete=""
            disabled
            className="custom-field-input"
            value={user?.role}
            style={inputStyle}
            prefix={<CrownOutlined style={{ marginRight: ".5rem" }} />}
          />
        </Form.Item>
        <Flex gap={16}>
          <Button style={{ width: "8rem" }} type="primary">
            SAVE CHANGES
          </Button>
          <Button
            style={{ width: "8rem" }}
            type="primary"
            danger
            onClick={handleSignOut}
          >
            SIGN OUT
          </Button>
        </Flex>
      </Form>
    </Row>
  );
};

interface IAddressProps {
  authenticatedUser: IUser;
  handleSignOut: () => void;
}

const AddressSection = ({
  authenticatedUser,
  handleSignOut,
}: IAddressProps) => {
  const [address, setAddress] = useState<IAddress>(authenticatedUser.address!);

  const dispatch = useAppDispatch();

  const handleSave = () => {
    // Save the address to the database
    if (address.street && address.city && address.state && address.country) {
      const payload = { address };
      dispatch(
        updateUser({
          id: authenticatedUser._id!,
          payload,
        })
      );
    }
  };

  return (
    <Row className="p-2" style={{ borderRadius: 16 }}>
      <Form layout="vertical" style={{ width: "35%" }}>
        <Form.Item label="Street Address">
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
        <Form.Item label="City">
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
        <Form.Item label="State / Province">
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
        <Form.Item label="Country">
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
        <Form.Item label="Postal Code">
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
        <Flex gap={16}>
          <Button style={{ width: "8rem" }} type="primary" onClick={handleSave}>
            SAVE CHANGES
          </Button>
          <Button
            style={{ width: "8rem" }}
            type="primary"
            danger
            onClick={handleSignOut}
          >
            SIGN OUT
          </Button>
        </Flex>
      </Form>
    </Row>
  );
};

export default ClientProfile;
