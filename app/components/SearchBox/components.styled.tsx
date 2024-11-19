import { Button, DatePicker, Form, Input, Select, TimePicker } from "antd";
import styled from "styled-components";

export const AntForm = styled(Form)`
  width: 100%;
  padding: 0 1rem;
  box-sizing: border-box;
  margin-bottom: 1rem;
`;

export const FormControl = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 1rem;
`;

export const AntFormItem = styled(Form.Item)`
  background-color: #ffffffb5;
  border-radius: 10px;
  padding: 12px 16px;
  box-sizing: border-box;
  margin: 0;
  width: 15%;
`;

export const InputLabel = styled.label`
  font-family: "Inter", sans-serif;
  display: block;
  color: #8f8f8f;
  font-size: 12px;
  margin: 0;
  box-sizing: border-box;
`;

export const AntInput = styled(Input)`
  font-family: "Inter", sans-serif;
  outline: none;
  border: none;
  color: #393939;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  background-color: transparent;
  padding: 0;
  margin: 0;
  &:hover,
  &:focus,
  &:focus-within {
    background-color: transparent;
    border-color: transparent;
    box-shadow: none;
  }
`;

export const AntSelect = styled(Select)`
  height: 24px;
  width: 100%;
  font-family: "Inter", sans-serif;
  outline: none;
  border: none;
  color: #393939;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  background-color: transparent;
  padding: 0;
  margin: 0;
  &:hover,
  &:focus,
  &:focus-within {
    background-color: transparent;
    border-color: transparent;
    box-shadow: none;
  }
  .ant-select-selector {
    height: 20px !important;
    padding: 0 !important;
    font-size: 1rem !important;
  }
  .ant-select-selection-search {
    inset-inline-start: 0 !important;
    inset-inline-end: 0 !important;
    font-size: 1rem !important;
  }
  .ant-select-outlined:not(.ant-select-customize-input) .ant-select-selector {
    font-size: 1rem !important;
  }
`;

export const AntDatePicker = styled(DatePicker)`
  width: 100%;
  border-color: transparent;
  box-shadow: none;
  background-color: transparent;
  padding: 0;
  &:hover,
  &:focus,
  &:focus-within {
    background-color: transparent;
    border-color: transparent;
    box-shadow: none;
  }
`;

export const AntTimePicker = styled(TimePicker)`
  width: 100%;
  border-color: transparent;
  box-shadow: none;
  background-color: transparent;
  padding: 0;
  &:hover,
  &:focus,
  &:focus-within {
    background-color: transparent;
    border-color: transparent;
    box-shadow: none;
  }
`;

export const AntButton = styled(Button)`
  height: "60px";
  padding: "1rem";
  background-color: "#0b374675";
  width: "100%";
  color: "#F9EFE4";
  font-size: "1rem";
  font-weight: "500";
  text-transform: uppercase;
`;
