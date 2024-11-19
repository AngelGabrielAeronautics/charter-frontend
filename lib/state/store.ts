import { configureStore } from "@reduxjs/toolkit";

import AgencySlice from "./agency/slice";
import AssetsReducer from "./assets/assets.slice";
import AuditLogsReducer from "./auditLogs/auditlog.slice";
import AuthReducer from "./auth/auth.slice";
import BookingsReducer from "./bookings/bookings.slice";
import DashboardSlice from "./dashboard/slice";
import FlightsReducer from "./flights/flights.slice";
import InvoicesReducer from "./invoices/invoices.slice";
import OperatorsReducer from "./operators/operators.slice";
import QuotationRequestReducer from "./quotationRequests/quotationRequests.slice";
import QuotationsReducer from "./quotations/quotations.slice";
import RolesReducer from "./roles/roles.slice";
import RolePermissionSlice from "./slices/role-permission.slice";
import TicketSlice from "./tickets/slice";
import UsersReducer from "./users/users.slice";

export const store = configureStore({
  reducer: {
    auth: AuthReducer,
    assets: AssetsReducer,
    operators: OperatorsReducer,
    users: UsersReducer,
    flights: FlightsReducer,
    invoices: InvoicesReducer,
    quotationsRequests: QuotationRequestReducer,
    quotations: QuotationsReducer,
    bookings: BookingsReducer,
    auditLogs: AuditLogsReducer,
    roles: RolesReducer,
    tickets: TicketSlice,
    dashboard: DashboardSlice,
    rolePermissionState: RolePermissionSlice,
    agency: AgencySlice,
  },
});

export const makeStore = () => {
  return store;
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
