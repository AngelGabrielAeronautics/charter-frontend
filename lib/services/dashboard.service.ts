import axios from "axios";

import { eModules } from "@/lib/enums/modules.enums";

import BaseService from "./base.service";

export default class DashboardService extends BaseService {
  constructor(subject: eModules) {
    super(subject);
  }

  getOperatorDashboard = async (id: string) => {
    const response = await axios.get(
      `${this.baseUrl}/${this.subject}/operator/${id}`,
      {
        headers: this.headers,
      }
    );

    return response.data;
  };

  getAdminDashboard = async () => {
    const response = await axios.get(`${this.baseUrl}/${this.subject}/admin`, {
      headers: this.headers,
    });

    return response.data;
  };
}
