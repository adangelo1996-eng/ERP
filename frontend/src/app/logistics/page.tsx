"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

type PO = { id: string; orderDate: string; status: string; supplier?: { name: string } };

export default function LogisticsPage() {
  const [result, setResult] = useState<string>("");
  const [pos, setPos] = useState<PO[]>([]);

  useEffect(() => {
    api.procurement.listPurchaseOrders().then(async (r) => {
      if (r.ok) setPos(await r.json());
    });
  }, []);

  async function handleCreateShipment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = {
      orderId: (form.elements.namedItem("orderId") as HTMLSelectElement).value,
    };
    const r = await api.logistics.createShipment(body);
    if (r.ok) toast.success("Spedizione creata");
    else toast.error(`${r.status}`);
    setResult(r.ok ? "OK" : `${r.status} ${await r.text()}`);
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Logistica
      </h1>
      <section className="max-w-md rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
        <h2 className="mb-4 font-semibold">Nuova spedizione</h2>
        <form onSubmit={handleCreateShipment} className="flex flex-col gap-3">
          {pos.length > 0 ? (
            <select name="orderId" required className="rounded border px-3 py-2 dark:bg-zinc-900">
              <option value="">Ordine da spedire</option>
              {pos.map((po) => (
                <option key={po.id} value={po.id}>{po.supplier?.name ?? "?"} – {po.orderDate}</option>
              ))}
            </select>
          ) : (
            <input name="orderId" placeholder="Riferimento ordine (es. ORD-2025-001)" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
          )}
          <button type="submit" className="rounded bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-100 dark:text-zinc-900">
            Crea spedizione
          </button>
        </form>
        {result && <p className="mt-2 text-sm">{result}</p>}
      </section>
    </div>
  );
}
