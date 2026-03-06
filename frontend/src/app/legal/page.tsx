"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { today, addDays } from "@/lib/use-lookup-data";

type Contract = { code: string };

export default function LegalPage() {
  const [contractResult, setContractResult] = useState<string>("");
  const [caseResult, setCaseResult] = useState<string>("");
  const [contracts, setContracts] = useState<Contract[]>([]);

  const [suggestedCode, setSuggestedCode] = useState("");

  useEffect(() => {
    api.legal.listContracts().then(async (r) => {
      if (r.ok) {
        const list = await r.json();
        setContracts(list);
        const year = new Date().getFullYear();
        const nums = list.map((c: Contract) => {
          const m = c.code?.match(/CNT-\d{4}-(\d+)/);
          return m ? parseInt(m[1], 10) : 0;
        });
        const next = Math.max(0, ...nums) + 1;
        setSuggestedCode(`CNT-${year}-${String(next).padStart(3, "0")}`);
      }
    });
  }, []);

  async function handleContract(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const codeEl = form.elements.namedItem("code") as HTMLInputElement;
    const body = {
      code: (codeEl.value?.trim() || suggestedCode || `CNT-${new Date().getFullYear()}-001`),
      title: (form.elements.namedItem("title") as HTMLInputElement).value,
      startDate: (form.elements.namedItem("startDate") as HTMLInputElement).value,
      endDate: (form.elements.namedItem("endDate") as HTMLInputElement).value || undefined,
    };
    const r = await api.legal.createContract(body);
    if (r.ok) {
      toast.success("Contratto creato");
      setContracts((prev) => [...prev, { code: body.code }]);
    } else toast.error(`${r.status}`);
    setContractResult(r.ok ? "OK" : `${r.status} ${await r.text()}`);
  }

  async function handleCase(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = { title: (form.elements.namedItem("title") as HTMLInputElement).value };
    const r = await api.legal.createCase(body);
    if (r.ok) toast.success("Pratica creata");
    else toast.error(`${r.status}`);
    setCaseResult(r.ok ? "OK" : `${r.status} ${await r.text()}`);
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
            <input name="code" placeholder="Codice (auto)" key={suggestedCode} defaultValue={suggestedCode} className="rounded border px-3 py-2 dark:bg-zinc-900" title="Lasciare vuoto per generazione automatica" />
            <input name="title" placeholder="Titolo" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
            <input name="startDate" type="date" required defaultValue={today()} className="rounded border px-3 py-2 dark:bg-zinc-900" />
            <input name="endDate" type="date" placeholder="Data fine (opzionale)" defaultValue={addDays(today(), 365)} className="rounded border px-3 py-2 dark:bg-zinc-900" />
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
