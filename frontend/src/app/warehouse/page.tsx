"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function WarehousePage() {
  const [result, setResult] = useState<string>("");

  async function handleReceive(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = {
      warehouseCode: (form.elements.namedItem("warehouse") as HTMLInputElement).value,
      locationCode: (form.elements.namedItem("location") as HTMLInputElement).value,
      itemId: (form.elements.namedItem("itemId") as HTMLInputElement).value,
      quantity: (form.elements.namedItem("quantity") as HTMLInputElement).value,
      batch: (form.elements.namedItem("batch") as HTMLInputElement).value || undefined,
    };
    const r = await api.warehouse.receive(body);
    setResult(r.ok ? "Ricevuta registrata" : `${r.status} ${await r.text()}`);
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Magazzino (WMS)
      </h1>
      <section className="max-w-md rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
        <h2 className="mb-4 font-semibold">Ricevimento merci</h2>
        <form onSubmit={handleReceive} className="flex flex-col gap-3">
          <input name="warehouse" placeholder="Codice magazzino" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
          <input name="location" placeholder="Codice ubicazione" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
          <input name="itemId" placeholder="ID articolo" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
          <input name="quantity" type="number" placeholder="Quantità" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
          <input name="batch" placeholder="Lotto (opzionale)" className="rounded border px-3 py-2 dark:bg-zinc-900" />
          <button type="submit" className="rounded bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-100 dark:text-zinc-900">
            Registra ricevimento
          </button>
        </form>
        {result && <p className="mt-2 text-sm">{result}</p>}
      </section>
    </div>
  );
}
