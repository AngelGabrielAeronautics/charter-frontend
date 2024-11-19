export interface IPerson {
  firstNames: string;
  lastName: string;
  fullNames?: string;
  idNumber?: string;
  passportNumber?: string;
  gender?: "male" | "female";
}
