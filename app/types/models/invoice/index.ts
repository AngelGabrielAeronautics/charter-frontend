export type InvoiceType = {
  id: number;
  clientId: string;
  clientName: string;
  inum: string;
  idt: string;
  dueDate: string;
  amount: number;
  tax: number;
  taxType: string;
  conclusionText: string;
  folderValue: number;
  currency?: InvoiceCurrencyType;
  items: InvoiceItemType[];
};

export type InvoiceItemType = {
  age?: number;
  id: number;
  name?: string;
  description: string;
  duration?: {
    from: string;
    to: string;
  };
  quantity: {
    type: string;
    value: number;
  };
  unitPrice: number;
  total: number;
};

export type InvoiceCurrencyType = {
  currency: string;
  language: string;
};

export type ClientType = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  mail: string;
  steetName: string;
  zipCode: string;
  city: string;
  state: string;
  country: string;
  vatId: string;
  taxId: string;
  phone?: string;
  link?: string;
  logo: string;
};

export type InvoiceSettingType = {
  general: InvoiceSettingItem;
  accounting: InvoiceSettingItem;
  invoicing: InvoiceSettingItem;
};

export type InvoiceSettingItem = {
  [key: string]: string;
};

export type InvFolderType = {
  id: number;
  name: string;
  alias: string;
  icon: string;
};
