"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useRole } from "@/lib/role-context";

type MO = {
  id: string;
  quantity: string;
  dueDate: string;
  status: string;
  item?: { itemId: string };
};

export default function MODetailPage() {
  const params = useParams();
  const router = useRouter();
  const { role } = useRole();
  const [mo, setMo] = useState<MO | null>(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState("");

  useEffect(() => {
    const id = params?.id as string;
    if (!id) return;
    api.production.getMO(id, role).then(async (r) => {
      if (r.ok) setMo(await r.json());
      setLoading(false);
    });
  }, [params?.id, role]);

  async function handleRelease() {
    if (!mo) return;
    const r = await api.production.releaseMO(mo.id);
    setResult(r.ok ? "MO rilasciato" : `${r.status} ${await r.text()}`);
    if (r.ok) setMo({ ...mo, status: "RELEASED" });
  }

  async function handleComplete() {
    if (!mo) return;
    const r = await api.production.completeMO(mo.id);
    setResult(r.ok ? "MO completato" : `${r.status} ${await r.text()}`);
    if (r.ok) setMo({ ...mo, status: "COMPLETED" });
  }

  if (loading) return <div className="p-8">Caricamento...</div>;
  if (!mo) return <div className="p-8">Ordine non trovato.</div>;

  return (
    <div className="p-8">
      <Link
        href="/production"
        className="mb-4 inline-block text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        ← Torna alla lista
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Ordine di produzione {mo.id.slice(0, 8)}
      </h1>
      <div className="mb-6 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
        <dl className="grid gap-2 sm:grid-cols-2">
          <dt className="text-zinc-500">Articolo</dt>
          <dd>{mo.item?.itemId ?? "-"}</dd>
          <dt className="text-zinc-500">Quantità</dt>
          <dd>{mo.quantity}</dd>
          <dt className="text-zinc-500">Scadenza</dt>
          <dd>{mo.dueDate}</dd>
          <dt className="text-zinc-500">Stato</dt>
          <dd>
            <span
              className={`rounded px-2 py-1 text-sm ${
                mo.status === "COMPLETED"
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                  : mo.status === "RELEASED"
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                    : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
              }`}
            >
              {mo.status}
            </span>
          </dd>
        </dl>
      </div>
      <div className="flex gap-2">
        {mo.status === "PLANNED" && (
          <button
            onClick={handleRelease}
            className="rounded bg-amber-600 px-4 py-2 text-white hover:bg-amber-700"
          >
            Rilascia
          </button>
        )}
        {(mo.status === "RELEASED" || mo.status === "IN_PROGRESS") && (
          <button
            onClick={handleComplete}
            className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
          >
            Completa
          </button>
        )}
      </div>
      {result && <p className="mt-2 text-sm">{result}</p>}
    </div>
  );
}
