"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useRole } from "@/lib/role-context";
import { DataTable } from "@/components/DataTable";

type MO = { id: string; quantity: string; dueDate: string; status: string; item?: { itemId: string } };

export default function ProductionPage() {
  const router = useRouter();
  const { role } = useRole();
  const [result, setResult] = useState<string>("");
  const [moId, setMoId] = useState("");
  const [mos, setMos] = useState<MO[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.production.listMOs(undefined, role).then(async (r) => {
      if (r.ok) setMos(await r.json());
      setLoading(false);
    });
  }, [role]);

  async function handleCreateMO(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = {
      itemId: (form.elements.namedItem("itemId") as HTMLInputElement).value,
      quantity: (form.elements.namedItem("quantity") as HTMLInputElement).value,
      dueDate: (form.elements.namedItem("dueDate") as HTMLInputElement).value,
    };
    const r = await api.production.createMO(body, role);
    const data = await r.json().catch(() => ({}));
    setResult(r.ok ? `MO creato: ${data.id || "OK"}` : `${r.status} ${await r.text()}`);
    if (r.ok && data.id) setMoId(data.id);
  }

  async function handleRelease() {
    if (!moId) return;
    const r = await api.production.releaseMO(moId);
    setResult(r.ok ? "MO rilasciato" : `${r.status} ${await r.text()}`);
  }

  async function handleComplete() {
    if (!moId) return;
    const r = await api.production.completeMO(moId);
    setResult(r.ok ? "MO completato" : `${r.status} ${await r.text()}`);
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Produzione
      </h1>
      <section className="mb-8">
        <h2 className="mb-4 font-semibold">Ordini di produzione</h2>
        {loading ? (
          <p className="text-zinc-500">Caricamento...</p>
        ) : (
          <DataTable
            columns={[
              { key: "id", label: "ID", render: (r) => r.id.slice(0, 8) },
              { key: "item", label: "Articolo", render: (r) => r.item?.itemId ?? "-" },
              { key: "quantity", label: "Quantità" },
              { key: "dueDate", label: "Scadenza" },
              { key: "status", label: "Stato" },
            ]}
            data={mos}
            onRowClick={(r) => router.push(`/production/${r.id}`)}
            emptyMessage="Nessun ordine di produzione."
          />
        )}
      </section>
      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="mb-4 font-semibold">Nuovo ordine di produzione (MO)</h2>
          <form onSubmit={handleCreateMO} className="flex flex-col gap-3">
            <input name="itemId" placeholder="ID articolo" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
            <input name="quantity" type="number" placeholder="Quantità" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
            <input name="dueDate" type="date" placeholder="Data consegna" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
            <button type="submit" className="rounded bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-100 dark:text-zinc-900">
              Crea MO
            </button>
          </form>
        </section>
        <section className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="mb-4 font-semibold">Azioni MO</h2>
          <input
            value={moId}
            onChange={(e) => setMoId(e.target.value)}
            placeholder="ID ordine di produzione"
            className="mb-3 w-full rounded border px-3 py-2 dark:bg-zinc-900"
          />
          <div className="flex gap-2">
            <button
              onClick={handleRelease}
              className="rounded bg-amber-600 px-4 py-2 text-white hover:bg-amber-700"
            >
              Rilascia
            </button>
            <button
              onClick={handleComplete}
              className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
            >
              Completa
            </button>
          </div>
        </section>
      </div>
      {result && <p className="mt-4 text-sm">{result}</p>}
    </div>
  );
}
