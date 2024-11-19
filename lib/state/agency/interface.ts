import { IAgency } from "@/lib/models";

export interface IAgencyState {
  records: IAgency[];
  selectedOperator?: IAgency;
  loading: {
    getRecord: boolean;
    listRecords: boolean;
    createRecord: boolean;
    updateRecord: boolean;
    removeRecord: boolean;
  };
  success: {
    getRecord: any;
    listRecords: any;
    createRecord: any;
    updateRecord: any;
    removeRecord: any;
  };
  error: {
    getRecord: any;
    listRecords: any;
    createRecord: any;
    updateRecord: any;
    removeRecord: any;
  };
}
