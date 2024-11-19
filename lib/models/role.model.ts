export interface IRolePermission {
  _id?: string;
  name: string;
  description?: string;
  modules: IModulePermission[];
  organisation: string;
}

export interface IModulePermission {
  name?: string;
  key?: string;
  module?: string;
  manage: boolean;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  permissions: IAppPermission[];
}

export enum IAppPermission {
  Manage = "manage",
  Create = "create",
  Read = "read",
  Update = "update",
  Delete = "delete",
}
