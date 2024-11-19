import { API_BASE_URL } from "@/app/(config)/constants";

import { IAuditFields } from "../models";
import { IUser } from "../models/IUser";

export async function getUserByFID(fid: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/fid/${fid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const user = await response.json();
    return user;
  } catch (error) {
    return false;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/email/${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const user = await response.json();
    return user;
  } catch (error) {
    return false;
  }
}

export interface ICreateUserDto {
  firstNames?: string;
  lastName?: string;
  displayName?: string;
  email: string;
  operatorId?: string;
  phoneNumber?: string;
  provider?: string;
  fid: string;
  auditFields: IAuditFields;
}

export const createUser = async (
  userData: ICreateUserDto
): Promise<IUser | false> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const user = await response.json();
    return user;
  } catch (error) {
    return false;
  }
};

export const createFederatedUser = async (
  userData: ICreateUserDto
): Promise<IUser | false> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/federated`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const user = await response.json();
    return user;
  } catch (error) {
    return false;
  }
};
