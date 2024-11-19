export interface IDashboardStats {
  assets: {
    drafts: number;
    active: number;
    total: number;
    draft: number;
    published: number;
    operational: number;
  };
  deadLegs: {
    offered: number;
    cancelled: number;
    expired: number;
    ready: number;
    completed: number;
    total: number;
  };
  quotations: {
    accepted: number;
    submitted: number;
    rejected: number;
    total: number;
  };
  quotationRequests: {
    fulfilled: number;
    pending: number;
    quoted: number;
    cancelled: number;
    total: number;
    rejected: number;
  };
  bookings: {
    pending: number;
    invoiced: number;
    paid: number;
    cancelled: number;
    total: number;
  };
  operators: {
    verified: number;
    unverified: number;
    total: number;
  };
}
