import React, { CSSProperties, useEffect } from "react";

import { LoadingOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Divider,
  Drawer,
  Flex,
  Form,
  Input,
  Select,
  Space,
  Spin,
  notification,
} from "antd";

import { IUser } from "@/lib/models/IUser";
import { IRolePermission } from "@/lib/models/role.model";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import { create, resetActionStates } from "@/lib/state/roles/roles.slice";
import { addTeamMember, createUser } from "@/lib/state/users/users.slice";

interface Props {
  open: boolean;
  onClose: () => void;
}

const formItemStyle: CSSProperties = {
  width: "100%",
};

const cardStyles = { body: { padding: ".5rem 1rem" } };

const CreateUserDrawer = ({ open, onClose }: Props) => {
  const [form] = Form.useForm();

  const dispatch = useAppDispatch();

  const { authenticatedUser } = useAppSelector((state) => state.auth);
  const { records } = useAppSelector((state) => state.rolePermissionState);
  const { loading, error, success } = useAppSelector((state) => state.users);

  const closeDrawer = () => {
    form.resetFields();
    onClose();
  };

  const handleSubmit = (values: any) => {
    const { rolePermission, ...rest } = values;
    const payload: IUser = {
      ...rest,
      role: authenticatedUser?.role,
      displayName: `${values.firstNames} ${values.lastName}`,
      rolePermissions: [rolePermission],
    };

    if (authenticatedUser?.role === "Operator")
      payload.operatorId = authenticatedUser?.operatorId;
    if (authenticatedUser?.role === "Agency")
      payload.agencyId = authenticatedUser?.agencyId;

    dispatch(addTeamMember(payload));
  };

  useEffect(() => {
    if (loading.createRecord == false) {
      if (success.createRecord == true) {
        form.resetFields();
        dispatch(resetActionStates());
        // notification.success({
        // 	message: "User invited successfully",
        // })
        onClose();
      }
    }
    return () => {};
  }, [loading.createRecord, success.createRecord, dispatch]);

  return (
    <Drawer
      title="Invite Team Member"
      width={600}
      closable={true}
      destroyOnClose
      onClose={closeDrawer}
      open={open}
      extra={[
        <Space>
          <Button onClick={closeDrawer}>Cancel</Button>
          <Button
            onClick={() => {
              form.submit();
            }}
            type="primary"
            loading={loading.createRecord}
          >
            Submit
          </Button>
        </Space>,
      ]}
      style={{ backgroundColor: "#f7f2ed" }}
    >
      {error.createRecord && (
        <>
          <Alert
            type="error"
            showIcon
            message={error.createRecord}
            style={{ marginBottom: "1rem" }}
          />
          <Divider />
        </>
      )}
      <Spin
        tip="Loading"
        spinning={loading.createRecord}
        indicator={<LoadingOutlined />}
      >
        <Form
          form={form}
          clearOnDestroy
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="First Names"
            name="firstNames"
            style={formItemStyle}
            rules={[
              {
                required: true,
                message: "Please provide the user's first names",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
            style={formItemStyle}
            rules={[
              {
                required: true,
                message: "Please provide the user's last name",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            style={formItemStyle}
            rules={[
              {
                required: true,
                message: "Please provide the user's email address",
              },
            ]}
          >
            <Input />
          </Form.Item>
          {/* <Form.Item
						label='Phone'
						name='phoneNumber'
						style={formItemStyle}
						rules={[{ required: true, message: "Please provide the user's phone number" }]}>
						<Input />
					</Form.Item> */}
          <Form.Item
            label="Role Permission"
            name="rolePermission"
            style={formItemStyle}
            rules={[
              { required: true, message: "Please select a role for this user" },
            ]}
          >
            <Select style={{ background: "#ffffff", borderRadius: "8px" }}>
              {records.map((role) => (
                <Select.Option key={role._id} value={role._id}>
                  {role.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Spin>
    </Drawer>
  );
};

export default CreateUserDrawer;
