import { InvoiceSettingType } from "@/app/types/models/invoice";

export const invoiceSettings: InvoiceSettingType = {
  general: {
    agencyName: "Charter Market",
    streetName: "Street Name",
    state: "State",
    zipCode: "4739",
    country: "Jersy",
  },
  accounting: {
    bankName: "FNB",
    countryOfBank: "South Africa",
    accountNumber: "123456789",
    swiftBic: "JKJGH77",
    ifsc: "839810839283",
    accountHolder: "Charter Market Limited",
  },
  invoicing: {
    email: "ruben@levaretech.com",
    logo: "/images/logo_blue.svg",
  },
};
