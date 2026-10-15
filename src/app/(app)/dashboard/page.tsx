import Link from "next/link";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { getDashboardData } from "@/lib/queries";
import { formatBRL, formatTime } from "@/lib/format";
import { APPOINTMENT_STATUSES, FUNNEL_STAGES, labelOf } from "@/lib/constants";
import { Badge, Card, PageHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export default async function DashboardPage() {
  const ctx = await requireSession();
  if (!ctx) redirect("/login");
  const data = await getDashboardData(ctx.user.companyId);
  const maxFunnel = Math.max(...data.funnel.map((f) => f.count), 1);
  const todayLabel = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());
  const firstName = ctx.user.name.split(" ")[0];

  return (
    <div>
      <PageHeader
        title={`${greeting()}, ${firstName}`}
        subtitle={`Hoje é ${todayLabel}. Comece pelo que pede resposta — números vêm depois.`}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button href="/whatsapp" variant="secondary">
              Abrir WhatsApp
            </Button>
            <Button href="/orcamentos/novo">Novo orçamento</Button>
          </div>
        }
      />

      <section className="border border-line bg-surface p-6">
        <p className="text-[11px] uppercase tracking-[0.18em] text-copper">Comece por aqui</p>
        <h2 className="mt-2 font-serif text-3xl tracking-tight">O que a manhã pede</h2>
        <ol className="mt-6 divide-y divide-line">
          {data.alerts.length === 0 ? (
            <li className="py-3 text-sm text-muted">Nada urgente. Olhe a agenda e o inbox.</li>
          ) : (
            data.alerts.map((a, i) => (
              <li key={a.text}>
                <Link
                  href={a.href}
                  className="flex items-baseline justify-between gap-4 py-3 text-sm transition hover:text-brand-2"
                >
                  <span>
                    <span className="mr-3 font-serif text-lg text-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {a.text}
                  </span>
                  <span className="shrink-0 text-xs uppercase tracking-[0.14em] text-brand-2">
                    Resolver
                  </span>
                </Link>
              </li>
            ))
          )}
          {data.unreadInbox > 0 ? (
            <li>
              <Link
                href="/whatsapp"
                className="flex items-baseline justify-between gap-4 py-3 text-sm transition hover:text-brand-2"
              >
                <span>
                  <span className="mr-3 font-serif text-lg text-muted">
                    {String(data.alerts.length + 1).padStart(2, "0")}
                  </span>
                  {data.unreadInbox} conversas com mensagem não lida
                </span>
                <span className="shrink-0 text-xs uppercase tracking-[0.14em] text-brand-2">
                  Inbox
                </span>
              </Link>
            </li>
          ) : null}
        </ol>
      </section>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="p-6">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="font-serif text-2xl tracking-tight">Agenda de hoje</h2>
              <p className="mt-1 text-sm text-muted">Horário, profissional, status.</p>
            </div>
            <Badge tone="brand">{data.todayAppointments.length}</Badge>
          </div>
          <div className="mt-5 divide-y divide-line">
            {data.todayAppointments.length === 0 ? (
              <p className="py-3 text-sm text-muted">Nenhum horário hoje.</p>
            ) : (
              data.todayAppointments.map((a) => (
                <div key={a.id} className="flex items-start justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-medium">{a.title}</p>
                    <p className="text-xs text-muted">
                      {a.professional?.name ?? "Equipe"} · {labelOf(APPOINTMENT_STATUSES, a.status)}
                    </p>
                  </div>
                  <span className="font-serif text-lg">{formatTime(a.startsAt)}</span>
                </div>
              ))
            )}
          </div>
          <Link href="/agenda" className="ink-link mt-4 inline-block text-sm text-brand-2">
            Agenda completa
          </Link>
        </Card>

        <Card className="p-6">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="font-serif text-2xl tracking-tight">Funil</h2>
              <p className="mt-1 text-sm text-muted">Clique para abrir os leads da etapa.</p>
            </div>
            <Link href="/leads" className="ink-link text-sm text-brand-2">
              Pipeline
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {data.funnel.map((step) => {
              const meta = FUNNEL_STAGES.find((s) => s.id === step.stage);
              return (
                <Link key={step.stage} href="/leads" className="block">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium">{meta?.label ?? step.stage}</span>
                    <span className="text-muted">
                      {step.count} · {formatBRL(step.value ?? 0)}
                    </span>
                  </div>
                  <div className="h-px bg-bg-2">
                    <div
                      className="h-px bg-brand"
                      style={{ width: `${Math.max(8, (step.count / maxFunnel) * 100)}%` }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>
      </div>

      <dl className="mt-6 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["/leads", "Leads novos", String(data.kpis.newLeads), `${data.kpis.attendingLeads} em atendimento`],
          ["/orcamentos", "Orçamentos abertos", String(data.kpis.quotesSent), `${data.kpis.quotesWaiting} aguardando`],
          ["/financeiro", "Receita do mês", formatBRL(data.kpis.revenueMonth), `${formatBRL(data.kpis.toReceive)} a receber`],
          ["/recuperacao", "Sem retorno", String(data.kpis.inactiveCustomers), "Há mais de 30 dias"],
        ].map(([href, label, value, hint]) => (
          <Link key={label} href={href} className="bg-surface p-5 transition hover:bg-bg">
            <dt className="text-[11px] uppercase tracking-[0.14em] text-muted">{label}</dt>
            <dd className="mt-2 font-serif text-3xl tracking-tight">{value}</dd>
            <dd className="mt-1 text-xs text-muted">{hint}</dd>
          </Link>
        ))}
      </dl>
    </div>
  );
}
