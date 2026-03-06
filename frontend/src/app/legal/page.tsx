"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function LegalPage() {
  const [contractResult, setContractResult] = useState<string>("");
  const [caseResult, setCaseResult] = useState<string>("");

  async function handleContract(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = {
      code: (form.elements.namedItem("code") as HTMLInputElement).value,
      title: (form.elements.namedItem("title") as HTMLInputElement).value,
      startDate: (form.elements.namedItem("startDate") as HTMLInputElement).value,
      endDate: (form.elements.namedItem("endDate") as HTMLInputElement).value || undefined,
    };
    const r = await api.legal.createContract(body);
    setContractResult(r.ok ? "Contratto creato" : `${r.status} ${await r.text()}`);
  }

  async function handleCase(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = {
      title: (form.elements.namedItem("title") as HTMLInputElement).value,
    };
    const r = await api.legal.createCase(body);
    setCaseResult(r.ok ? "Pratica creata" : `${r.status} ${await r.text()}`);
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Legal & Compliance
      </h1>
      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="mb-4 font-semibold">Nuovo contratto</h2>
          <form onSubmit={handleContract} className="flex flex-col gap-3">
            <input name="code" placeholder="Codice contratto" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
            <input name="title" placeholder="Titolo" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
            <input name="startDate" type="date" placeholder="Data inizio" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
            <input name="endDate" type="date" placeholder="Data fine (opzionale)" className="rounded border px-3 py-2 dark:bg-zinc-900" />
            <button type="submit" className="rounded bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-100 dark:text-zinc-900">
              Crea contratto
            </button>
          </form>
          {contractResult && <p className="mt-2 text-sm">{contractResult}</p>}
        </section>
        <section className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="mb-4 font-semibold">Nuova pratica legale</h2>
          <form onSubmit={handleCase} className="flex flex-col gap-3">
            <input name="title" placeholder="Titolo pratica" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
            <button type="submit" className="rounded bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-100 dark:text-zinc-900">
              Crea pratica
            </button>
          </form>
          {caseResult && <p className="mt-2 text-sm">{caseResult}</p>}
        </section>
      </div>
    </div>
  );
}
