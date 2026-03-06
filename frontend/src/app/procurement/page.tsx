"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useRole } from "@/lib/role-context";
import { DataTable } from "@/components/DataTable";

type PR = { id: string; itemId: string; quantity: string; status: string };
type PO = { id: string; orderDate: string; status: string; supplier?: { name: string } };

export default function ProcurementPage() {
  const { role } = useRole();
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
      requesterId: (form.elements.namedItem("requesterId") as HTMLInputElement).value,
      itemId: (form.elements.namedItem("itemId") as HTMLInputElement).value,
      quantity: (form.elements.namedItem("quantity") as HTMLInputElement).value,
    };
    const r = await api.procurement.createPR(body);
    const data = await r.json().catch(() => ({}));
    setResult(r.ok ? `PR creata: ${data.id || "OK"}` : `${r.status} ${await r.text()}`);
    if (r.ok && data.id) setPrId(data.id);
  }

  async function handleApprovePR() {
    if (!prId) return;
    const r = await api.procurement.approvePR(prId, role);
    setResult(r.ok ? "PR approvata" : `${r.status} ${await r.text()}`);
  }

  async function handleCreatePO(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = {
      supplierId: (form.elements.namedItem("supplierId") as HTMLInputElement).value,
      lines: [
        {
          itemId: (form.elements.namedItem("itemId") as HTMLInputElement).value,
          quantity: (form.elements.namedItem("quantity") as HTMLInputElement).value,
          unitPrice: (form.elements.namedItem("unitPrice") as HTMLInputElement).value,
        },
      ],
    };
    const r = await api.procurement.createPO(body, role);
    setPoResult(r.ok ? "PO creato" : `${r.status} ${await r.text()}`);
  }

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
            <input name="requesterId" placeholder="ID richiedente" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
            <input name="itemId" placeholder="ID articolo" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
            <input name="quantity" type="number" placeholder="Quantità" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
            <button type="submit" className="rounded bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-100 dark:text-zinc-900">
              Crea PR
            </button>
          </form>
          <div className="mt-4 flex gap-2">
            <input
              value={prId}
              onChange={(e) => setPrId(e.target.value)}
              placeholder="ID PR da approvare"
              className="flex-1 rounded border px-3 py-2 dark:bg-zinc-900"
            />
            <button
              onClick={handleApprovePR}
              className="rounded bg-amber-600 px-4 py-2 text-white hover:bg-amber-700"
            >
              Approva
            </button>
          </div>
          {result && <p className="mt-2 text-sm">{result}</p>}
        </section>
        <section className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="mb-4 font-semibold">Ordine di acquisto (PO)</h2>
          <form onSubmit={handleCreatePO} className="flex flex-col gap-3">
            <input name="supplierId" placeholder="ID fornitore" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
            <input name="itemId" placeholder="ID articolo" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
            <input name="quantity" type="number" placeholder="Quantità" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
            <input name="unitPrice" type="number" step="0.01" placeholder="Prezzo unitario" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
            <button type="submit" className="rounded bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-100 dark:text-zinc-900">
              Crea PO
            </button>
          </form>
          {poResult && <p className="mt-2 text-sm">{poResult}</p>}
        </section>
      </div>
    </div>
  );
}
