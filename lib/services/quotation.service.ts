import { API_BASE_URL } from "@/app/(config)/constants";

import { IQuotation } from "@/lib/models/IQuotations";

import { IUser } from "../models/IUser";

export default class QuotationService {
  constructor() {}

  subject: string = "/quotations";

  create = async (payload: IQuotation) => {
    const response = await fetch(`${API_BASE_URL}${this.subject}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.status != 201) throw new Error(data.message);

    return data;
  };

  findAll = async () => {
    const response = await fetch(`${API_BASE_URL}${this.subject}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    return response.json();
  };

  findOne = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}${this.subject}/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    return response.json();
  };

  findByRequest = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}${this.subject}/request/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    return response.json();
  };

  findByFilter = async (payload: any, user?: IUser) => {
    const response = await fetch(`${API_BASE_URL}${this.subject}/`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    const data: IQuotation[] = await response.json();
    const filteredData = data.filter(
      (item) => item.quotationRequestId == payload.quotationRequestId
    );

    if (user && user.role && user.role == "Operator" && user.operatorId) {
    }

    return filteredData;
  };

  update = async (id: string, payload: IQuotation) => {
    const response = await fetch(`${API_BASE_URL}${this.subject}/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify(payload),
    });

    return response.json();
  };

  accept = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}${this.subject}/${id}/accept`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH"
    });

    return response.json();
  };

  reject = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}${this.subject}/${id}/reject`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH"
    });

    return response.json();
  };

  remove = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}${this.subject}/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
    });

    return response.json();
  };
}
