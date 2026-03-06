export default function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Dashboard
      </h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card title="Finance" href="/finance" />
        <Card title="Produzione" href="/production" />
        <Card title="Acquisti" href="/procurement" />
        <Card title="Magazzino" href="/warehouse" />
        <Card title="Logistica" href="/logistics" />
        <Card title="HR" href="/hr" />
        <Card title="Legal" href="/legal" />
        <Card title="Investimenti" href="/investments" />
        <Card title="AI Fatture" href="/ai" />
        <Card title="Report" href="/reports" />
      </div>
      <p className="mt-8 text-sm text-zinc-500 dark:text-zinc-400">
        Seleziona un modulo dalla barra laterale o dalla dashboard per iniziare.
        Usa il selettore &quot;Ruolo simulato&quot; per testare le autorizzazioni RBAC.
      </p>
    </div>
  );
}

function Card({
  title,
  href,
}: {
  title: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="block rounded-xl border border-zinc-200 p-6 transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-900/50"
    >
      <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
        {title}
      </h2>
    </a>
  );
}
