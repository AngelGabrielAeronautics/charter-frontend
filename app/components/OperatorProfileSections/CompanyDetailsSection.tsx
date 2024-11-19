import Link from "next/link";
import { useEffect, useState } from "react";



import { DeleteOutlined, DeleteTwoTone, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { Button, Checkbox, Col, Flex, Form, Image, Input, Row, Select, Typography, Upload, notification } from "antd";



import { API_BASE_URL } from "@/app/(config)/constants";



import { eModules } from "@/lib/enums/modules.enums";
import { countries } from "@/lib/helpers/countries";
import { IOperator } from "@/lib/models/IOperators";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import { resetActionStates, setCurrentOperator, update } from "@/lib/state/operators/operators.slice";


const { Title } = Typography;

interface IProps {}

const CompanyDetailsSection = ({}: IProps) => {
  const [form] = Form.useForm();

  const [companyDialCode, setCompanyDialCode] = useState<string>("--");
  const [responsiblePersonDialCode, setResponsiblePersonDialCode] =
    useState<string>("--");
  const [
    accountingResponsiblePersonDialCode,
    setAccountingResponsiblePersonDialCode,
  ] = useState<string>("--");

  const { authenticatedUser } = useAppSelector((state) => state.auth);
  const { currentOperator, loading, success, error } = useAppSelector(
    (state) => state.operators
  );

  const dispatch = useAppDispatch();

  const companyCountry = Form.useWatch("address.country", form);
  const responsiblePersonCountry = Form.useWatch(
    "responsiblePerson.country",
    form
  );
  const accountingResponsiblePersonCountry = Form.useWatch(
    "accountingResponsiblePerson.country",
    form
  );

  useEffect(() => {
    if (companyCountry) {
      const countryData = countries.find(
        (_country) => _country.name == companyCountry
      );
      if (countryData) setCompanyDialCode(countryData.dialCode);
    }
    return () => {};
  }, [companyCountry]);

  useEffect(() => {
    if (responsiblePersonCountry) {
      const countryData = countries.find(
        (_country) => _country.name == responsiblePersonCountry
      );
      if (countryData) setResponsiblePersonDialCode(countryData.dialCode);
    }
    return () => {};
  }, [responsiblePersonCountry]);

  useEffect(() => {
    if (accountingResponsiblePersonCountry) {
      const countryData = countries.find(
        (_country) => _country.name == accountingResponsiblePersonCountry
      );
      if (countryData)
        setAccountingResponsiblePersonDialCode(countryData.dialCode);
    }
    return () => {};
  }, [accountingResponsiblePersonCountry]);

  useEffect(() => {
    if (success.updateRecord) {
      notification.success({
        message: "Company details updated successfully",
      });
      dispatch(resetActionStates());
    }
    return () => {};
  }, [success.updateRecord, dispatch]);

  useEffect(() => {
    if (currentOperator && currentOperator.logo) {
      const {
        _id,
        profileCompletePercentage,
        status,
        certifications,
        cancellationPolicy,
        refundPolicy,
        ...rest
      } = currentOperator;
      form.setFieldsValue({
        ...rest,
        "responsiblePerson.firstNames":
          rest.responsiblePerson?.firstNames || "",
        "responsiblePerson.lastName": rest.responsiblePerson?.lastName || "",
        "responsiblePerson.email": rest.responsiblePerson?.email || "",
        "responsiblePerson.phone": rest.responsiblePerson?.phone || "",
        "responsiblePerson.country": rest.responsiblePerson?.country || "",
        "accountingResponsiblePerson.firstNames":
          rest.accountingResponsiblePerson?.firstNames || "",
        "accountingResponsiblePerson.lastName":
          rest.accountingResponsiblePerson?.lastName || "",
        "accountingResponsiblePerson.email":
          rest.accountingResponsiblePerson?.email || "",
        "accountingResponsiblePerson.phone":
          rest.accountingResponsiblePerson?.phone || "",
        "accountingResponsiblePerson.country":
          rest.accountingResponsiblePerson?.country || "",
        "bankingDetails.name": rest.bankingDetails?.name || "",
        "bankingDetails.accountHolder":
          rest.bankingDetails?.accountHolder || "",
        "bankingDetails.branchCode": rest.bankingDetails?.branchCode || "",
        "bankingDetails.accountNumber":
          rest.bankingDetails?.accountNumber || "",
        "bankingDetails.accountType": rest.bankingDetails?.accountType || "",
        "address.country": rest.address.country,
      });
      setLogoFileList([
        {
          uid: "-1",
          name: currentOperator.logo.name,
          status: "done",
          url: `data:${currentOperator.logo.mimetype};base64,${currentOperator.logo.data}`,
        },
      ]);
    }
    return () => {};
  }, [currentOperator]);

  const getBase64 = (file: any) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  // State for company logo upload
  const [logoPreviewOpen, setLogoPreviewOpen] = useState(false);
  const [logoPreviewImage, setLogoPreviewImage] = useState("");
  const [logoFileList, setLogoFileList] = useState<UploadFile[]>([]);

  const [termsAndConditionsFileList, setTermsAndConditionsFileList] = useState<
    {
      uid: string;
      name: string;
      UploadFileStatus: string;
      url: string;
    }[]
  >([]);

  const handleLogoPreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }

    setLogoPreviewImage(file.url || (file.preview as string));
    setLogoPreviewOpen(true);
  };

  const handleLogoChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setLogoFileList(newFileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleFinish = (values: any) => {
    const country = values["address.country"];
    const data: {
      id: string;
      payload: IOperator;
    } = {
      id: currentOperator?._id as string,
      payload: {
        ...values,
        country,
      },
    };
    dispatch(update(data));
  };

  useEffect(() => {
    if (currentOperator?.termsAndConditions) {
      const defaultFileList = currentOperator?.termsAndConditions
        ? [
            {
              uid: "-1",
              name: `${currentOperator?.termsAndConditions.name}`,
              UploadFileStatus: "done",
              url: currentOperator.termsAndConditions.data,
            },
          ]
        : [];
      setTermsAndConditionsFileList(defaultFileList)
    }
  }, [currentOperator?.termsAndConditions]);

  return (
    <Form
      form={form}
      onFinish={handleFinish}
      initialValues={currentOperator}
      layout="vertical"
      className="space-y-4"
    >
      <Form.Item label="Company Logo">
        <Upload
          listType="picture-circle"
          fileList={logoFileList}
          onPreview={handleLogoPreview}
          onChange={handleLogoChange}
          beforeUpload={async (file) => {
            setLogoFileList([...logoFileList, file]);
            const formData = new FormData();
            formData.append("file", file);
            fetch(
              `${API_BASE_URL}/${eModules.OperatorsModule}/upload/logo/${authenticatedUser?.operatorId}`,
              {
                method: "POST",
                body: formData,
              }
            )
              .then((res) => res.json())
              .then((data) => {
                dispatch(setCurrentOperator(data));
              })
              .catch(() => {});

            return false;
          }}
        >
          {logoFileList.length >= 1 ? null : uploadButton}
        </Upload>
        {logoPreviewImage && (
          <Image
            wrapperStyle={{ display: "none" }}
            preview={{
              visible: logoPreviewOpen,
              onVisibleChange: (visible) => setLogoPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setLogoPreviewImage(""),
            }}
            src={logoPreviewImage}
          />
        )}
      </Form.Item>
      <div className="text-xl font-bold">
        {currentOperator && `${currentOperator.airline}`}
      </div>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="Company Name" name="airline">
            <Input placeholder="Enter company name" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Company Registration Number"
            name="registrationNumber"
          >
            <Input placeholder="Enter registration number" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Operator Code" name="operatorCode">
            <Input placeholder="Enter operator code" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Email" name="email">
            <Input type="email" placeholder="Enter email" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="VAT Number" name="vatNumber">
            <Input placeholder="Enter VAT number" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Phone Number" name="phone">
            <Input
              placeholder="Enter phone number"
              prefix={<span>{companyDialCode}</span>}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="AOC Number" name="aocNumber">
            <Input placeholder="Enter AOC number" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Upload Terms and Conditions">
            <Upload
              action={`${API_BASE_URL}/${eModules.OperatorsModule}/upload/termsAndConditions/${authenticatedUser?.operatorId}`}
              listType="text"
              fileList={termsAndConditionsFileList}
              beforeUpload={(file, fileList) => {
                setTermsAndConditionsFileList([
                  {
                    uid: file.uid,
                    name: file.name,
                    UploadFileStatus: 'done',
                    url: "",
                  }
                ]);
              }}
              itemRender={(originNode, file, fileList, actions) => (
                <Flex justify="space-between" className="p-2">
                  <Link
                    style={{ color: "#0c3747" }}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`data:application/pdf;base64,${file.url}`}
                    download={file.name || "TermsAndConditions.pdf"}
                  >
                    {file.name || "Terms and Conditions"}
                  </Link>
                  <DeleteTwoTone className="cursor-pointer" twoToneColor="#ff4a50" onClick={() => setTermsAndConditionsFileList([])} />
                </Flex>
              )}
            >
              <Button size="small" icon={<UploadOutlined />}>
                Upload Terms and Conditions
              </Button>
            </Upload>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>{/* Upload Terms and Conditions */}</Row>

      {/* Company Address Section */}
      <h5>Company Address</h5>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="Street"
            name="address.street"
            initialValue={currentOperator?.address?.street}
          >
            <Input placeholder="Enter street" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="City"
            name="address.city"
            initialValue={currentOperator?.address?.city}
          >
            <Input placeholder="Enter city" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="State/Town"
            name="address.state"
            initialValue={currentOperator?.address?.state}
          >
            <Input placeholder="Enter state/town" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Country" name="address.country">
            <Select
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
        <Col span={8}>
          <Form.Item
            label="Postal Code"
            name="address.postalCode"
            initialValue={currentOperator?.address?.postalCode}
          >
            <Input placeholder="Enter country" />
          </Form.Item>
        </Col>
      </Row>

      {/* Responsible Person Section */}
      <h5>Responsible Person</h5>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="First Names" name="responsiblePerson.firstNames">
            <Input placeholder="Enter first names" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Surname" name="responsiblePerson.lastName">
            <Input placeholder="Enter surname" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Email Address" name="responsiblePerson.email">
            <Input type="email" placeholder="Enter email address" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="Country" name="responsiblePerson.country">
            <Select
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
        <Col span={8}>
          <Form.Item label="Mobile Number" name="responsiblePerson.phone">
            <Input
              placeholder="Enter phone number"
              prefix={<span>{responsiblePersonDialCode}</span>}
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Banking Details Section */}
      <h5>Banking Details</h5>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="Bank Name" name="bankingDetails.name">
            <Input placeholder="Enter bank name" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Account Holder" name="bankingDetails.accountHolder">
            <Input placeholder="Enter account holder" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Branch Code" name="bankingDetails.branchCode">
            <Input placeholder="Enter branch code" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Account Number" name="bankingDetails.accountNumber">
            <Input placeholder="Enter account number" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Account Type" name="bankingDetails.accountType">
            <Select
              style={{
                width: "100%",
                background: "#ffffff",
                borderRadius: "10px",
              }}
              placeholder="Select account type"
            >
              <Select.Option value="current">Current</Select.Option>
              <Select.Option value="savings">Savings</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Upload Bank Account Letter">
            {}
            <Upload
              action={`${API_BASE_URL}/${eModules.OperatorsModule}/upload/bankingDetails.accountConfirmationLetter/${authenticatedUser?.operatorId}`}
              listType="text"
              fileList={
                currentOperator?.bankingDetails?.accountConfirmationLetter
                  ? [
                      {
                        uid: "-1",
                        name: `${currentOperator?.bankingDetails.accountConfirmationLetter.name}`,
                        status: "done",
                        url: `data:${currentOperator.bankingDetails.accountConfirmationLetter.mimetype};base64,${currentOperator.bankingDetails.accountConfirmationLetter.data}`,
                      },
                    ]
                  : []
              }
            >
              <Button icon={<UploadOutlined />}>
                Upload Bank Account Letter
              </Button>
            </Upload>
          </Form.Item>
        </Col>
      </Row>

      {/* Accounting - Responsible Person Section */}
      <h5>Accounting Responsible Person</h5>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="First Names"
            name="accountingResponsiblePerson.firstNames"
          >
            <Input placeholder="Enter first names" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Surname"
            name="accountingResponsiblePerson.lastName"
          >
            <Input placeholder="Enter surname" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Email Address"
            name="accountingResponsiblePerson.email"
          >
            <Input type="email" placeholder="Enter email address" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="Country" name="accountingResponsiblePerson.country">
            <Select
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
        <Col span={8}>
          <Form.Item
            label="Mobile Number"
            name="accountingResponsiblePerson.phone"
          >
            <Input
              placeholder="Enter phone number"
              prefix={<span>{accountingResponsiblePersonDialCode}</span>}
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Terms and Conditions Checkbox */}
      <Form.Item name="acceptedTermsAndConditions" valuePropName="checked">
        <Checkbox>I accept the terms and conditions</Checkbox>
      </Form.Item>

      {/* Save Button */}
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading.updateRecord}>
          Save Changes
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CompanyDetailsSection;