"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useRole } from "@/lib/role-context";

export default function AiInvoicesPage() {
  const { role } = useRole();
  const [result, setResult] = useState<string>("");

  async function handleImportAndAutoRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const amount = (form.elements.namedItem("amount") as HTMLInputElement).value;
    const body = {
      externalId: `SDI-${Date.now()}`,
      supplierId: (form.elements.namedItem("supplierId") as HTMLInputElement).value,
      invoiceDate: (form.elements.namedItem("invoiceDate") as HTMLInputElement).value,
      dueDate: (form.elements.namedItem("dueDate") as HTMLInputElement).value,
      currency: "EUR",
      lines: [
        {
          itemId: "SRV-001",
          description: "Servizio (da cassetto fiscale)",
          quantity: "1",
          unitPrice: amount,
          taxRate: "22",
        },
      ],
    };
    const r = await api.ai.importAndAutoRegister(body, role);
    if (r.ok) {
      const data = await r.json();
      setResult(
        `Importata. Auto-registrata: ${data.autoApplied ? "SÌ" : "NO"} (confidence: ${data.confidence})`
      );
    } else {
      setResult(`${r.status} ${await r.text()}`);
    }
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        AI – Registrazione automatica fatture
      </h1>
      <p className="mb-6 text-zinc-600 dark:text-zinc-400">
        Simula l&apos;import da cassetto fiscale: le fatture sotto soglia vengono
        auto-registrate; le altre restano in attesa di approvazione.
      </p>
      <section className="max-w-md rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
        <h2 className="mb-4 font-semibold">Importa e auto-registra fattura</h2>
        <form onSubmit={handleImportAndAutoRegister} className="flex flex-col gap-3">
          <input
            name="supplierId"
            placeholder="ID fornitore"
            required
            className="rounded border px-3 py-2 dark:bg-zinc-900"
          />
          <input
            name="invoiceDate"
            type="date"
            required
            className="rounded border px-3 py-2 dark:bg-zinc-900"
          />
          <input
            name="dueDate"
            type="date"
            required
            className="rounded border px-3 py-2 dark:bg-zinc-900"
          />
          <input
            name="amount"
            type="number"
            step="0.01"
            placeholder="Importo netto"
            required
            className="rounded border px-3 py-2 dark:bg-zinc-900"
          />
          <button
            type="submit"
            className="rounded bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            Importa e processa
          </button>
        </form>
        {result && <p className="mt-2 text-sm">{result}</p>}
      </section>
    </div>
  );
}
