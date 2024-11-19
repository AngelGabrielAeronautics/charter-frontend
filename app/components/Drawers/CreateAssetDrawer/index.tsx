import React, { useEffect, useState } from "react";

import { LoadingOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Col,
  DatePicker,
  Divider,
  Drawer,
  Flex,
  Form,
  GetProp,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  Upload,
  UploadFile,
  UploadProps,
  message,
  notification,
} from "antd";
import ImgCrop from "antd-img-crop";

import { IAsset } from "@/lib/models/IAssets";
import { IOperator } from "@/lib/models/IOperators";
import { create, resetActionStates } from "@/lib/state/assets/assets.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import { fetchOperators } from "@/lib/state/operators/operators.slice";

import { powerPlants } from "../../Assets/AddAsset";

interface CreateAssetProps {
  visible: boolean;
  onClose: () => void;
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const CreateAssetsDrawer: React.FC<CreateAssetProps> = ({
  visible,
  onClose,
}) => {
  const [form] = Form.useForm();
  const [creatingRecord, setCreatingRecord] = useState(false);
  const [errorMessage, setError] = useState<string>();

  const dispatch = useAppDispatch();

  const { authenticatedUser } = useAppSelector((state) => state.auth);
  const { currentOperator, operators } = useAppSelector(
    (state) => state.operators
  );
  const { loading, error, success } = useAppSelector((state) => state.assets);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const handleSubmit = () => {
    if (authenticatedUser) {
      form.validateFields().then(() => {
        const values = form.getFieldsValue();

        const operator =
          currentOperator ??
          operators.find((value) => value._id === values.operatorId);

        const payload: IAsset = {
          operatorId: operator?._id!,
          airline: operator?.airline!,
          baggage_compartment_max_weight: parseInt(
            values.baggage_compartment_max_weight
          ),
          baggageCompartmentMaxWeightUnits:
            values.baggageCompartmentMaxWeightUnits,
          baggageCompartmentSize: [
            parseFloat(values.length),
            parseFloat(values.width),
            parseFloat(values.height),
          ],
          baggageType: values.baggageType,
          cabinHeight: parseFloat(values.cabinHeight),
          cabinLength: parseFloat(values.cabinLength),
          cabinWidth: parseFloat(values.cabinWidth),
          cargoCapacity: parseFloat(values.cargoCapacity),
          inflightServicePersonnel: parseInt(values.inflightServicePersonnel),
          lastRefurbishmentDate: values.lastRefurbishmentDate,
          cargoCapacityUnits: values.cargoCapacityUnits,
          cruiseSpeedInKnots: parseFloat(values.cruiseSpeedInKnots),
          minimumCockpitCrew: parseInt(values.minimumCockpitCrew),
          registrationNumber: values.registrationNumber,
          yearOfManufacture: parseInt(values.yearOfManufacture),
          seatingCapacity: parseInt(values.seatingCapacity),
          manufacturer: values.manufacturer,
          numberOfCrew: parseInt(values.numberOfCrew),
          powerPlant: values.powerPlant,
          model: values.model,
          suitableForUnpavedAirfield: false,
          airConAvailable: values.airConAvailable,
          smokingAllowed: values.smokingAllowed,
          hasWashCloset: values.hasWashCloset,
          cabinPressure: values.cabinPressure,
          petsAllowed: values.petsAllowed,
          pressurized: values.pressurized,
          heated: values.heated,
          apu: values.apu,
          status: "Draft",
          auditFields: {
            createdBy: authenticatedUser.displayName,
            createdById: authenticatedUser._id!,
            dateCreated: new Date(),
          },
        };

        dispatch(create({ payload, images: fileList }));
      });
    }
  };

  useEffect(() => {
    if (loading.createRecord == false) {
      if (success.createRecord == true) {
        form.resetFields();
        dispatch(resetActionStates());
        notification.success({
          message: "Asset created successfully",
        });
        onClose();
      }
      if (error.createRecord) {
        notification.error({
          message: error.createRecord,
        });
      }
    }
    return () => {};
  }, [
    loading.createRecord,
    success.createRecord,
    error.createRecord,
    dispatch,
  ]);

  useEffect(() => {
    dispatch(fetchOperators());
    return () => {};
  }, [dispatch]);

  useEffect(() => {
    setCreatingRecord(loading.createRecord);
    return () => {};
  }, [loading.createRecord]);

  useEffect(() => {
    setError(error.createRecord);
    return () => {};
  }, [error.createRecord]);

  const formItemStyle = { width: "100%" };

  const initialValues = {
    suitableForUnpavedAirfield: false,
    airConAvailable: false,
    smokingAllowed: false,
    hasWashCloset: false,
    cabinPressure: false,
    petsAllowed: false,
    pressurized: false,
    heated: false,
    apu: false,
    status: "Draft",
  };

  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  return (
    <Drawer
      title="Add Asset"
      width={800}
      closable={true}
      onClose={onClose}
      open={visible}
      extra={[
        <Space>
          <Button
            loading={loading.createRecord}
            onClick={handleSubmit}
            type="primary"
          >
            Submit
          </Button>
        </Space>,
      ]}
      style={{ backgroundColor: "#f7f2ed" }}
    >
      <Spin
        tip="Loading"
        spinning={creatingRecord}
        indicator={<LoadingOutlined />}
      >
        <Form form={form} initialValues={initialValues} layout="vertical">
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
          {authenticatedUser?.role === "Administrator" && (
            <>
              <Alert
                type="info"
                showIcon
                message="You are currently acting on behalf of an operator."
                style={{ marginBottom: "1rem" }}
              />
              <Form.Item
                name="operatorId"
                label="Operator"
                style={formItemStyle}
                rules={[]}
              >
                <Select style={{ background: "#ffffff", borderRadius: "8px" }}>
                  {operators.map((operator: IOperator) => (
                    <Select.Option value={operator._id} key={operator._id}>
                      {operator.airline}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Divider />
            </>
          )}
          <Flex gap={16}>
            <Form.Item
              name="registrationNumber"
              label="Registration Number"
              style={formItemStyle}
              rules={[{ required: true }]}
            >
              <Input type="text" />
            </Form.Item>
            <Form.Item
              name="manufacturer"
              label="Manufacturer"
              style={formItemStyle}
              rules={[]}
            >
              <Input type="text" />
            </Form.Item>
            <Form.Item
              name="yearOfManufacture"
              label="Year of Manufacture"
              style={formItemStyle}
              rules={[]}
            >
              <Input type="number" />
            </Form.Item>
          </Flex>
          <Flex gap={16}>
            <Form.Item
              name="model"
              label="Model"
              style={formItemStyle}
              rules={[]}
            >
              <Input type="text" />
            </Form.Item>
            <Form.Item
              name="seatingCapacity"
              label="Seating Capacity"
              style={formItemStyle}
              rules={[]}
            >
              <Input type="number" min={0} />
            </Form.Item>
          </Flex>
          <h5>Baggage Compartment</h5>
          <Flex gap={16}>
            <Form.Item
              name="baggage_compartment_max_weight"
              label="Max Weight"
              style={formItemStyle}
              rules={[]}
            >
              <Input type="number" min={0} />
            </Form.Item>
            <Form.Item
              name="baggageCompartmentMaxWeightUnits"
              label="Units"
              style={formItemStyle}
              rules={[]}
            >
              <Select style={{ background: "#ffffff", borderRadius: "8px" }}>
                <Select.Option value="kg">kg</Select.Option>
                <Select.Option value="lb">lb</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="baggageType"
              label="Baggage Type"
              style={formItemStyle}
              rules={[]}
            >
              <Select style={{ background: "#ffffff", borderRadius: "8px" }}>
                <Select.Option key="Hard Suitcases">
                  Hard Suitcases
                </Select.Option>
                <Select.Option key="Soft Bags">Soft Bags</Select.Option>
              </Select>
            </Form.Item>
          </Flex>
          <Flex gap={16}>
            <Form.Item
              name="length"
              label="Length (m)"
              style={formItemStyle}
              rules={[]}
            >
              <Input type="number" min={0} />
            </Form.Item>
            <Form.Item
              name="width"
              label="Width (m)"
              style={formItemStyle}
              rules={[]}
            >
              <Input type="number" min={0} />
            </Form.Item>
            <Form.Item
              name="height"
              label="Height (m)"
              style={formItemStyle}
              rules={[]}
            >
              <Input type="number" min={0} />
            </Form.Item>
          </Flex>
          <Flex gap={16}>
            <Form.Item
              name="cabinLength"
              label="Cabin Length (m)"
              style={formItemStyle}
              rules={[]}
            >
              <Input type="number" min={0} />
            </Form.Item>
            <Form.Item
              name="cabinWidth"
              label="Cabin Width (m)"
              style={formItemStyle}
              rules={[]}
            >
              <Input type="number" min={0} />
            </Form.Item>
            <Form.Item
              name="cabinHeight"
              label="Cabin Height (m)"
              style={formItemStyle}
              rules={[]}
            >
              <Input type="number" min={0} />
            </Form.Item>
          </Flex>
          <Flex gap={16}>
            <Form.Item
              name="cargoCapacity"
              label="Cargo Capacity"
              style={formItemStyle}
              rules={[]}
            >
              <Input type="number" min={0} />
            </Form.Item>
            <Form.Item
              name="cargoCapacityUnits"
              label="Cargo Capacity Units"
              style={formItemStyle}
              rules={[]}
            >
              <Select style={{ background: "#ffffff", borderRadius: "8px" }}>
                <Select.Option value="kg">kg</Select.Option>
                <Select.Option value="lb">lb</Select.Option>
              </Select>
            </Form.Item>
          </Flex>
          <Flex gap={16}>
            <Form.Item
              name="inflightServicePersonnel"
              label="Inflight Service Personnel"
              style={formItemStyle}
              rules={[]}
            >
              <Input type="number" min={0} />
            </Form.Item>
            <Form.Item
              name="minimumCockpitCrew"
              label="Cockpit Crew"
              style={formItemStyle}
              rules={[]}
            >
              <Input type="number" min={0} />
            </Form.Item>
            <Form.Item
              name="numberOfCrew"
              label="Number of Crew"
              style={formItemStyle}
              rules={[]}
            >
              <Input type="number" min={1} />
            </Form.Item>
          </Flex>
          <Flex gap={16}>
            <Form.Item
              name="powerPlant"
              label="Power Plant"
              style={formItemStyle}
              rules={[]}
            >
              <Select style={{ background: "#ffffff", borderRadius: "8px" }}>
                {powerPlants.map((item, index) => (
                  <Select.Option key={index} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="cruiseSpeedInKnots"
              label="Cruise Speed In Knots"
              style={formItemStyle}
              rules={[]}
            >
              <Input type="number" min={0} />
            </Form.Item>
          </Flex>
          <Form.Item
            name="lastRefurbishmentDate"
            label="Last Refurbishment Date"
            style={formItemStyle}
            rules={[]}
          >
            <DatePicker
              style={{
                background: "#ffffff",
                borderRadius: "8px",
                width: "100%",
              }}
            />
          </Form.Item>
          <h5>Interior Images</h5>
          <Row style={{ marginBottom: 30 }}>
            <ImgCrop rotationSlider>
              <Upload
                {...props}
                listType="picture-card"
                fileList={fileList}
                onChange={onChange}
                onPreview={onPreview}
              >
                {fileList.length < 5 && "+ Upload"}
              </Upload>
            </ImgCrop>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                name="suitableForUnpavedAirfield"
                valuePropName="checked"
                label="Suitable for unpaved airfield?"
                style={formItemStyle}
                rules={[]}
              >
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="airConAvailable"
                valuePropName="checked"
                label="Aircon available?"
                style={formItemStyle}
                rules={[]}
              >
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="smokingAllowed"
                valuePropName="checked"
                label="Is smoking allowed?"
                style={formItemStyle}
                rules={[]}
              >
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="hasWashCloset"
                valuePropName="checked"
                label="Wash closet available?"
                style={formItemStyle}
                rules={[]}
              >
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="cabinPressure"
                valuePropName="checked"
                label="Is pressurized cabin?"
                style={formItemStyle}
                rules={[]}
              >
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="petsAllowed"
                valuePropName="checked"
                label="Are pets allowed?"
                style={formItemStyle}
                rules={[]}
              >
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
            </Col>
            {/* <Col span={12}>
						<Form.Item name='pressurized' valuePropName="checked" label='pressurized' style={formItemStyle} rules={[]}>
							<Switch checkedChildren='Yes' unCheckedChildren='No' />
						</Form.Item>
					</Col> */}
            <Col span={12}>
              <Form.Item
                name="heated"
                valuePropName="checked"
                label="Is heated?"
                style={formItemStyle}
                rules={[]}
              >
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="apu"
                valuePropName="checked"
                label="Has APU?"
                style={formItemStyle}
                rules={[]}
              >
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Drawer>
  );
};

export default CreateAssetsDrawer;
