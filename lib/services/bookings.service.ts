import axios from "axios";

import { eModules } from "@/lib/enums/modules.enums";
import { IBooking as IRecord } from "@/lib/models";
import BaseService from "@/lib/services/base.service";

export default class Service extends BaseService {
  constructor(subject: eModules) {
    super(subject);
  }

  create = async (payload: IRecord) => {
    const response = await axios.post(
      `${this.baseUrl}/${this.subject}`,
      payload,
      {
        headers: this.headers,
      }
    );

    const data = await response.data;

    if (response.status != 201) throw new Error(data.message);

    return data;
  };

  findAll = async () => {
    const response = await axios.get(`${this.baseUrl}/${this.subject}`, {
      headers: this.headers,
    });

    return response.data;
  };

  findOne = async (id: string) => {
    const response = await axios.get(`${this.baseUrl}/${this.subject}/${id}`, {
      headers: this.headers,
    });

    return response.data;
  };

  findByFilter = async (payload: any) => {
    const response = await axios.post(
      `${this.baseUrl}/${this.subject}/filter`,
      payload,
      {
        headers: this.headers,
      }
    );

    return response.data;
  };

  update = async (id: string, payload: any) => {
    const response = await axios.patch(
      `${this.baseUrl}/${this.subject}/${id}`,
      payload,
      {
        headers: this.headers,
      }
    );

    return response.data;
  };

  remove = async (id: string) => {
    const response = await axios.delete(
      `${this.baseUrl}/${this.subject}/${id}`,
      {
        headers: this.headers,
      }
    );

    return response.data;
  };
}
