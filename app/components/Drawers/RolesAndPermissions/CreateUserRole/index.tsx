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
  Space,
  Spin,
  notification,
} from "antd";

import { IRolePermission } from "@/lib/models/role.model";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import { create, resetActionStates } from "@/lib/state/roles/roles.slice";

interface Props {
  open: boolean;
  onClose: () => void;
}

const formItemStyle: CSSProperties = {
  width: "100%",
};

const cardStyles = { body: { padding: ".5rem 1rem" } };

const initialValues = {
  name: undefined,
  "permission.assets.create": false,
  "permission.assets.delete": false,
  "permission.assets.read": false,
  "permission.assets.update": false,
  "permission.flights.create": false,
  "permission.flights.delete": false,
  "permission.flights.read": false,
  "permission.flights.update": false,
  "permission.invoices.create": false,
  "permission.invoices.delete": false,
  "permission.invoices.read": false,
  "permission.invoices.update": false,
  "permission.operators.create": false,
  "permission.operators.delete": false,
  "permission.operators.read": false,
  "permission.operators.update": false,
  "permission.quotations.create": false,
  "permission.quotations.delete": false,
  "permission.quotations.read": false,
  "permission.quotations.update": false,
  "permission.roles.create": false,
  "permission.roles.delete": false,
  "permission.roles.read": false,
  "permission.roles.update": false,
  "permission.teamMembers.create": false,
  "permission.teamMembers.delete": false,
  "permission.teamMembers.read": false,
  "permission.teamMembers.update": false,
  "permission.users.create": false,
  "permission.users.delete": false,
  "permission.users.read": false,
  "permission.users.update": false,
};

function transformValues(values: any, organisationId: string) {
  const rolePermission: IRolePermission = {
    name: values.name || "Default", // Assign a default name if undefined
    modules: [],
    organisation: organisationId,
  };

  const permissionEntries = Object.entries(values).filter(([key]) =>
    key.startsWith("permission.")
  );

  const permissionMap: any = {};

  permissionEntries.forEach(([key, value]) => {
    const [_, module, action] = key.split("."); // Split into module and action
    if (!permissionMap[module]) {
      permissionMap[module] = { name: module, permissions: [] };
    }
    // permissionMap[module][action] = value
    if (value == true) {
      permissionMap[module].permissions.push(action);
    }
  });

  // Convert the permissionMap into the permissions array
  rolePermission.modules = Object.values(permissionMap);

  // Remove modules that have empty permissions array
  rolePermission.modules = rolePermission.modules.filter(
    (module) => module.permissions.length > 0
  );

  return rolePermission;
}

