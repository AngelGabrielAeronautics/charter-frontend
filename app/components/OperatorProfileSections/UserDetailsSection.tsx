import React, { useEffect, useState } from "react";

import { PlusOutlined } from "@ant-design/icons";
import type { GetProp, UploadFile, UploadProps } from "antd";
import {
  Alert,
  Button,
  Col,
  Divider,
  Flex,
  Form,
  Image,
  Input,
  Row,
  Select,
  Space,
  Upload,
  notification,
} from "antd";
import { MdOutlineVerified } from "react-icons/md";

import { API_BASE_URL } from "@/app/(config)/constants";

import { eModules } from "@/lib/enums/modules.enums";
import { countries } from "@/lib/helpers/countries";
import { IOperator } from "@/lib/models/IOperators";
import { IUser } from "@/lib/models/IUser";
import { setAuthenticatedUser } from "@/lib/state/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import { update } from "@/lib/state/operators/operators.slice";
import { resetActionStates, updateUser } from "@/lib/state/users/users.slice";

interface IProps {
  noButton?: boolean;
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const UserDetailsSection = ({ noButton = false }: IProps) => {
  const [form] = Form.useForm();
  const [userDialCode, setUserDialCode] = useState<string>("--");

  const { authenticatedUser } = useAppSelector((state) => state.auth);
  const { currentOperator } = useAppSelector((state) => state.operators);
  const { loading, error, success } = useAppSelector((state) => state.users);

  const getBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  // State for profile photo upload
  const [profilePreviewOpen, setProfilePreviewOpen] = useState(false);
  const [profilePreviewImage, setProfilePreviewImage] = useState("");
  const [profileFileList, setProfileFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (authenticatedUser && currentOperator) {
      // Pre-populate the user details form with user data from the authenticated user
      if (form) {
        form.setFieldsValue({
          firstNames: authenticatedUser.firstNames,
          lastName: authenticatedUser.lastName,
          email: authenticatedUser.email,
          phoneNumber: authenticatedUser.phoneNumber,
          country: currentOperator.country,
        });
        authenticatedUser.photoUrl &&
          setProfileFileList([
            {
              uid: "-1",
              name: authenticatedUser.photoUrl.name,
              status: "done",
              url: `data:${authenticatedUser.photoUrl.mimetype};base64,${authenticatedUser.photoUrl.data}`,
            },
          ]);
      }
    }
  }, [authenticatedUser, currentOperator, form]);

  const handleProfilePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }

    setProfilePreviewImage(file.url || (file.preview as string));
    setProfilePreviewOpen(true);
  };

  const handleProfileChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setProfileFileList(newFileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const dispatch = useAppDispatch();

  const onFinish = (values: any) => {
    const payload: IUser = {
      ...values,
      auditFields: {
        createdById: authenticatedUser?._id,
        createdBy: authenticatedUser?.displayName,
        dateCreated: new Date(),
      },
    };

    dispatch(updateUser({ id: authenticatedUser?._id as string, payload }));
  };

  const selectedCountry = Form.useWatch("country", form);

  useEffect(() => {
    if (selectedCountry) {
      const countryData = countries.find(
        (_country) => _country.name == selectedCountry
      );
      if (countryData) setUserDialCode(countryData.dialCode);
    }
    return () => {};
  }, [selectedCountry]);

  useEffect(() => {
    if (success.updateRecord) {
      notification.success({
        message: "User details updated successfully",
      });
      dispatch(resetActionStates());
    }
    return () => {};
  }, [success.updateRecord, dispatch]);

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      className="space-y-4"
    >
      {error.updateRecord && (
        <Alert showIcon banner type="error" message={error.updateRecord} />
      )}
      <Form.Item label="Profile Photo">
        <Upload
          listType="picture-circle"
          fileList={profileFileList}
          onPreview={handleProfilePreview}
          onChange={handleProfileChange}
          beforeUpload={async (file) => {
            setProfileFileList([...profileFileList, file]);
            const formData = new FormData();
            formData.append("file", file as FileType);
            fetch(
              `${API_BASE_URL}/${eModules.UsersModule}/upload/photoUrl/${authenticatedUser?._id}`,
              {
                method: "POST",
                body: formData,
              }
            )
              .then((res) => res.json())
              .then((data) => {
                dispatch(setAuthenticatedUser(data));
              })
              .catch(() => {});

            return false;
          }}
        >
          {profileFileList.length >= 1 ? null : uploadButton}
        </Upload>
        {profilePreviewImage && (
          <Image
            wrapperStyle={{ display: "none" }}
            preview={{
              visible: profilePreviewOpen,
              onVisibleChange: (visible) => setProfilePreviewOpen(visible),
              afterOpenChange: (visible) =>
                !visible && setProfilePreviewImage(""),
            }}
            src={profilePreviewImage}
          />
        )}
      </Form.Item>

      <div className="text-xl font-bold">
        {authenticatedUser &&
          `${authenticatedUser.firstNames} ${authenticatedUser.lastName}`}
      </div>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="First Names" name="firstNames">
            <Input placeholder="Enter first names" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Surname" name="lastName">
            <Input placeholder="Enter surname" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Country" name="country">
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
                    <span style={{ display: "block" }}>{country.name}</span>
                  </p>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Mobile Number" name="phoneNumber">
            <Input
              size="large"
              type="text"
              placeholder="Mobile Number"
              autoComplete="off"
              allowClear
              prefix={<span>{userDialCode}</span>}
              value={authenticatedUser?.phoneNumber || ""} // add a default value to avoid undefined
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Email Address" name="email">
            <Input placeholder="Enter email address" />
          </Form.Item>
        </Col>
      </Row>

      {noButton == false && (
        <Button type="primary" htmlType="submit" loading={loading.updateRecord}>
          Save Changes
        </Button>
      )}
    </Form>
  );
};

export default UserDetailsSection;
