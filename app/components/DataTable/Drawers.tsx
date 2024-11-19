// /DataTable/Drawers.tsx
import React, { useState } from "react";

import {
  Button,
  Descriptions,
  Drawer,
  Form,
  FormInstance,
  Image,
  Space,
  Upload,
} from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import moment from "moment";

import { IFile } from "@/lib/models/file.model";

import { renderFormFields } from "./renderers";
import {
  formatLabel,
  formatValue,
  getSingularTitle,
  isDateKey,
  isDateString,
  isTimeKey,
  isTimeString,
} from "./utilities";

interface DrawerProps {
  visible: boolean;
  closeDrawer: () => void;
  form: FormInstance;
  handleSubmit: (values: any) => void;
  data: any[] | undefined;
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export const renderCreateDrawer = (
  visible: boolean,
  closeDrawer: () => void,
  form: FormInstance,
  handleSubmit: (values: any) => void,
  data: any[]
) => (
  <Drawer
    title={`Create ${getSingularTitle("Records")}`}
    width={600}
    onClose={closeDrawer}
    open={visible}
  >
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      {renderFormFields(data[0])}
      <Form.Item>
        <Space>
          <Button onClick={closeDrawer}>Cancel</Button>
          <Button type="primary" onClick={() => form.submit()}>
            Create
          </Button>
        </Space>
      </Form.Item>
    </Form>
  </Drawer>
);

export const renderEditDrawer = (
  visible: boolean,
  closeDrawer: () => void,
  form: FormInstance,
  handleSubmit: (values: any) => void,
  record: any
) => (
  <Drawer
    title={`Edit ${getSingularTitle("Record")}`}
    width={600}
    onClose={closeDrawer}
    open={visible}
  >
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      {renderFormFields(record)}
      <Form.Item>
        <Space>
          <Button onClick={closeDrawer}>Cancel</Button>
          <Button type="primary" onClick={() => form.submit()}>
            Update
          </Button>
        </Space>
      </Form.Item>
    </Form>
  </Drawer>
);

export const renderDetailsDrawer = (
  objectDrawerVisible: boolean,
  setObjectDrawerVisible: (visible: boolean) => void,
  objectDetail: Record<string, any> | null,
  objectDrawerTitle: string
) => (
  <Drawer
    title={objectDrawerTitle}
    width={600}
    onClose={() => setObjectDrawerVisible(false)}
    open={objectDrawerVisible}
  >
    <Descriptions column={1} bordered>
      {objectDetail &&
        Object.keys(objectDetail).map((key) => (
          <Descriptions.Item label={formatLabel(key)} key={key}>
            {isDateKey(key) && isDateString(objectDetail[key])
              ? moment(objectDetail[key]).format("YYYY-MM-DD HH:mm:ss") // Format as date-time string
              : isTimeKey(key) && isTimeString(objectDetail[key])
                ? moment(objectDetail[key], "HH:mm").format("HH:mm") // Format as time string
                : formatValue(objectDetail[key])}
          </Descriptions.Item>
        ))}
    </Descriptions>
  </Drawer>
);

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

// The Drawer component for rendering images
export const renderImagesDrawer = ({
  open,
  onClose,
  files,
}: {
  open: boolean;
  onClose: () => void;
  files: IFile[];
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  // Function to handle preview
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  return (
    <Drawer
      title="Images"
      placement="right"
      closable={true}
      onClose={onClose}
      open={open}
    >
      <Upload
        listType="picture"
        fileList={files.map((file: IFile, index: number) => ({
          uid: String(index),
          name: file.name,
          status: "done",
          url: `data:${file.mimetype};base64,${file.data}`, // Construct base64 URL
        }))}
        showUploadList={{ showRemoveIcon: false }}
        onPreview={handlePreview}
      />
      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </Drawer>
  );
};
