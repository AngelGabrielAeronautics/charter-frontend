import axios from "axios";

import { eModules } from "@/lib/enums/modules.enums";
import BaseService from "@/lib/services/base.service";

export default class QuotationRequestService extends BaseService {
  constructor(subject: eModules) {
    super(subject);
  }

  create = async (payload: any) => {
    const response = await axios.post(
      `${this.baseUrl}/${this.subject}`,
      payload,
      {
        headers: this.headers,
      }
    )
      .catch((onRejected) => {
        console.error(onRejected);
        throw new Error("Something went wrong")
      });

    console.log("🚀 ~ quotation-request.service.ts:19 ~ create response data =>", response.data)

    if (response.status != 201) throw new Error(response.data.message);

    console.log("🚀 ~ quotation-request.service.ts:23 ~ Error not thrown")
    return response.data;
  };

  findAll = async () => {
    const response = await axios.get(`${this.baseUrl}/${this.subject}`, {
      headers: this.headers,
    });

    return response.data;
  };

  findByOrganisationId = async (id: string) => {
    const response = await axios.get(
      `${this.baseUrl}/${this.subject}/by-organisation/${id}`,
      {
        headers: this.headers,
      }
    );

    return response.data;
  };

  findOne = async (id: string) => {
    const response = await axios.get(`${this.baseUrl}/${this.subject}/${id}/`, {
      headers: this.headers,
    });

    return response.data;
  };

  findByCountry = async (payload: any) => {
    const response = await axios.post(
      `${this.baseUrl}/${this.subject}/findByCountry`,
      payload,
      {
        headers: this.headers,
      }
    );

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
