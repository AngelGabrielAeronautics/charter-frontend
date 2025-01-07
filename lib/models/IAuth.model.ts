import { ICompany } from "./ICompany";
import { IOperator } from "./IOperators";
import { IUser } from "./IUser";
import { INotify, IRedirect } from "./utility.model";

export interface IAuthState {
  email?: string;
  isAuthenticated: boolean;
  authenticatedUser?: IUser;
  updatingPassword: boolean;
  company?: ICompany;
  authenticating: boolean;
  resettingPassword: boolean;
  creatingAccount: boolean;
  hasError: boolean;
  errorMessage: string;
  operator?: IOperator;
  redirect: IRedirect;
  notify: INotify;
  success: {
    updatePassword: boolean,
    resetPassword: boolean,
    createAccount: boolean,
    authenticate: boolean,
    signOut: boolean,
  };
  loading: {
    updatePassword: boolean,
    resetPassword: boolean,
    createAccount: boolean,
    authenticate: boolean,
    signOut: boolean,
  };
  error: {
    updatePassword: string | null,
    resetPassword: string | null,
    createAccount: string | null,
    authenticate: string | null,
    signOut: string | null,
  };
}
