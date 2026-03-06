"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useLookupData } from "@/lib/use-lookup-data";

export default function WarehousePage() {
  const lookup = useLookupData();
  const [result, setResult] = useState<string>("");
  const [locations, setLocations] = useState<{ id: string; code: string }[]>([]);
  const [selectedWh, setSelectedWh] = useState("");

  useEffect(() => {
    setLocations(lookup.locations);
    if (lookup.warehouses.length > 0 && !selectedWh) setSelectedWh(lookup.warehouses[0].code);
  }, [lookup.warehouses, lookup.locations, lookup.loading]);

  useEffect(() => {
    if (selectedWh) {
      api.warehouse.listLocations(selectedWh).then(async (r) => {
        if (r.ok) setLocations(await r.json());
      });
    }
  }, [selectedWh]);

  async function handleReceive(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = {
      warehouseCode: (form.elements.namedItem("warehouse") as HTMLSelectElement).value,
      locationCode: (form.elements.namedItem("location") as HTMLSelectElement).value,
      itemId: (form.elements.namedItem("itemId") as HTMLSelectElement).value,
      quantity: (form.elements.namedItem("quantity") as HTMLInputElement).value,
      batch: (form.elements.namedItem("batch") as HTMLInputElement).value || undefined,
    };
    const r = await api.warehouse.receive(body);
    if (r.ok) toast.success("Ricevuta registrata");
    else toast.error(`${r.status}`);
    setResult(r.ok ? "OK" : `${r.status} ${await r.text()}`);
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Magazzino (WMS)
      </h1>
      <section className="max-w-md rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
        <h2 className="mb-4 font-semibold">Ricevimento merci</h2>
        <form onSubmit={handleReceive} className="flex flex-col gap-3">
          <select name="warehouse" required value={selectedWh} onChange={(e) => setSelectedWh(e.target.value)} className="rounded border px-3 py-2 dark:bg-zinc-900" disabled={lookup.loading}>
            <option value="">Magazzino</option>
            {lookup.warehouses.map((w) => (
              <option key={w.id} value={w.code}>{w.code} – {w.name}</option>
            ))}
          </select>
          <select name="location" required className="rounded border px-3 py-2 dark:bg-zinc-900" disabled={lookup.loading || !selectedWh}>
            <option value="">Ubicazione</option>
            {locations.map((l) => (
              <option key={l.id} value={l.code}>{l.code}</option>
            ))}
          </select>
          <select name="itemId" required className="rounded border px-3 py-2 dark:bg-zinc-900" disabled={lookup.loading}>
            <option value="">Articolo</option>
            {lookup.items.map((i) => (
              <option key={i.id} value={i.itemId}>{i.itemId}</option>
            ))}
          </select>
          <input name="quantity" type="number" placeholder="Quantità" min="1" defaultValue="1" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
          <input name="batch" placeholder="Lotto (opzionale)" className="rounded border px-3 py-2 dark:bg-zinc-900" />
          <button type="submit" className="rounded bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-100 dark:text-zinc-900" disabled={lookup.loading}>
            Registra ricevimento
          </button>
        </form>
        {result && <p className="mt-2 text-sm">{result}</p>}
      </section>
    </div>
  );
}
