import { API_BASE_URL } from "@/app/(config)/constants";

import { eModules } from "../enums/modules.enums";
import { getHeaders } from "../helpers/cookies.helpers";

const userHeaders = getHeaders();

export default class BaseService {
  constructor(subject: eModules) {
    this.subject = subject;
  }

  subject: string;
  baseUrl = API_BASE_URL;
  headers = {
    "Content-Type": "application/json",
    ...userHeaders,
  };
}
