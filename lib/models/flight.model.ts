import { IAddress } from "@/lib/models/IAddress";
import { IAuditFields } from "@/lib/models/IAuditFields";
import { IAirport } from "@/lib/models/airport.model";
import { IContactDetails } from "@/lib/models/contact.model";
import { IMoney } from "@/lib/models/money.model";
import { INote } from "@/lib/models/notes.model";
import { IPerson } from "@/lib/models/person.model";

export interface IFlight {
  [key: string]: any; // Add this index signature to allow dynamic string indexing
  _id?: string;
  airline: string;
  capacity: number;
  departure: Date;
  duration: number;
  flightNumber?: string;
  departureAirport: IAirport;
  arrivalAirport: IAirport;
  status: string;
  aircraftId: string;
  aircraftManufacturer: string;
  aircraftModel: string;
  aircraftRegistrationNumber: string;
  arrivalDate: Date;
  arrivalMeetingArea: string;
  arrivalMeetingTime: string;
  durationMinutes: number;
  flexibleDate: boolean;
  flexibleDepartureTime: boolean;
  flexibleRouting: boolean;
  checklist?: IFlightChecklist;
  notes?: INote[];
  luggageWeightUnits: "kgs" | "lbs";
  maxLuggagePerPerson: number;
  maxSeatsAvailable: number;
  meetingArea: string;
  meetingTime: Date;
  offerExpiryHoursPriorToFlight: number;
  operatorId: string;
  passengers: IPassenger[];
  pricePerSeat: number; // With platform fee
  totalFlightPrice?: number;
  pricePerSeatWithPlatformFee?: number;
  quotationId?: string;
  auditFields: IAuditFields;
  petsAllowed: boolean;
}

export interface IPassenger extends IPerson {
  paid: boolean;
}

export interface IFlightChecklist {
  adminNotes: INote[];
  aircraftBooked: boolean;
  airportHandler: boolean;
  allPaymentsReceived: boolean;
  arrivalAndIndemnity: boolean;
  catering: boolean;
  crewAccommodation: boolean;
  issuedAllTickets?: boolean;
  roadShuttle: boolean;
  supplierPaid: boolean; // Has the operator been paid
}
