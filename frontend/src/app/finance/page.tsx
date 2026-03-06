"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useRole } from "@/lib/role-context";
import { DataTable } from "@/components/DataTable";

type Ledger = { id: string; name: string };
type Account = { id: string; code: string; name: string };
type JournalEntry = { id: string; postingDate: string; reference: string; source: string };
type SupplierInvoice = { id: string; supplierId: string; invoiceDate: string; totalNet: string; status: string };
type Payment = { id: string; counterpartyId: string; paymentDate: string; amount: string };

type Tab = "entries" | "invoices" | "payments" | "forms";

export default function FinancePage() {
  const { role } = useRole();
  const [tab, setTab] = useState<Tab>("entries");
  const [ledgers, setLedgers] = useState<Ledger[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [supplierInvoices, setSupplierInvoices] = useState<SupplierInvoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [journalResult, setJournalResult] = useState<string>("");
  const [supplierResult, setSupplierResult] = useState<string>("");
  const [paymentResult, setPaymentResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.finance.listLedgers().then(async (r) => {
      if (r.ok) setLedgers(await r.json());
    });
    api.finance.listAccounts().then(async (r) => {
      if (r.ok) setAccounts(await r.json());
    });
  }, []);

  useEffect(() => {
    if (tab === "entries") {
      setLoading(true);
      api.finance.listJournalEntries(role).then(async (r) => {
        if (r.ok) setJournalEntries(await r.json());
        setLoading(false);
      });
    } else if (tab === "invoices") {
      setLoading(true);
      api.finance.listSupplierInvoices().then(async (r) => {
        if (r.ok) setSupplierInvoices(await r.json());
        setLoading(false);
      });
    } else if (tab === "payments") {
      setLoading(true);
      api.finance.listPayments().then(async (r) => {
        if (r.ok) setPayments(await r.json());
        setLoading(false);
      });
    }
  }, [tab, role]);

  async function handleInitDemo() {
    const r = await api.finance.initDemo();
    if (r.ok) {
      const { ledger, accounts: a } = await r.json();
      setLedgers([ledger]);
      setAccounts(a);
      setJournalResult("Dati demo inizializzati");
    }
  }

  async function handleJournal(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const amount = (form.elements.namedItem("amount") as HTMLInputElement).value;
    const debitId = (form.elements.namedItem("debitAccount") as HTMLSelectElement).value;
    const creditId = (form.elements.namedItem("creditAccount") as HTMLSelectElement).value;
    const body = {
      ledgerId: (form.elements.namedItem("ledger") as HTMLSelectElement).value,
      postingDate: (form.elements.namedItem("date") as HTMLInputElement).value,
      reference: (form.elements.namedItem("reference") as HTMLInputElement).value || "MAN",
      source: "MANUAL",
      lines: [
        { accountId: debitId, debit: amount, credit: "0", description: "Scrittura manuale" },
        { accountId: creditId, debit: "0", credit: amount, description: "Scrittura manuale" },
      ],
    };
    const r = await api.finance.postJournalEntry(body, role);
    if (r.ok) {
      toast.success("Scrittura registrata");
      setTab("entries");
    } else toast.error(`Errore: ${r.status} ${await r.text()}`);
    setJournalResult(r.ok ? "OK" : `${r.status} ${await r.text()}`);
  }

  async function handleSupplierInvoice(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const amount = (form.elements.namedItem("amount") as HTMLInputElement).value;
    const taxRate = "22";
    const tax = (parseFloat(amount) * 0.22).toFixed(2);
    const body = {
      supplierId: (form.elements.namedItem("supplierId") as HTMLInputElement).value,
      invoiceDate: (form.elements.namedItem("invoiceDate") as HTMLInputElement).value,
      dueDate: (form.elements.namedItem("dueDate") as HTMLInputElement).value,
      currency: "EUR",
      totalNet: amount,
      totalTax: tax,
      status: "REGISTERED",
      lines: [
        {
          itemId: "SRV-001",
          description: "Servizio",
          quantity: "1",
          unitPrice: amount,
          taxRate,
        },
      ],
    };
    const r = await api.finance.registerSupplierInvoice(body);
    if (r.ok) {
      toast.success("Fattura registrata");
      setTab("invoices");
    } else toast.error(`Errore: ${r.status} ${await r.text()}`);
    setSupplierResult(r.ok ? "OK" : `${r.status} ${await r.text()}`);
  }

  async function handlePayment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = {
      counterpartyId: (form.elements.namedItem("invoiceId") as HTMLInputElement).value,
      direction: "OUTBOUND" as const,
      paymentDate: (form.elements.namedItem("date") as HTMLInputElement).value,
      currency: "EUR",
      amount: (form.elements.namedItem("amount") as HTMLInputElement).value,
      relatedInvoiceId: (form.elements.namedItem("invoiceId") as HTMLInputElement).value,
    };
    const r = await api.finance.recordPayment(body);
    if (r.ok) {
      toast.success("Pagamento registrato");
      setTab("payments");
    } else toast.error(`Errore: ${r.status} ${await r.text()}`);
    setPaymentResult(r.ok ? "OK" : `${r.status} ${await r.text()}`);
  }

  const tabs = [
    { id: "entries" as Tab, label: "Registrazioni" },
    { id: "invoices" as Tab, label: "Fatture fornitore" },
    { id: "payments" as Tab, label: "Pagamenti" },
    { id: "forms" as Tab, label: "Nuove operazioni" },
  ];

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Finance
      </h1>
      <div className="mb-6 flex gap-2 border-b border-zinc-200 dark:border-zinc-800">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium ${
              tab === t.id
                ? "border-b-2 border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === "entries" && (
        <section>
          <h2 className="mb-4 font-semibold">Scritture contabili</h2>
          {loading ? (
            <p className="text-zinc-500">Caricamento...</p>
          ) : (
            <DataTable
              columns={[
                { key: "postingDate", label: "Data" },
                { key: "reference", label: "Riferimento" },
                { key: "source", label: "Origine" },
              ]}
              data={journalEntries}
              emptyMessage="Nessuna registrazione. Inizializza demo e crea scritture da 'Nuove operazioni'."
            />
          )}
        </section>
      )}
      {tab === "invoices" && (
        <section>
          <h2 className="mb-4 font-semibold">Fatture fornitore</h2>
          {loading ? (
            <p className="text-zinc-500">Caricamento...</p>
          ) : (
            <DataTable
              columns={[
                { key: "supplierId", label: "Fornitore" },
                { key: "invoiceDate", label: "Data" },
                { key: "totalNet", label: "Importo netto" },
                { key: "status", label: "Stato" },
              ]}
              data={supplierInvoices}
              emptyMessage="Nessuna fattura."
            />
          )}
        </section>
      )}
      {tab === "payments" && (
        <section>
          <h2 className="mb-4 font-semibold">Pagamenti</h2>
          {loading ? (
            <p className="text-zinc-500">Caricamento...</p>
          ) : (
            <DataTable
              columns={[
                { key: "counterpartyId", label: "Controparte" },
                { key: "paymentDate", label: "Data" },
                { key: "amount", label: "Importo" },
              ]}
              data={payments}
              emptyMessage="Nessun pagamento."
            />
          )}
        </section>
      )}
      {tab === "forms" && (
        <>
      {ledgers.length === 0 && (
        <p className="mb-4 text-sm text-amber-600 dark:text-amber-400">
          Nessun piano dei conti. Clicca &quot;Inizializza demo&quot; per creare ledger e conti.
        </p>
      )}
      <button
        onClick={handleInitDemo}
        className="mb-6 rounded bg-amber-600 px-4 py-2 text-white hover:bg-amber-700"
      >
        Inizializza demo
      </button>
      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="mb-4 font-semibold">Scrittura contabile</h2>
          <form onSubmit={handleJournal} className="flex flex-col gap-3">
            <select name="ledger" required className="rounded border px-3 py-2 dark:bg-zinc-900">
              <option value="">Seleziona ledger</option>
              {ledgers.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
            <input name="date" type="date" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
            <input name="reference" placeholder="Riferimento" className="rounded border px-3 py-2 dark:bg-zinc-900" />
            <select name="debitAccount" required className="rounded border px-3 py-2 dark:bg-zinc-900">
              <option value="">Conto dare</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>{a.code} - {a.name}</option>
              ))}
            </select>
            <select name="creditAccount" required className="rounded border px-3 py-2 dark:bg-zinc-900">
              <option value="">Conto avere</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>{a.code} - {a.name}</option>
              ))}
            </select>
            <input name="amount" type="number" placeholder="Importo" step="0.01" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
            <button type="submit" className="rounded bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-100 dark:text-zinc-900">
              Registra
            </button>
          </form>
          {journalResult && <p className="mt-2 text-sm">{journalResult}</p>}
        </section>
        <section className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="mb-4 font-semibold">Fattura fornitore</h2>
          <form onSubmit={handleSupplierInvoice} className="flex flex-col gap-3">
            <input name="supplierId" placeholder="ID fornitore" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
            <input name="invoiceDate" type="date" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
            <input name="dueDate" type="date" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
            <input name="amount" type="number" placeholder="Importo" step="0.01" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
            <button type="submit" className="rounded bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-100 dark:text-zinc-900">
              Registra fattura
            </button>
          </form>
          {supplierResult && <p className="mt-2 text-sm">{supplierResult}</p>}
        </section>
        <section className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800 lg:col-span-2">
          <h2 className="mb-4 font-semibold">Pagamento</h2>
          <form onSubmit={handlePayment} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <input name="invoiceId" placeholder="ID fattura fornitore" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
            <input name="amount" type="number" placeholder="Importo" step="0.01" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
            <input name="date" type="date" required className="rounded border px-3 py-2 dark:bg-zinc-900" />
            <button type="submit" className="rounded bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-100 dark:text-zinc-900">
              Registra pagamento
            </button>
          </form>
          {paymentResult && <p className="mt-2 text-sm">{paymentResult}</p>}
        </section>
      </div>
        </>
      )}
    </div>
  );
}
