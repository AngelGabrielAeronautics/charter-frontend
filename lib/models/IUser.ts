import { IAddress } from "./IAddress";
import { IFile } from "./file.model";

export interface IUser {
  country?: any;
  phoneNumber?: any;
  phone?: any;
  surname?: any;
  _id?: string;
  firstNames: string;
  lastName: string;
  displayName: string;
  email: string;
  fid?: string;
  photoUrl?: IFile;
  address?: IAddress;
  uid?: string;
  operatorId?: string;
  agencyId?: string;
  role?: "Client" | "Operator" | "Agency" | "Administrator" | "Super User";
  rolePermissions: string[];
}

export interface IUserUpdate {
  country?: any;
  phoneNumber?: any;
  surname?: any;
  firstNames?: string;
  lastName?: string;
  displayName?: string;
  email?: string;
  fid?: string;
  address?: IAddress;
  uid?: string;
  operatorId?: string;
  agencyId?: string;
  role?: "Client" | "Operator" | "Agency" | "Administrator" | "Super User";
  rolePermissions?: string[];
}
