import { IAuditFields } from "./IAuditFields";
import { IUser } from "./IUser";
import { IAirport } from "./airport.model";

export interface IQuotationRequest {
  _id?: string;
  quotationRequestNumber?: string; // e.g QR-20240716-010
  customerId?: string;
  numberOfPassengers: IPassengerCount;
  trip: ITripLeg[]
  petsAllowed: boolean;
  smokingAllowed: boolean;
  status?: "Fulfilled" | "Pending" | "Quoted" | "Cancelled"; //To be confirmed by @Given
  auditFields?: IAuditFields;
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

export interface ITripLeg {
  departureAirport: IAirport;
  arrivalAirport: IAirport;
  dateOfDeparture: Date;
  timeOfDeparture: string | null | undefined;
}

export interface IPassengerCount {
  total: number;
  adults: number;
  children: number;
  infants: number;
}
