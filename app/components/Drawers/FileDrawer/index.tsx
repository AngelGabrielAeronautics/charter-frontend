import React, { useState } from "react";



import { UploadOutlined } from "@ant-design/icons";
import { Button, DatePicker, Drawer, Form, Input, Select, Space, Upload, message } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";



import { API_BASE_URL } from "@/app/(config)/constants";



import { eModules } from "@/lib/enums/modules.enums";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import { setCurrentOperator } from "@/lib/state/operators/operators.slice";


type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

interface CreateTaskProps {
  open: boolean;
  onClose: () => void;
  documentName: string;
  modelKey: string;
}

const UploadFileInfoDrawer: React.FC<CreateTaskProps> = ({
  open,
  onClose,
  documentName,
  modelKey,
}) => {
  const [file, setFile] = useState<UploadFile>();
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm();

  const { authenticatedUser } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  const uploadFile = (values: any) => {
    const formData = new FormData();

    formData.append("documentName", documentName);
    formData.append("dateUploaded", new Date().toUTCString());
    values.expirationDate &&
      formData.append("expirationDate", values.expirationDate);
    formData.append("file", file as FileType);
    formData.append("status", "Unverified");

    setUploading(true);

    fetch(
      `${API_BASE_URL}/${eModules.OperatorsModule}/upload/certificate/${modelKey}/${authenticatedUser?.operatorId}`,
      {
        method: "POST",
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setFile(undefined);
        console.log('Updated Operator => ', data)
        dispatch(setCurrentOperator(data))
        message.success("Upload successful.");
        onClose();
      })
      .catch(() => {
        message.error("Upload failed.");
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const props: UploadProps = {
    onRemove: (file) => {
      setFile(undefined);
    },
    beforeUpload: (file) => {
      setFile(file);
      return false;
    },
  };

  const handleSubmit = (values: any) => {
    if (file) {
      uploadFile(values);
    }
  };

  return (
    <Drawer
      title="Upload a file"
      width={680}
      closable={true}
      onClose={onClose}
      open={open}
      extra={[
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} type="primary">
            Submit File
          </Button>
        </Space>,
      ]}
      style={{ backgroundColor: "#f7f2ed" }}
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item>
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          name="documentName"
          label="Document Name"
          initialValue={documentName}
        >
          <Input value={documentName} disabled />
        </Form.Item>
        <Form.Item name="expirationDate" label="Expiration Date">
          <DatePicker />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default UploadFileInfoDrawer;