import React, { useEffect, useState } from "react";

import {
  Button,
  Checkbox,
  Col,
  Drawer,
  Form,
  Input,
  List,
  Row,
  Space,
} from "antd";
import { useForm } from "antd/es/form/Form";

import { IRolePermission } from "@/lib/models";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import { create } from "@/lib/state/slices/role-permission.slice";

interface PermissionProps {
  open: boolean;
  onClose: () => void;
}

const formItemStyle = { width: "100%" };

const { TextArea } = Input;

const CreatePermission = ({ open, onClose }: PermissionProps) => {
  const [form] = useForm();
  const [modules, setModules] = useState<any[]>([]);

  const { appModules, loading, success, error } = useAppSelector(
    (state) => state.rolePermissionState
  );
  const { currentOperator } = useAppSelector((state) => state.operators);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (appModules) {
      const modules = appModules.map((module) => ({
        key: module,
        module: module,
        manage: false,
        create: false,
        read: false,
        update: false,
        delete: false,
      }));

      setModules(modules);
    }
    return () => {};
  }, [appModules]);

  const handleChange = (
    index: number,
    action: string,
    value: boolean = false
  ) => {
    const newModules = [...modules];
    newModules[index][action] = value;
    setModules(newModules);
  };

  const submitRole = (values: any) => {
    const payload: IRolePermission = {
      ...values,
      modules,
      organisation: currentOperator?._id,
    };
    dispatch(create(payload));
  };

  return (
    <>
      <Drawer
        closable
        destroyOnClose
        title={<p>Add Role & Permission</p>}
        placement="right"
        open={open}
        onClose={onClose}
        width={860}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              type="primary"
              loading={loading.createRecord}
              onClick={() => form.submit()}
            >
              Create
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" onFinish={submitRole}>
          <Form.Item
            name="name"
            label="Name"
            style={formItemStyle}
            rules={[
              {
                required: true,
                message: "Please enter a name for the new role",
              },
            ]}
          >
            <Input placeholder="Enter name for this permission" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            style={formItemStyle}
            rules={[
              {
                required: true,
                message: "Please enter a description for the new role",
              },
            ]}
          >
            <TextArea placeholder="Role Description" rows={4} />
          </Form.Item>
          <List
            bordered
            dataSource={modules}
            header={
              <Row className="w-full px-0 font-normal text-white">
                <Col span={9}>Module</Col>
                <Col
                  span={3}
                  className="w-full px-4 text-center"
                  style={{ borderLeft: "1px solid #ffffff" }}
                >
                  Manage
                </Col>
                <Col
                  span={3}
                  className="w-full px-4 text-center"
                  style={{ borderLeft: "1px solid #ffffff" }}
                >
                  Create
                </Col>
                <Col
                  span={3}
                  className="w-full px-4 text-center"
                  style={{ borderLeft: "1px solid #ffffff" }}
                >
                  View
                </Col>
                <Col
                  span={3}
                  className="w-full px-4 text-center"
                  style={{ borderLeft: "1px solid #ffffff" }}
                >
                  Edit
                </Col>
                <Col
                  span={3}
                  className="w-full px-4 text-center"
                  style={{ borderLeft: "1px solid #ffffff" }}
                >
                  Delete
                </Col>
              </Row>
            }
            renderItem={(item, index) => (
              <List.Item key={index}>
                <Row className="w-full px-0">
                  <Col span={9} className="w-full">
                    {item.module}
                  </Col>
                  <Col span={3} className="w-full px-4 text-center">
                    <Checkbox
                      onChange={(e) =>
                        handleChange(index, "manage", e.target.checked)
                      }
                    />
                  </Col>
                  <Col span={3} className="w-full px-4 text-center">
                    <Checkbox
                      onChange={(e) =>
                        handleChange(index, "create", e.target.checked)
                      }
                    />
                  </Col>
                  <Col span={3} className="w-full px-4 text-center">
                    <Checkbox
                      onChange={(e) =>
                        handleChange(index, "read", e.target.checked)
                      }
                    />
                  </Col>
                  <Col span={3} className="w-full px-4 text-center">
                    <Checkbox
                      onChange={(e) =>
                        handleChange(index, "update", e.target.checked)
                      }
                    />
                  </Col>
                  <Col span={3} className="w-full px-4 text-center">
                    <Checkbox
                      onChange={(e) =>
                        handleChange(index, "delete", e.target.checked)
                      }
                    />
                  </Col>
                </Row>
              </List.Item>
            )}
          />
        </Form>
      </Drawer>
    </>
  );
};

export default CreatePermission;
