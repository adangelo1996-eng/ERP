"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useRole } from "@/lib/role-context";
import { DataTable } from "@/components/DataTable";
import { useLookupData } from "@/lib/use-lookup-data";

type PR = { id: string; itemId: string; quantity: string; status: string };
type PO = { id: string; orderDate: string; status: string; supplier?: { name: string } };

export default function ProcurementPage() {
  const { role } = useRole();
  const lookup = useLookupData();
  const [result, setResult] = useState<string>("");
  const [prId, setPrId] = useState("");
  const [poResult, setPoResult] = useState("");
  const [prs, setPrs] = useState<PR[]>([]);
  const [pos, setPos] = useState<PO[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.procurement.listPurchaseRequests(),
      api.procurement.listPurchaseOrders(),
    ]).then(async ([r1, r2]) => {
      if (r1.ok) setPrs(await r1.json());
      if (r2.ok) setPos(await r2.json());
      setLoading(false);
    });
  }, []);

  async function handleCreatePR(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = {
      requesterId: (form.elements.namedItem("requesterId") as HTMLSelectElement).value,
      itemId: (form.elements.namedItem("itemId") as HTMLSelectElement).value,
      quantity: (form.elements.namedItem("quantity") as HTMLInputElement).value,
    };
    const r = await api.procurement.createPR(body);
    const data = await r.json().catch(() => ({}));
    if (r.ok) {
      toast.success("PR creata");
      setPrId(data.id || "");
      api.procurement.listPurchaseRequests().then(async (r2) => {
        if (r2.ok) setPrs(await r2.json());
      });
    } else toast.error(`${r.status}`);
    setResult(r.ok ? "OK" : `${r.status} ${await r.text()}`);
  }

  async function handleApprovePR() {
    if (!prId) return;
    const r = await api.procurement.approvePR(prId, role);
    if (r.ok) {
      toast.success("PR approvata");
      setPrs((prev) => prev.map((p) => (p.id === prId ? { ...p, status: "APPROVED" } : p)));
    } else toast.error(`${r.status}`);
    setResult(r.ok ? "OK" : `${r.status} ${await r.text()}`);
  }

  async function handleCreatePO(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = {
      supplierId: (form.elements.namedItem("supplierId") as HTMLSelectElement).value,
      lines: [
        {
          itemId: (form.elements.namedItem("itemId") as HTMLSelectElement).value,
          quantity: (form.elements.namedItem("quantity") as HTMLInputElement).value,
          unitPrice: (form.elements.namedItem("unitPrice") as HTMLInputElement).value,
        },
      ],
    };
    const r = await api.procurement.createPO(body, role);
    if (r.ok) toast.success("PO creato");
    else toast.error(`${r.status}`);
    setPoResult(r.ok ? "OK" : `${r.status} ${await r.text()}`);
  }

  const submittedPRs = prs.filter((p) => p.status === "SUBMITTED");

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Ufficio Acquisti
      </h1>
      <div className="mb-8 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 font-semibold">Richieste di acquisto</h2>
          {loading ? (
            <p className="text-zinc-500">Caricamento...</p>
          ) : (
            <DataTable
              columns={[
                { key: "id", label: "ID", render: (r) => r.id.slice(0, 8) },
                { key: "itemId", label: "Articolo" },
                { key: "quantity", label: "Quantità" },
                { key: "status", label: "Stato" },
              ]}
              data={prs}
              emptyMessage="Nessuna richiesta."
            />
          )}
        </section>
        <section>
          <h2 className="mb-4 font-semibold">Ordini di acquisto</h2>
          {loading ? (
            <p className="text-zinc-500">Caricamento...</p>
          ) : (
            <DataTable
              columns={[
                { key: "id", label: "ID", render: (r) => r.id.slice(0, 8) },
                { key: "supplier", label: "Fornitore", render: (r) => r.supplier?.name ?? "-" },
                { key: "orderDate", label: "Data" },
                { key: "status", label: "Stato" },
              ]}
              data={pos}
              emptyMessage="Nessun ordine."
            />
          )}
        </section>
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="mb-4 font-semibold">Richiesta di acquisto (PR)</h2>
          <form onSubmit={handleCreatePR} className="flex flex-col gap-3">
            <select name="requesterId" required className="rounded border px-3 py-2 dark:bg-zinc-900" disabled={lookup.loading}>
              <option value="">Richiedente</option>
              {lookup.employees.map((e) => (
                <option key={e.id} value={e.id}>{e.code} – {e.fullName}</option>
              ))}
            </select>
            <select name="itemId" required className="rounded border px-3 py-2 dark:bg-zinc-900" disabled={lookup.loading}>
              <option value="">Articolo</option>
              {lookup.items.map((i) => (
                <option key={i.id} value={i.itemId}>{i.itemId}</option>
              ))}
            </select>
            <input name="quantity" type="number" placeholder="Quantità" min="1" defaultValue="1" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
            <button type="submit" className="rounded bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-100 dark:text-zinc-900" disabled={lookup.loading}>
              Crea PR
            </button>
          </form>
          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">Approva PR</label>
            <div className="flex gap-2">
              <select
                value={prId}
                onChange={(e) => setPrId(e.target.value)}
                className="flex-1 rounded border px-3 py-2 dark:bg-zinc-900"
              >
                <option value="">Seleziona PR in attesa</option>
                {submittedPRs.map((p) => (
                  <option key={p.id} value={p.id}>{p.itemId} × {p.quantity} – {p.id.slice(0, 8)}</option>
                ))}
              </select>
              <button onClick={handleApprovePR} disabled={!prId} className="rounded bg-amber-600 px-4 py-2 text-white hover:bg-amber-700 disabled:opacity-50">
                Approva
              </button>
            </div>
          </div>
          {result && <p className="mt-2 text-sm">{result}</p>}
        </section>
        <section className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="mb-4 font-semibold">Ordine di acquisto (PO)</h2>
          <form onSubmit={handleCreatePO} className="flex flex-col gap-3">
            <select name="supplierId" required className="rounded border px-3 py-2 dark:bg-zinc-900" disabled={lookup.loading}>
              <option value="">Fornitore</option>
              {lookup.suppliers.map((s) => (
                <option key={s.id} value={s.id}>{s.code} – {s.name}</option>
              ))}
            </select>
            <select name="itemId" required className="rounded border px-3 py-2 dark:bg-zinc-900" disabled={lookup.loading}>
              <option value="">Articolo</option>
              {lookup.items.map((i) => (
                <option key={i.id} value={i.itemId}>{i.itemId}</option>
              ))}
            </select>
            <input name="quantity" type="number" placeholder="Quantità" min="1" defaultValue="1" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
            <input name="unitPrice" type="number" step="0.01" placeholder="Prezzo unitario" defaultValue="10" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
            <button type="submit" className="rounded bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-100 dark:text-zinc-900" disabled={lookup.loading}>
              Crea PO
            </button>
          </form>
          {poResult && <p className="mt-2 text-sm">{poResult}</p>}
        </section>
      </div>
    </div>
  );
}
