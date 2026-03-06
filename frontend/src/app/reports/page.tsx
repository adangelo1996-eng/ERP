"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useRole } from "@/lib/role-context";

export default function ReportsPage() {
  const { role } = useRole();
  const [trialBalance, setTrialBalance] = useState<string>("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [budgetCc, setBudgetCc] = useState<string>("");
  const [budgetProj, setBudgetProj] = useState<string>("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [agingCustomers, setAgingCustomers] = useState<string>("");
  const [agingSuppliers, setAgingSuppliers] = useState<string>("");
  const [workingHours, setWorkingHours] = useState<string>("");

  async function fetchTrialBalance() {
    const r =
      from && to
        ? await api.reports.trialBalanceByPeriod(from, to, role)
        : await api.reports.trialBalance(role);
    if (r.ok) {
      const data = await r.json();
      setTrialBalance(JSON.stringify(data, null, 2));
    } else {
      setTrialBalance(`${r.status} ${await r.text()}`);
    }
  }

  async function fetchBudget() {
    const y = Number(year) || new Date().getFullYear();
    const [ccRes, projRes] = await Promise.all([
      api.reports.budgetByCostCenter(y, role),
      api.reports.budgetByProject(y, role),
    ]);
    if (ccRes.ok) {
      const data = await ccRes.json();
      setBudgetCc(JSON.stringify(data, null, 2));
    } else {
      setBudgetCc(`${ccRes.status} ${await ccRes.text()}`);
    }
    if (projRes.ok) {
      const data = await projRes.json();
      setBudgetProj(JSON.stringify(data, null, 2));
    } else {
      setBudgetProj(`${projRes.status} ${await projRes.text()}`);
    }
  }

  async function fetchAging() {
    const [custRes, suppRes] = await Promise.all([
      api.reports.agingCustomers(role),
      api.reports.agingSuppliers(role),
    ]);
    if (custRes.ok) {
      const data = await custRes.json();
      setAgingCustomers(JSON.stringify(data, null, 2));
    } else {
      setAgingCustomers(`${custRes.status} ${await custRes.text()}`);
    }
    if (suppRes.ok) {
      const data = await suppRes.json();
      setAgingSuppliers(JSON.stringify(data, null, 2));
    } else {
      setAgingSuppliers(`${suppRes.status} ${await suppRes.text()}`);
    }
  }

  async function fetchWorkingHours() {
    const r = await api.reports.workingHours(role);
    if (r.ok) {
      const data = await r.json();
      setWorkingHours(JSON.stringify(data, null, 2));
    } else {
      setWorkingHours(`${r.status} ${await r.text()}`);
    }
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Report
      </h1>
      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="mb-4 font-semibold">Trial Balance (Finance)</h2>
          <div className="mb-3 flex flex-col gap-2 sm:flex-row">
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="rounded border px-3 py-2 text-sm dark:bg-zinc-900"
            />
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="rounded border px-3 py-2 text-sm dark:bg-zinc-900"
            />
            <button
              onClick={fetchTrialBalance}
              className="rounded bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
            >
              Carica
            </button>
          </div>
          {trialBalance && (
            <pre className="mt-4 max-h-64 overflow-auto rounded border bg-zinc-50 p-3 text-xs dark:bg-zinc-900">
              {trialBalance}
            </pre>
          )}
        </section>

        <section className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="mb-4 font-semibold">Budget per centro di costo / progetto</h2>
          <div className="mb-3 flex items-center gap-2">
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-24 rounded border px-3 py-2 text-sm dark:bg-zinc-900"
            />
            <button
              onClick={fetchBudget}
              className="rounded bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
            >
              Carica
            </button>
          </div>
          {budgetCc && (
            <div className="mt-4">
              <h3 className="mb-1 text-xs font-semibold uppercase text-zinc-500">
                Cost Center
              </h3>
              <pre className="max-h-40 overflow-auto rounded border bg-zinc-50 p-3 text-xs dark:bg-zinc-900">
                {budgetCc}
              </pre>
            </div>
          )}
          {budgetProj && (
            <div className="mt-4">
              <h3 className="mb-1 text-xs font-semibold uppercase text-zinc-500">
                Progetti
              </h3>
              <pre className="max-h-40 overflow-auto rounded border bg-zinc-50 p-3 text-xs dark:bg-zinc-900">
                {budgetProj}
              </pre>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="mb-4 font-semibold">Aging clienti / fornitori</h2>
          <button
            onClick={fetchAging}
            className="rounded bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            Carica
          </button>
          {agingCustomers && (
            <div className="mt-4">
              <h3 className="mb-1 text-xs font-semibold uppercase text-zinc-500">
                Clienti
              </h3>
              <pre className="max-h-40 overflow-auto rounded border bg-zinc-50 p-3 text-xs dark:bg-zinc-900">
                {agingCustomers}
              </pre>
            </div>
          )}
          {agingSuppliers && (
            <div className="mt-4">
              <h3 className="mb-1 text-xs font-semibold uppercase text-zinc-500">
                Fornitori
              </h3>
              <pre className="max-h-40 overflow-auto rounded border bg-zinc-50 p-3 text-xs dark:bg-zinc-900">
                {agingSuppliers}
              </pre>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="mb-4 font-semibold">Ore per dipendente (HR)</h2>
          <button
            onClick={fetchWorkingHours}
            className="rounded bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            Carica
          </button>
          {workingHours && (
            <pre className="mt-4 max-h-64 overflow-auto rounded border bg-zinc-50 p-3 text-xs dark:bg-zinc-900">
              {workingHours}
            </pre>
          )}
        </section>
      </div>
    </div>
  );
}
