import React, { useEffect, useState } from "react";

import { LoadingOutlined } from "@ant-design/icons";
import {
  Alert,
  Col,
  DatePicker,
  Divider,
  Flex,
  Form,
  Input,
  Row,
  Select,
  Spin,
  Switch,
  notification,
} from "antd";

import { IAsset } from "@/lib/models/IAssets";
import { IOperator } from "@/lib/models/IOperators";
import { create, resetActionStates } from "@/lib/state/assets/assets.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import { fetchOperators } from "@/lib/state/operators/operators.slice";

const EditAssetForm = () => {
  const [form] = Form.useForm();
  const [creatingRecord, setCreatingRecord] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const dispatch = useAppDispatch();

  const { authenticatedUser } = useAppSelector((state) => state.auth);
  const { currentOperator, operators, loading, success, error } =
    useAppSelector((state) => state.operators);

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

        dispatch(create({ payload, images: [] }));
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
        // onClose()
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
    setErrorMessage(error.createRecord);
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
  return (
    <div>
      <Spin
        tip="Loading"
        spinning={creatingRecord}
        indicator={<LoadingOutlined />}
      >
        <Form form={form} initialValues={initialValues} layout="vertical">
          {errorMessage && (
            <>
              <Alert
                type="error"
                showIcon
                message={errorMessage}
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
              label="Registration number"
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
              label="Year of manufacture"
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
              label="Seating capacity"
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
              label="Max weight"
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
              label="baggageType"
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
              label="Length"
              style={formItemStyle}
              rules={[]}
            >
              <Input type="number" min={0} />
            </Form.Item>
            <Form.Item
              name="width"
              label="Width"
              style={formItemStyle}
              rules={[]}
            >
              <Input type="number" min={0} />
            </Form.Item>
            <Form.Item
              name="height"
              label="Height"
              style={formItemStyle}
              rules={[]}
            >
              <Input type="number" min={0} />
            </Form.Item>
          </Flex>
          <Flex gap={16}>
            <Form.Item
              name="cabinHeight"
              label="Cabin height"
              style={formItemStyle}
              rules={[]}
            >
              <Input type="number" min={0} />
            </Form.Item>
            <Form.Item
              name="cabinLength"
              label="Cabin length"
              style={formItemStyle}
              rules={[]}
            >
              <Input type="number" min={0} />
            </Form.Item>
            <Form.Item
              name="cabinWidth"
              label="Cabin width"
              style={formItemStyle}
              rules={[]}
            >
              <Input type="number" min={0} />
            </Form.Item>
          </Flex>
          <Flex gap={16}>
            <Form.Item
              name="cargoCapacity"
              label="Cargo capacity"
              style={formItemStyle}
              rules={[]}
            >
              <Input type="number" min={0} />
            </Form.Item>
            <Form.Item
              name="cargoCapacityUnits"
              label="Cargo capacity units"
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
              label="Inflight service personnel"
              style={formItemStyle}
              rules={[]}
            >
              <Input type="number" min={0} />
            </Form.Item>
            <Form.Item
              name="minimumCockpitCrew"
              label="Cockpit crew"
              style={formItemStyle}
              rules={[]}
            >
              <Input type="number" min={0} />
            </Form.Item>
            <Form.Item
              name="numberOfCrew"
              label="Number of crew"
              style={formItemStyle}
              rules={[]}
            >
              <Input type="number" min={1} />
            </Form.Item>
          </Flex>
          <Flex gap={16}>
            <Form.Item
              name="powerPlant"
              label="Power plant"
              style={formItemStyle}
              rules={[]}
            >
              <Select style={{ background: "#ffffff", borderRadius: "8px" }}>
                {/* {powerPlants.map((item, index) => (
									<Select.Option key={index} value={item}>
										{item}
									</Select.Option>
								))} */}
              </Select>
            </Form.Item>
            <Form.Item
              name="cruiseSpeedInKnots"
              label="Cruise speed in knots"
              style={formItemStyle}
              rules={[]}
            >
              <Input type="number" min={0} />
            </Form.Item>
          </Flex>
          <Form.Item
            name="lastRefurbishmentDate"
            label="Last refurbishment date"
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
    </div>
  );
};

export default EditAssetForm;
