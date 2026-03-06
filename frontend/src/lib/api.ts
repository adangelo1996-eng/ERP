const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("erp_token");
}

export type Role =
  | "FINANCE_MANAGER"
  | "PRODUCTION_PLANNER"
  | "PROCUREMENT_MANAGER"
  | "HR_MANAGER"
  | "ADMIN";

async function fetchApi(
  path: string,
  opts: RequestInit & { role?: Role } = {}
): Promise<Response> {
  const { role, ...init } = opts;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };
  const token = getToken();
  if (token) (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  else if (role) (headers as Record<string, string>)["x-role"] = role;

  const url = `${API_BASE}${path}`;

  try {
    return await fetch(url, { ...init, headers });
  } catch (error) {
    // #region agent log
    fetch("http://127.0.0.1:7391/ingest/bf8fa4ff-2012-4fab-b5ac-55db3c69fdbd", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "6f9075",
      },
      body: JSON.stringify({
        sessionId: "6f9075",
        runId: "fetch-failure",
        hypothesisId: "H1-H5",
        location: "src/lib/api.ts:27",
        message: "fetchApi failed",
        data: {
          url,
          hasToken: !!token,
          hasRole: !!role,
          method: init.method || "GET",
          errorMessage: (error as Error)?.message,
          apiBase: API_BASE,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    throw error;
  }
}

export const api = {
  finance: {
    listLedgers: () => fetchApi("/finance/ledgers"),
    listAccounts: () => fetchApi("/finance/accounts"),
    listJournalEntries: (role?: Role) => fetchApi("/finance/journal-entries", { role }),
    listSupplierInvoices: () => fetchApi("/finance/supplier-invoices"),
    listCustomerInvoices: () => fetchApi("/finance/customer-invoices"),
    listPayments: () => fetchApi("/finance/payments"),
    initDemo: () => fetchApi("/finance/init-demo", { method: "POST" }),
    postJournalEntry: (body: object, role?: Role) =>
      fetchApi("/finance/journal-entries", { method: "POST", body: JSON.stringify(body), role }),
    registerSupplierInvoice: (body: object) =>
      fetchApi("/finance/supplier-invoices", { method: "POST", body: JSON.stringify(body) }),
    recordPayment: (body: object) =>
      fetchApi("/finance/payments", { method: "POST", body: JSON.stringify(body) }),
  },
  production: {
    listItems: (role?: Role) => fetchApi("/production/items", { role }),
    listMOs: (status?: string, role?: Role) =>
      fetchApi(`/production/mos${status ? `?status=${status}` : ""}`, { role }),
    getMO: (id: string, role?: Role) => fetchApi(`/production/mos/${id}`, { role }),
    createMO: (body: object, role?: Role) =>
      fetchApi("/production/mos", { method: "POST", body: JSON.stringify(body), role }),
    releaseMO: (id: string) => fetchApi(`/production/mos/${id}/release`, { method: "PATCH" }),
    completeMO: (id: string) => fetchApi(`/production/mos/${id}/complete`, { method: "PATCH" }),
  },
  procurement: {
    listPurchaseRequests: () => fetchApi("/procurement/purchase-requests"),
    listPurchaseOrders: () => fetchApi("/procurement/purchase-orders"),
    listSuppliers: () => fetchApi("/procurement/suppliers"),
    createPR: (body: { requesterId: string; itemId: string; quantity: string }) =>
      fetchApi("/procurement/purchase-requests", { method: "POST", body: JSON.stringify(body) }),
    approvePR: (id: string, role?: Role) =>
      fetchApi(`/procurement/purchase-requests/${id}/approve`, { method: "PATCH", role }),
    createPO: (body: object, role?: Role) =>
      fetchApi("/procurement/purchase-orders", { method: "POST", body: JSON.stringify(body), role }),
  },
  hr: {
    listEmployees: (role?: Role) => fetchApi("/hr/employees", { role }),
    listTimeEntries: (employeeId?: string) =>
      fetchApi(`/hr/time-entries${employeeId ? `?employeeId=${employeeId}` : ""}`),
    listSmartworkingSessions: (employeeId?: string) =>
      fetchApi(`/hr/smartworking-sessions${employeeId ? `?employeeId=${employeeId}` : ""}`),
    listLeaveRequests: () => fetchApi("/hr/leave-requests"),
    recordTimeEntry: (body: { employeeId: string; clockIn: string; clockOut?: string }) =>
      fetchApi("/hr/time-entries", { method: "POST", body: JSON.stringify(body) }),
    createEmployee: (body: { code: string; fullName: string; email: string }, role?: Role) =>
      fetchApi("/hr/employees", { method: "POST", body: JSON.stringify(body), role }),
    approveTimeEntry: (id: string) =>
      fetchApi(`/hr/time-entries/${id}/approve`, { method: "PATCH" }),
  },
  warehouse: {
    listWarehouses: () => fetchApi("/warehouse/warehouses"),
    listLocations: (warehouse?: string) =>
      fetchApi(`/warehouse/locations${warehouse ? `?warehouse=${warehouse}` : ""}`),
    listStock: (warehouse?: string, item?: string) => {
      const params = new URLSearchParams();
      if (warehouse) params.set("warehouse", warehouse);
      if (item) params.set("item", item);
      return fetchApi(`/warehouse/stock${params.toString() ? "?" + params : ""}`);
    },
    listMovements: (type?: string) =>
      fetchApi(`/warehouse/movements${type ? `?type=${type}` : ""}`),
    receive: (body: {
      warehouseCode: string;
      locationCode: string;
      itemId: string;
      quantity: string;
      batch?: string;
    }) => fetchApi("/warehouse/receipts", { method: "POST", body: JSON.stringify(body) }),
  },
  logistics: {
    listShipments: () => fetchApi("/logistics/shipments"),
    createShipment: (body: { orderId: string }) =>
      fetchApi("/logistics/shipments", { method: "POST", body: JSON.stringify(body) }),
  },
  legal: {
    listContracts: () => fetchApi("/legal/contracts"),
    listCases: () => fetchApi("/legal/cases"),
    createContract: (body: { code: string; title: string; startDate: string; endDate?: string }) =>
      fetchApi("/legal/contracts", { method: "POST", body: JSON.stringify(body) }),
    createCase: (body: { title: string }) =>
      fetchApi("/legal/cases", { method: "POST", body: JSON.stringify(body) }),
  },
  investments: {
    listProposals: () => fetchApi("/investments"),
    listScenarios: (proposalId: string) => fetchApi(`/investments/${proposalId}/scenarios`),
    createProposal: (body: { title: string; sponsorArea: string }) =>
      fetchApi("/investments", { method: "POST", body: JSON.stringify(body) }),
    addScenario: (body: {
      proposalId: string;
      name: string;
      cashFlows: number[];
      discountRate: number;
    }) => fetchApi("/investments/scenarios", { method: "POST", body: JSON.stringify(body) }),
  },
  ai: {
    listRawInvoices: (role?: Role) => fetchApi("/ai/raw-invoices", { role }),
    listDecisionLogs: (role?: Role) => fetchApi("/ai/decision-logs", { role }),
    importFromXml: (xml: string, role?: Role) =>
      fetchApi("/ai/invoices/import-xml", { method: "POST", body: JSON.stringify({ xml }), role }),
    syncFromCassetto: (count?: number, role?: Role) =>
      fetchApi("/ai/invoices/sync", { method: "POST", body: JSON.stringify({ count }), role }),
    setDecisionFeedback: (id: string, feedback: "CORRECT" | "INCORRECT", role?: Role) =>
      fetchApi(`/ai/decision-logs/${id}/feedback`, { method: "PATCH", body: JSON.stringify({ feedback }), role }),
    importAndAutoRegister: (body: object, role?: Role) =>
      fetchApi("/ai/invoices/import-and-auto-register", {
        method: "POST",
        body: JSON.stringify(body),
        role,
      }),
  },
  reports: {
    trialBalance: (role?: Role) =>
      fetchApi("/reports/finance/trial-balance", { role }),
    trialBalanceByPeriod: (from: string, to: string, role?: Role) =>
      fetchApi(
        `/reports/finance/trial-balance?from=${encodeURIComponent(from)}&to=${encodeURIComponent(
          to,
        )}`,
        { role },
      ),
    budgetByCostCenter: (year: number, role?: Role) =>
      fetchApi(`/reports/finance/budget-by-cost-center?year=${year}`, { role }),
    budgetByProject: (year: number, role?: Role) =>
      fetchApi(`/reports/finance/budget-by-project?year=${year}`, { role }),
    agingCustomers: (role?: Role) =>
      fetchApi("/reports/finance/aging-customers", { role }),
    agingSuppliers: (role?: Role) =>
      fetchApi("/reports/finance/aging-suppliers", { role }),
    workingHours: (role?: Role) =>
      fetchApi("/reports/hr/working-hours", { role }),
  },
  approvals: {
    listPending: (role?: Role) => fetchApi("/approvals/pending", { role }),
    approve: (body: { contextType: string; contextId: string; approvedBy: string }, role?: Role) =>
      fetchApi("/approvals/approve", { method: "PATCH", body: JSON.stringify(body), role }),
  },
};
