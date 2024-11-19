"use client";

import React, { useState } from "react";

import { Select, SelectProps } from "antd";
import axios from "axios";

import { API_BASE_URL } from "@/app/(config)/constants";

import { IAirport } from "@/lib/models/airport.model";

export interface IProps {
  placeholder: string;
  styles: React.CSSProperties;
  onSelect: (airport?: IAirport) => void;
  defaultAirport?: IAirport;
}

const SearchSelectAirport = ({
  placeholder,
  styles,
  onSelect,
  defaultAirport,
}: IProps) => {
  const [data, setData] = useState<IAirport[]>([]);
  const [searchText, setSearchText] = useState<string>();

  const handleSearch = (value: string) => {
    axios(`${API_BASE_URL}/airports/search/${value}`)
      .then((response: any) => {
        return response.data;
      })
      .then((data: IAirport[]) => {
        setData(data);
      });
  };

  const handleSelect = (id: string) => {
    const airport = data.find((item) => item._id == id);

    if (airport) {
      onSelect(airport);
    }
  };

  const handleClear = () => {
    onSelect();
  };

  return (
    <Select
      defaultValue={defaultAirport?.airportName}
      showSearch
      placeholder={placeholder}
      style={{ ...styles }}
      defaultActiveFirstOption={false}
      suffixIcon={null}
      filterOption={false}
      onSearch={handleSearch}
      onSelect={handleSelect}
      notFoundContent={null}
      allowClear
      onClear={handleClear}
      options={(data || []).map((airport: IAirport) => ({
        value: airport._id,
        label: airport.fullLabel,
      }))}
    />
  );
};

export default SearchSelectAirport;
