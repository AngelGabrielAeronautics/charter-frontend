import axios from "axios";

import { eModules } from "../enums/modules.enums";
import { ITicket as IRecord } from "../models/ITicket";
import BaseService from "./base.service";

export default class TicketService extends BaseService {
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

  update = async (id: string, payload: IRecord) => {
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
