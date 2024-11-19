import { IAuditFields } from "./IAuditFields";
import { IUser } from "./IUser";
import { IAirport } from "./airport.model";

export interface IQuotationRequest {
  _id?: string;
  quotationRequestNumber: string; // e.g QR-20240716-010
  status: "Fulfilled" | "Pending" | "Quoted" | "Cancelled"; //To be confirmed by @Given
  departureAirport: IAirport;
  arrivalAirport: IAirport;
  dateOfDeparture: Date;
  timeOfDeparture: string;
  customer: IUser;
  numberOfPassengers: number;
  numberOfAdults: number;
  numberOfChildren: number;
  numberOfInfants: number;
  petsAllowed: boolean;
  smokingAllowed: boolean;
  auditFields: IAuditFields;
}

export interface IQuotationRequestUpdateDTO {
  status?: "Fulfilled" | "Pending" | "Quoted" | "Cancelled"; //To be confirmed by @Given
  departureAirport?: IAirport;
  arrivalAirport?: IAirport;
  dateOfDeparture?: Date;
  numberOfPassengers?: number;
  numberOfAdults?: number;
  numberOfChildren?: number;
  numberOfInfants?: number;
  petsAllowed?: boolean;
  smokingAllowed?: boolean;
  auditFields?: IAuditFields;
}
