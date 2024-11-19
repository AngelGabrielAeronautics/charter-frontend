"use client";

import React from "react";

import {
  DatePicker,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Tooltip,
  Upload,
} from "antd";
import { useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";

import { IAsset } from "@/lib/models/IAssets";
import { useAppSelector } from "@/lib/state/hooks";

import UploadButton from "../../../(protected)/operator/assets/add-asset/components/upload_button";

export const powerPlants = [
  "Quad Jet",
  "Triple Jet",
  "Twin Jet",
  "Single Jet",
  "Twin Turboprop",
  "Single Turboprop",
  "Twin Piston",
  "Single Piston",
];

const formItemStyle = { width: "100%" };

const AddAssetForm = () => {
  const [form] = useForm();

  const { authenticatedUser } = useAppSelector((state) => state.auth);
  const { currentOperator } = useAppSelector((state) => state.operators);

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleSaveAsset = () => {
    form.validateFields().then((values: any) => {
      const baggageCompartmentSize = [
        values.baggageCompartmentLength,
        values.baggageCompartmentWidth,
        values.baggageCompartmentHeight,
      ];

      delete values.baggageCompartmentLength;
      delete values.baggageCompartmentWidth;
      delete values.baggageCompartmentHeight;

      const asset: IAsset = {
        ...values,
        // pressurized: isPressurized,
        // hasWashCloset: hasWaterCloset,
        // smokingAllowed: isSmokingAllowed,
        airConAvailable: values.airConAvailable,
        // apu: hasAPU,
        // heated: heated,
        cargoCapacity: "",
        cargoCapacityUnits: "",
        inflightServicePersonnel: "",
        minimumCockpitCrew: "",
        numberOfCrew: "",
        seatingCapacity: "",
        cabinPressure: values.cabinPressure as boolean,
        yearOfManufacture: values.yearOfManufacture as number,
        baggageCompartmentSize: baggageCompartmentSize,
        // suitableForUnpavedAirfield: suitableForUnpavedAirfield,
        // petsAllowed: pets,
        airline: currentOperator?.airline as string,
        operatorId: currentOperator?._id as string,
        auditFields: {
          createdBy: authenticatedUser?.displayName as string,
          createdById: authenticatedUser?._id as string,
          dateCreated: new Date(),
        },
      };
    });
  };

  return (
    <div id="add-asset-form">
      <Form form={form} layout="vertical" onFinish={handleSaveAsset}>
        <FormItem
          required
          name="registrationNumber"
          label="Registration Number"
          style={formItemStyle}
        >
          <Input type="text" />
        </FormItem>
        <FormItem
          required
          name="manufacturer"
          label="Manufacturer"
          style={formItemStyle}
        >
          <Input type="text" />
        </FormItem>
        <FormItem required name="model" label="Model" style={formItemStyle}>
          <Input type="text" />
        </FormItem>
        <FormItem
          required
          name="yearOfManufacture"
          label="Year of Manufacturer"
          style={formItemStyle}
        >
          <Input type="number" />
        </FormItem>
        <FormItem
          required
          name="seatingCapacity"
          label="Max Seats"
          style={formItemStyle}
        >
          <Input type="number" />
        </FormItem>
        <Form.Item
          name="powerPlant"
          style={{ width: "100%" }}
          label="Select Power plant..."
        >
          <Select
            style={{ backgroundColor: "white", borderRadius: 10, height: 30 }}
          >
            {powerPlants.map((powerPlant: string, index: number) => (
              <Select.Option value={powerPlant}>{powerPlant}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          style={formItemStyle}
          label="Last refurbishment date"
          name="lastRefurbishmentDate"
        >
          <DatePicker style={{ borderRadius: 8, width: "100%" }} />
        </Form.Item>
        <FormItem
          name="cruiseSpeedInKnots"
          label="Cruise Speed Knots"
          style={formItemStyle}
        >
          <Input type="number" />
        </FormItem>
        <div className="flex items-end">
          <FormItem
            style={formItemStyle}
            label="Pressurized"
            name="cabinPressure"
            valuePropName="checked"
          >
            <Tooltip title="Pressurized Cabin?">
              <Switch defaultValue={false} />
            </Tooltip>
          </FormItem>
          <FormItem
            style={formItemStyle}
            label="WC"
            name="hasWashCloset"
            valuePropName="checked"
          >
            <Tooltip title="Wash Closet?">
              <Switch defaultValue={false} />
            </Tooltip>
          </FormItem>
          <FormItem
            style={formItemStyle}
            label="Unpaved"
            name="suitableForUnpavedAirfield"
            valuePropName="checked"
          >
            <Tooltip title="Suitable for unpaved runway?">
              <Switch defaultValue={false} />
            </Tooltip>
          </FormItem>
          <FormItem
            style={formItemStyle}
            label="Smoking"
            name="smokingAllowed"
            valuePropName="checked"
          >
            <Tooltip title="Smoking Allowed?">
              <Switch defaultValue={false} />
            </Tooltip>
          </FormItem>
          <FormItem
            style={formItemStyle}
            label="Pets"
            name="petsAllowed"
            valuePropName="checked"
          >
            <Tooltip title="Pets Allowed?">
              <Switch defaultValue={false} />
            </Tooltip>
          </FormItem>
        </div>
        <Flex
          justify="space-between"
          style={{ width: "100%" }}
          gap={16}
          className="items-end"
        >
          <div
            style={{ justifyContent: "space-between", width: "100%" }}
            className="flex space-x-5"
          >
            <Form.Item
              label="Release to Service"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              labelAlign="right"
              name="serviceReleaseFilePath"
            >
              <UploadButton description="" />
            </Form.Item>
            <Form.Item
              label="Certificate of air worthiness"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              name="airworthinessCertificateFilePath"
            >
              <UploadButton description="" />
            </Form.Item>
            <Form.Item
              label="Certificate of Insurance"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              name="insuranceCertificateFilePath"
            >
              <UploadButton description="" />
            </Form.Item>
          </div>
        </Flex>
        <h4>Cabin Details</h4>
        <Divider />
        <div
          style={{ justifyContent: "space-between", width: "100%" }}
          className="flex space-x-5"
        >
          <Form.Item
            name="cabinLength"
            style={{ width: "100%" }}
            label="height(m)"
          >
            <InputNumber min={0} type="number" />
          </Form.Item>
          <Form.Item
            name="cabinWidth"
            style={{ width: "100%" }}
            label="width(m)"
          >
            <InputNumber min={0} type="number" />
          </Form.Item>
          <Form.Item
            name="cabinHeight"
            style={{ width: "100%" }}
            label="length(m)"
          >
            <InputNumber min={0} type="number" />
          </Form.Item>
          <FormItem
            style={formItemStyle}
            label="Aircon"
            name="airConAvailable"
            valuePropName="checked"
          >
            <Tooltip title="Has Aircon?">
              <Switch defaultValue={false} />
            </Tooltip>
          </FormItem>
          <FormItem
            style={formItemStyle}
            label="Heated"
            name="heated"
            valuePropName="checked"
          >
            <Tooltip title="Is heated?">
              <Switch defaultValue={false} />
            </Tooltip>
          </FormItem>
        </div>
        <Flex gap={16} className="items-end">
          <Form.Item
            style={{ width: "100%" }}
            name="baggage_compartment_max_weight"
            label="Max Baggage Weight"
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            style={{ width: 85 }}
            name="baggageCompartmentMaxWeightUnits"
            label="Units"
          >
            <Select
              style={{ backgroundColor: "white", borderRadius: 10, height: 30 }}
            >
              <Select.Option value="kgs">kgs</Select.Option>
              <Select.Option value="lbs">lbs</Select.Option>
            </Select>
          </Form.Item>
        </Flex>
        <strong>Baggage Compartment</strong>
        <Flex gap={16}>
          <Form.Item style={{ width: "100%" }} label="length (m)">
            <Input />
          </Form.Item>
          <Form.Item style={{ width: "100%" }} label="width (m)">
            <Input />
          </Form.Item>
          <Form.Item style={{ width: "100%" }} label="height (m)">
            <Input />
          </Form.Item>
        </Flex>
        <Form.Item
          style={{ width: "100%" }}
          label="Baggage type"
          name="baggageType"
        >
          <Select
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              height: 30,
              width: "100%",
            }}
          >
            <Select.Option value="handBagsPermitted">
              Hand Bags Permitted
            </Select.Option>
            <Select.Option value="strictlySoftSidedBags">
              Strictly soft sided bags
            </Select.Option>
          </Select>
        </Form.Item>
        <h4>Crew Details</h4>
        <Divider />
        <Flex gap={16}>
          <Form.Item style={{ width: "100%" }} label="Minimum Cockpit Crew">
            <Input type="number" />
          </Form.Item>
          <Form.Item
            style={{ width: "100%" }}
            label="In Flight Personal Service"
          >
            <Input type="number" />
          </Form.Item>
        </Flex>
        <h4>Equipment</h4>
        <Divider />
        <Flex>
          <FormItem style={formItemStyle} label="APU" name="apu">
            <Switch defaultValue={false} />
          </FormItem>
        </Flex>
        <h4>Images</h4>
        <Divider />
        <Flex className="items-end space-x-5">
          <Form.Item
            label="Exterior Image"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload action="/upload.do" listType="picture-card"></Upload>
            <UploadButton description="" />
          </Form.Item>
          <Form.Item
            label="Interior Image"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <UploadButton description="" />
          </Form.Item>
          <Form.Item
            label="Cabin layout Image"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <UploadButton description="" />
          </Form.Item>
          <Form.Item
            label="Cockpit Image"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <UploadButton description="" />
          </Form.Item>
        </Flex>
      </Form>
    </div>
  );
};

export default AddAssetForm;
