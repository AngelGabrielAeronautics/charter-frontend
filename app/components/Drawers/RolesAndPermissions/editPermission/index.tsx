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
import {
  setSelectedRecord,
  update,
} from "@/lib/state/slices/role-permission.slice";

interface PermissionProps {
  open: boolean;
  onClose: () => void;
}

const formItemStyle = { width: "100%" };

const { TextArea } = Input;

const EditPermission = ({ open, onClose }: PermissionProps) => {
  const [form] = useForm();
  const [modules, setModules] = useState<any[]>([]);

  const { appModules, selectedRecord, loading, success, error } =
    useAppSelector((state) => state.rolePermissionState);
  const { currentOperator } = useAppSelector((state) => state.operators);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (appModules && selectedRecord) {
      const selectedModules = selectedRecord.modules;
      form.setFieldValue("name", selectedRecord.name);
      form.setFieldValue("description", selectedRecord.description);

      const modules = appModules.map((module) => {
        const currentModule = selectedModules.find(
          (item) => item.module == module
        );

        return {
          key: module,
          module: module,
          manage: currentModule?.manage ?? false,
          create: currentModule?.create ?? false,
          read: currentModule?.read ?? false,
          update: currentModule?.update ?? false,
          delete: currentModule?.delete ?? false,
        };
      });

      setModules(modules);
    }
    return () => {};
  }, [appModules, selectedRecord, form]);

  const handleChange = (
    index: number,
    action: string,
    value: boolean = false
  ) => {
    const newModules = [...modules];
    newModules[index][action] = value;
    setModules(newModules);
  };

  const handleUpdateRecord = (values: any) => {
    const payload: IRolePermission = {
      ...values,
      modules,
      organisation: currentOperator?._id,
    };
    dispatch(update({ id: selectedRecord?._id!, payload }));
  };

  const handleClose = () => {
    dispatch(setSelectedRecord(undefined));
    onClose();
  };

  return (
    <>
      <Drawer
        closable={false}
        destroyOnClose
        title={<p>Edit Role & Permission</p>}
        placement="right"
        open={open}
        onClose={handleClose}
        width={860}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              type="primary"
              loading={loading.updateRecord}
              onClick={() => form.submit()}
            >
              Save Changes
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleUpdateRecord}>
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
                      defaultChecked={item.manage}
                      onChange={(e) =>
                        handleChange(index, "manage", e.target.checked)
                      }
                    />
                  </Col>
                  <Col span={3} className="w-full px-4 text-center">
                    <Checkbox
                      defaultChecked={item.create}
                      onChange={(e) =>
                        handleChange(index, "create", e.target.checked)
                      }
                    />
                  </Col>
                  <Col span={3} className="w-full px-4 text-center">
                    <Checkbox
                      defaultChecked={item.read}
                      onChange={(e) =>
                        handleChange(index, "read", e.target.checked)
                      }
                    />
                  </Col>
                  <Col span={3} className="w-full px-4 text-center">
                    <Checkbox
                      defaultChecked={item.update}
                      onChange={(e) =>
                        handleChange(index, "update", e.target.checked)
                      }
                    />
                  </Col>
                  <Col span={3} className="w-full px-4 text-center">
                    <Checkbox
                      defaultChecked={item.delete}
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

export default EditPermission;
