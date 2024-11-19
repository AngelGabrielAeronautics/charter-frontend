import { API_BASE_URL } from "@/app/(config)/constants";

import { IRolePermission as IRecord } from "@/lib/models/role.model";

export default class RoleService {
  constructor() {}

  subject: string = "/role-permissions";

  create = async (payload: IRecord) => {
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
    const response = await fetch(`${API_BASE_URL}${this.subject}/populated`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    return response.json();
  };

  findOne = async (id: string) => {
    const response = await fetch(
      `${API_BASE_URL}${this.subject}/${id}/populated`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      }
    );

    return response.json();
  };

  findByFilter = async (payload: any) => {
    const response = await fetch(`${API_BASE_URL}${this.subject}/filter`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(payload),
    });

    return response.json();
  };

  update = async (id: string, payload: IRecord) => {
    const response = await fetch(`${API_BASE_URL}${this.subject}/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify(payload),
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
