import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarDays,
  MessageCircle,
  Receipt,
  Repeat2,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { requireSession } from "@/lib/auth";
import { getDashboardData } from "@/lib/queries";
import { formatBRL, formatDate, formatTime } from "@/lib/format";
import { APPOINTMENT_STATUSES, FUNNEL_STAGES, LEAD_STAGES, labelOf, QUOTE_STATUSES } from "@/lib/constants";
import { Badge, Card, PageHeader, StatCard } from "@/components/ui/card";
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

  return (
    <div>
      <PageHeader
        title={`${greeting()}, ${ctx.user.name.split(" ")[0]}`}
        subtitle={`Hoje é ${todayLabel}. O Studio Bella tem ${data.kpis.todayAppointments} horários, ${data.kpis.quotesWaiting} orçamentos esperando resposta e ${data.unreadInbox} conversas não lidas.`}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button href="/leads" variant="secondary">Novo lead</Button>
            <Button href="/orcamentos/novo">Novo orçamento</Button>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          href="/leads"
          label="Leads novos"
          value={data.kpis.newLeads}
          hint={`${data.kpis.attendingLeads} em atendimento`}
          icon={<Users size={14} />}
        />
        <StatCard
          href="/orcamentos"
          label="Orçamentos enviados"
          value={data.kpis.quotesSent}
          hint={`${data.kpis.quotesWaiting} aguardando`}
          icon={<Receipt size={14} />}
        />
        <StatCard
          href="/financeiro"
          label="Receita do mês"
          value={formatBRL(data.kpis.revenueMonth)}
          hint={`${formatBRL(data.kpis.toReceive)} a receber`}
          icon={<Wallet size={14} />}
        />
        <StatCard
          href="/recuperacao"
          label="Sem retorno"
          value={data.kpis.inactiveCustomers}
          hint="Há mais de 30 dias"
          icon={<Repeat2 size={14} />}
        />
        <StatCard
          href="/relatorios"
          label="Conversão"
          value={`${data.kpis.conversion}%`}
          hint={`${data.kpis.wonLeads} vendas no mês`}
          icon={<TrendingUp size={14} />}
        />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-serif text-2xl tracking-tight">Funil comercial</h2>
              <p className="mt-1 text-sm text-muted">
                Quantidade e valor estimado em cada etapa — clique para abrir os leads.
              </p>
            </div>
            <Link href="/leads" className="text-sm text-brand">
              Abrir pipeline
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
                  <div className="h-2.5 rounded-full bg-bg-2">
                    <div
                      className="h-2.5 rounded-full bg-brand"
                      style={{ width: `${Math.max(8, (step.count / maxFunnel) * 100)}%` }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <h2 className="font-serif text-2xl tracking-tight">Atenção necessária</h2>
            <div className="mt-4 space-y-2">
              {data.alerts.length === 0 ? (
                <p className="text-sm text-muted">Nada urgente no momento.</p>
              ) : (
                data.alerts.map((a) => (
                  <Link
                    key={a.text}
                    href={a.href}
                    className="block rounded-2xl border border-line bg-bg px-3 py-3 text-sm transition hover:border-copper/40"
                  >
                    {a.text}
                  </Link>
                ))
              )}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">Agenda de hoje</h2>
              <Badge tone="brand">{data.todayAppointments.length}</Badge>
            </div>
            <div className="mt-4 space-y-3">
              {data.todayAppointments.length === 0 ? (
                <p className="text-sm text-muted">Nenhum horário hoje.</p>
              ) : (
                data.todayAppointments.map((a) => (
                  <div key={a.id} className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">{a.title}</p>
                      <p className="text-xs text-muted">
                        {a.professional?.name ?? "Equipe"} · {labelOf(APPOINTMENT_STATUSES, a.status)}
                      </p>
                    </div>
                    <span className="text-sm text-brand">{formatTime(a.startsAt)}</span>
                  </div>
                ))
              )}
            </div>
            <Link href="/agenda" className="mt-4 inline-flex items-center gap-2 text-sm text-brand">
              <CalendarDays size={14} />
              Ver agenda completa
            </Link>
          </Card>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Leads recentes</h2>
            <Link href="/leads" className="text-xs text-brand">
              Ver todos
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {data.recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{lead.name}</p>
                  <p className="text-xs text-muted">{lead.owner?.name ?? "Sem dono"}</p>
                </div>
                <Badge>{labelOf(LEAD_STAGES, lead.stage)}</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Orçamentos</h2>
            <Link href="/orcamentos" className="text-xs text-brand">
              Ver todos
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {data.recentQuotes.map((quote) => (
              <Link key={quote.id} href={`/orcamentos/${quote.id}`} className="block">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{quote.number}</p>
                    <p className="text-xs text-muted">
                      {quote.customer?.name ?? quote.lead?.name ?? "Sem cliente"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{formatBRL(quote.total)}</p>
                    <p className="text-[11px] text-muted">
                      {labelOf(QUOTE_STATUSES, quote.status)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Tarefas abertas</h2>
            <Link href="/tarefas" className="text-xs text-brand">
              Ver todas
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {data.openTasks.length === 0 ? (
              <p className="text-sm text-muted">Nada pendente.</p>
            ) : (
              data.openTasks.map((task) => (
                <div key={task.id}>
                  <p className="text-sm font-medium">{task.title}</p>
                  <p className="text-xs text-muted">
                    {task.owner?.name ?? "Equipe"} · {formatDate(task.dueDate)}
                  </p>
                </div>
              ))
            )}
          </div>
          <Link href="/whatsapp" className="mt-4 inline-flex items-center gap-2 text-sm text-brand">
            <MessageCircle size={14} />
            {data.unreadInbox} conversas com não lidas
          </Link>
        </Card>
      </div>
    </div>
  );
}