const CreateUserRole: React.FC<Props> = ({ open, onClose }) => {
  const [form] = Form.useForm();

  const dispatch = useAppDispatch();

  const { authenticatedUser } = useAppSelector((state) => state.auth);
  const { loading, error, success } = useAppSelector((state) => state.roles);

  const closeDrawer = () => {
    form.resetFields();
    onClose();
  };

  const handleRoleSubmit = (values: any) => {
    const payload = transformValues(
      values,
      authenticatedUser?.operatorId ?? "Administrator"
    );
    dispatch(create(payload));
  };

  useEffect(() => {
    if (loading.createRecord == false) {
      if (success.createRecord == true) {
        form.resetFields();
        dispatch(resetActionStates());
        notification.success({
          message: "Role created successfully",
        });
        onClose();
      }
    }
    return () => {};
  }, [
    loading.createRecord,
    success.createRecord,
    error.createRecord,
    dispatch,
  ]);

  return (
    <Drawer
      title="Add Role"
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
          initialValues={initialValues}
          layout="vertical"
          onFinish={handleRoleSubmit}
        >
          <Form.Item
            label="Role Name"
            name="name"
            style={formItemStyle}
            rules={[
              {
                required: true,
                message: "Please provide a name for this role",
              },
            ]}
          >
            <Input placeholder="Assistant" />
          </Form.Item>
          <Form.Item label="Permissions" style={formItemStyle}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Card styles={cardStyles}>
                <Flex justify="space-between" align="center">
                  <p className="font-medium">Operators</p>
                  <Space>
                    <Form.Item
                      noStyle
                      valuePropName="checked"
                      name="permission.operators.create"
                    >
                      <Checkbox>Create</Checkbox>
                    </Form.Item>
                    <Form.Item
                      noStyle
                      valuePropName="checked"
                      name="permission.operators.read"
                    >
                      <Checkbox>Read</Checkbox>
                    </Form.Item>
                    <Form.Item
                      noStyle
                      valuePropName="checked"
                      name="permission.operators.update"
                    >
                      <Checkbox>Update</Checkbox>
                    </Form.Item>
                    {/* <Form.Item noStyle valuePropName='checked' name='permission.operators.delete'>
											<Checkbox>Delete</Checkbox>
										</Form.Item> */}
                  </Space>
                </Flex>
              </Card>
              <Card styles={cardStyles}>
                <Flex justify="space-between" align="center">
                  <p className="font-medium">Assets</p>
                  <Space>
                    <Form.Item
                      noStyle
                      valuePropName="checked"
                      name="permission.assets.create"
                    >
                      <Checkbox>Create</Checkbox>
                    </Form.Item>
                    <Form.Item
                      noStyle
                      valuePropName="checked"
                      name="permission.assets.read"
                    >
                      <Checkbox>Read</Checkbox>
                    </Form.Item>
                    <Form.Item
                      noStyle
                      valuePropName="checked"
                      name="permission.assets.update"
                    >
                      <Checkbox>Update</Checkbox>
                    </Form.Item>
                    {/* <Form.Item noStyle valuePropName='checked' name='permission.assets.delete'>
											<Checkbox>Delete</Checkbox>
										</Form.Item> */}
                  </Space>
                </Flex>
              </Card>
              <Card styles={cardStyles}>
                <Flex justify="space-between" align="center">
                  <p className="font-medium">Flights</p>
                  <Space>
                    <Form.Item
                      noStyle
                      valuePropName="checked"
                      name="permission.flights.create"
                    >
                      <Checkbox>Create</Checkbox>
                    </Form.Item>
                    <Form.Item
                      noStyle
                      valuePropName="checked"
                      name="permission.flights.read"
                    >
                      <Checkbox>Read</Checkbox>
                    </Form.Item>
                    <Form.Item
                      noStyle
                      valuePropName="checked"
                      name="permission.flights.update"
                    >
                      <Checkbox>Update</Checkbox>
                    </Form.Item>
                    {/* <Form.Item noStyle valuePropName='checked' name='permission.flights.delete'>
											<Checkbox>Delete</Checkbox>
										</Form.Item> */}
                  </Space>
                </Flex>
              </Card>
              <Card styles={cardStyles}>
                <Flex justify="space-between" align="center">
                  <p className="font-medium">Quotations</p>
                  <Space>
                    <Form.Item
                      noStyle
                      valuePropName="checked"
                      name="permission.quotations.create"
                    >
                      <Checkbox>Create</Checkbox>
                    </Form.Item>
                    <Form.Item
                      noStyle
                      valuePropName="checked"
                      name="permission.quotations.read"
                    >
                      <Checkbox>Read</Checkbox>
                    </Form.Item>
                    <Form.Item
                      noStyle
                      valuePropName="checked"
                      name="permission.quotations.update"
                    >
                      <Checkbox>Update</Checkbox>
                    </Form.Item>
                    {/* <Form.Item noStyle valuePropName='checked' name='permission.quotations.delete'>
											<Checkbox>Delete</Checkbox>
										</Form.Item> */}
                  </Space>
                </Flex>
              </Card>
              <Card styles={cardStyles}>
                <Flex justify="space-between" align="center">
                  <p className="font-medium">Invoices</p>
                  <Space>
                    <Form.Item
                      noStyle
                      valuePropName="checked"
                      name="permission.invoices.create"
                    >
                      <Checkbox>Create</Checkbox>
                    </Form.Item>
                    <Form.Item
                      noStyle
                      valuePropName="checked"
                      name="permission.invoices.read"
                    >
                      <Checkbox>Read</Checkbox>
                    </Form.Item>
                    <Form.Item
                      noStyle
                      valuePropName="checked"
                      name="permission.invoices.update"
                    >
                      <Checkbox>Update</Checkbox>
                    </Form.Item>
                    {/* <Form.Item noStyle valuePropName='checked' name='permission.invoices.delete'>
											<Checkbox>Delete</Checkbox>
										</Form.Item> */}
                  </Space>
                </Flex>
              </Card>
              <Card styles={cardStyles}>
                <Flex justify="space-between" align="center">
                  <p className="font-medium">Users</p>
                  <Space>
                    <Form.Item
                      noStyle
                      valuePropName="checked"
                      name="permission.users.create"
                    >
                      <Checkbox>Create</Checkbox>
                    </Form.Item>
                    <Form.Item
                      noStyle
                      valuePropName="checked"
                      name="permission.users.read"
                    >
                      <Checkbox>Read</Checkbox>
                    </Form.Item>
                    <Form.Item
                      noStyle
                      valuePropName="checked"
                      name="permission.users.update"
                    >
                      <Checkbox>Update</Checkbox>
                    </Form.Item>
                    {/* <Form.Item noStyle valuePropName='checked' name='permission.users.delete'>
											<Checkbox>Delete</Checkbox>
										</Form.Item> */}
                  </Space>
                </Flex>
              </Card>
              <Card styles={cardStyles}>
                <Flex justify="space-between" align="center">
                  <p className="font-medium">Roles</p>
                  <Space>
                    <Form.Item
                      noStyle
                      valuePropName="checked"
                      name="permission.roles.create"
                    >
                      <Checkbox>Create</Checkbox>
                    </Form.Item>
                    <Form.Item
                      noStyle
                      valuePropName="checked"
                      name="permission.roles.read"
                    >
                      <Checkbox>Read</Checkbox>
                    </Form.Item>
                    <Form.Item
                      noStyle
                      valuePropName="checked"
                      name="permission.roles.update"
                    >
                      <Checkbox>Update</Checkbox>
                    </Form.Item>
                    {/* <Form.Item noStyle valuePropName='checked' name='permission.roles.delete'>
											<Checkbox>Delete</Checkbox>
										</Form.Item> */}
                  </Space>
                </Flex>
              </Card>
              <Card styles={cardStyles}>
                <Flex justify="space-between" align="center">
                  <p className="font-medium">Team Members</p>
                  <Space>
                    <Form.Item
                      noStyle
                      valuePropName="checked"
                      name="permission.teamMembers.create"
                    >
                      <Checkbox>Create</Checkbox>
                    </Form.Item>
                    <Form.Item
                      noStyle
                      valuePropName="checked"
                      name="permission.teamMembers.read"
                    >
                      <Checkbox>Read</Checkbox>
                    </Form.Item>
                    <Form.Item
                      noStyle
                      valuePropName="checked"
                      name="permission.teamMembers.update"
                    >
                      <Checkbox>Update</Checkbox>
                    </Form.Item>
                    {/* <Form.Item noStyle valuePropName='checked' name='permission.teamMembers.delete'>
											<Checkbox>Delete</Checkbox>
										</Form.Item> */}
                  </Space>
                </Flex>
              </Card>
            </Space>
          </Form.Item>
        </Form>
      </Spin>
    </Drawer>
  );
};

export default CreateUserRole;
