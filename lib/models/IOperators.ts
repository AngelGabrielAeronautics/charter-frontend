import { IAddress } from "./IAddress";
import { IAuditFields } from "./IAuditFields";
import { IFile, IFileInfo } from "./file.model";
import { IPerson } from "./person.model";

export interface IOperator {
  _id?: string;
  logo?: IFile;
  airline: string;
  registrationNumber: string;
  operatorCode: string;
  country: string;
  email: string;
  phone: string;
  vatNumber?: string;
  aocNumber: string;
  address: IAddress;
  status: "Unverified" | "Verified";
  vettingStatus?: IVettingStatus;
  profileCompletePercentage: number;
  responsiblePerson: IContactPerson;
  bankingDetails: IBankingDetails;
  accountingResponsiblePerson: IContactPerson;
  certifications: ICertifications;
  acceptedTermsAndConditions: boolean;
  cancellationPolicy: string;
  refundPolicy: string;
  termsAndConditions: IFile;
  auditFields: IAuditFields;
}

export interface ICertifications {
  airOperatingCertificate: IFile;
  certificateOfInsurance: IFile;
  certificateOfAirworthiness: IFile;
}

export interface IContactPerson extends IPerson {
  email: string;
  phone: string;
  country: string;
}

export interface IBankingDetails {
  name: string;
  accountHolder: string;
  accountNumber: string;
  accountType: string;
  branchCode: string;
  accountConfirmationLetter?: IFile;
}

export interface IVettingStatus {
  companyDetails: ESectionVettingStatus;
  documentation: ESectionVettingStatus;
  termsAndConditions: ESectionVettingStatus;
}

export enum ESectionVettingStatus {
  "approved",
  "rejected",
  "pending"
}
