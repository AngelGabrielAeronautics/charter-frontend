import { API_BASE_URL } from "@/app/(config)/constants";

import { IAuditLog } from "@/lib/models";

interface type extends IAuditLog {}
const subject: string = "/audit-logs";

export default class AuditLogService {
  constructor() {}

  findAll = async () => {
    const response = await fetch(`${API_BASE_URL}${subject}/`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    return response.json();
  };

  findOne = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}${subject}/${id}/`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    return response.json();
  };

  findByFilter = async (payload: any) => {
    const response = await fetch(`${API_BASE_URL}${subject}/filter`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(payload),
    });

    return response.json();
  };

  remove = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}${subject}/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
    });

    return response.json();
  };
}
