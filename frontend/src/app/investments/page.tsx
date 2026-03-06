"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function InvestmentsPage() {
  const [proposalResult, setProposalResult] = useState<string>("");
  const [proposalId, setProposalId] = useState("");
  const [scenarioResult, setScenarioResult] = useState<string>("");

  async function handleCreateProposal(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = {
      title: (form.elements.namedItem("title") as HTMLInputElement).value,
      sponsorArea: (form.elements.namedItem("sponsorArea") as HTMLInputElement).value,
    };
    const r = await api.investments.createProposal(body);
    const data = await r.json().catch(() => ({}));
    setProposalResult(r.ok ? `Proposta creata: ${data.id || "OK"}` : `${r.status} ${await r.text()}`);
    if (r.ok && data.id) setProposalId(data.id);
  }

  async function handleAddScenario(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const cashFlowsStr = (form.elements.namedItem("cashFlows") as HTMLInputElement).value;
    const cashFlows = cashFlowsStr.split(",").map((s) => parseFloat(s.trim())).filter((n) => !isNaN(n));
    const body = {
      proposalId: (form.elements.namedItem("proposalId") as HTMLInputElement).value || proposalId,
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      cashFlows,
      discountRate: parseFloat((form.elements.namedItem("discountRate") as HTMLInputElement).value) || 0.1,
    };
    const r = await api.investments.addScenario(body);
    setScenarioResult(r.ok ? "Scenario aggiunto" : `${r.status} ${await r.text()}`);
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Valutazione investimenti
      </h1>
      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="mb-4 font-semibold">Nuova proposta di investimento</h2>
          <form onSubmit={handleCreateProposal} className="flex flex-col gap-3">
            <input name="title" placeholder="Titolo" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
            <input name="sponsorArea" placeholder="Area sponsor" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
            <button type="submit" className="rounded bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-100 dark:text-zinc-900">
              Crea proposta
            </button>
          </form>
          {proposalResult && <p className="mt-2 text-sm">{proposalResult}</p>}
        </section>
        <section className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="mb-4 font-semibold">Aggiungi scenario (NPV/IRR)</h2>
          <form onSubmit={handleAddScenario} className="flex flex-col gap-3">
            <input
              name="proposalId"
              value={proposalId}
              onChange={(e) => setProposalId(e.target.value)}
              placeholder="ID proposta"
              className="rounded border px-3 py-2 dark:bg-zinc-900"
            />
            <input name="name" placeholder="Nome scenario" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
            <input
              name="cashFlows"
              placeholder="Flussi (es: -1000, 200, 300, 400)"
              className="rounded border px-3 py-2 dark:bg-zinc-900"
            />
            <input
              name="discountRate"
              type="number"
              step="0.01"
              placeholder="Tasso di sconto (es. 0.1)"
              defaultValue="0.1"
              className="rounded border px-3 py-2 dark:bg-zinc-900"
            />
            <button type="submit" className="rounded bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-100 dark:text-zinc-900">
              Aggiungi scenario
            </button>
          </form>
          {scenarioResult && <p className="mt-2 text-sm">{scenarioResult}</p>}
        </section>
      </div>
    </div>
  );
}
