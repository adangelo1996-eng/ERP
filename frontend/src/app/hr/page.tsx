"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useRole } from "@/lib/role-context";
import { DataTable } from "@/components/DataTable";

type Employee = { id: string; code: string; fullName: string; email: string };
type TimeEntry = { id: string; clockIn: string; clockOut?: string; status: string; employee?: { fullName: string } };

export default function HrPage() {
  const { role } = useRole();
  const [result, setResult] = useState<string>("");
  const [employeeResult, setEmployeeResult] = useState("");
  const [timeEntryId, setTimeEntryId] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.hr.listEmployees(role),
      api.hr.listTimeEntries(),
    ]).then(async ([r1, r2]) => {
      if (r1.ok) setEmployees(await r1.json());
      if (r2.ok) setTimeEntries(await r2.json());
      setLoading(false);
    });
  }, [role]);

  async function handleRecordTime(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = {
      employeeId: (form.elements.namedItem("employeeId") as HTMLInputElement).value,
      clockIn: (form.elements.namedItem("clockIn") as HTMLInputElement).value,
      clockOut: (form.elements.namedItem("clockOut") as HTMLInputElement).value || undefined,
    };
    const r = await api.hr.recordTimeEntry(body);
    const data = await r.json().catch(() => ({}));
    setResult(r.ok ? `Timbratura registrata: ${data.id || "OK"}` : `${r.status} ${await r.text()}`);
    if (r.ok && data.id) setTimeEntryId(data.id);
  }

  async function handleCreateEmployee(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = {
      code: (form.elements.namedItem("code") as HTMLInputElement).value,
      fullName: (form.elements.namedItem("fullName") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
    };
    const r = await api.hr.createEmployee(body, role);
    if (r.ok) {
      const data = await r.json();
      setEmployees((prev) => [...prev, { ...body, id: data.id }]);
      setEmployeeResult("Dipendente creato");
    } else {
      setEmployeeResult(`${r.status} ${await r.text()}`);
    }
  }

  async function handleApproveTimeEntry() {
    if (!timeEntryId) return;
    const r = await api.hr.approveTimeEntry(timeEntryId);
    setResult(r.ok ? "Timbratura approvata" : `${r.status} ${await r.text()}`);
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        HR – Timbrature e Smartworking
      </h1>
      <div className="mb-8 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 font-semibold">Dipendenti</h2>
          {loading ? (
            <p className="text-zinc-500">Caricamento...</p>
          ) : (
            <DataTable
              columns={[
                { key: "code", label: "Codice" },
                { key: "fullName", label: "Nome" },
                { key: "email", label: "Email" },
              ]}
              data={employees}
              emptyMessage="Nessun dipendente."
            />
          )}
        </section>
        <section>
          <h2 className="mb-4 font-semibold">Timbrature</h2>
          {loading ? (
            <p className="text-zinc-500">Caricamento...</p>
          ) : (
            <DataTable
              columns={[
                { key: "employee", label: "Dipendente", render: (r) => r.employee?.fullName ?? "-" },
                { key: "clockIn", label: "Entrata", render: (r) => new Date(r.clockIn).toLocaleString() },
                { key: "status", label: "Stato" },
              ]}
              data={timeEntries}
              emptyMessage="Nessuna timbratura."
            />
          )}
        </section>
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="mb-4 font-semibold">Registra timbratura</h2>
          <form onSubmit={handleRecordTime} className="flex flex-col gap-3">
            <select name="employeeId" required className="rounded border px-3 py-2 dark:bg-zinc-900">
              <option value="">Seleziona dipendente</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>{e.fullName} ({e.code})</option>
              ))}
            </select>
            <input name="clockIn" type="datetime-local" placeholder="Entrata" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
            <input name="clockOut" type="datetime-local" placeholder="Uscita (opzionale)" className="rounded border px-3 py-2 dark:bg-zinc-900" />
            <button type="submit" className="rounded bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-100 dark:text-zinc-900">
              Registra
            </button>
          </form>
          <div className="mt-4 flex gap-2">
            <input
              value={timeEntryId}
              onChange={(e) => setTimeEntryId(e.target.value)}
              placeholder="ID timbratura da approvare"
              className="flex-1 rounded border px-3 py-2 dark:bg-zinc-900"
            />
            <button
              onClick={handleApproveTimeEntry}
              className="rounded bg-amber-600 px-4 py-2 text-white hover:bg-amber-700"
            >
              Approva
            </button>
          </div>
          {result && <p className="mt-2 text-sm">{result}</p>}
        </section>
        <section className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="mb-4 font-semibold">Nuovo dipendente</h2>
          <form onSubmit={handleCreateEmployee} className="flex flex-col gap-3">
            <input name="code" placeholder="Codice" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
            <input name="fullName" placeholder="Nome completo" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
            <input name="email" type="email" placeholder="Email" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
            <button type="submit" className="rounded bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-100 dark:text-zinc-900">
              Crea dipendente
            </button>
          </form>
          {employeeResult && <p className="mt-2 text-sm">{employeeResult}</p>}
        </section>
      </div>
    </div>
  );
}
