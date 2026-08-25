import Link from "next/link";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { getDashboardData } from "@/lib/queries";
import { formatBRL, formatTime } from "@/lib/format";
import { APPOINTMENT_STATUSES, FUNNEL_STAGES, labelOf } from "@/lib/constants";
import { Badge, Card, PageHeader } from "@/components/ui/card";

export default async function DashboardPage() {
  const ctx = await requireSession();
  if (!ctx) redirect("/login");
  const data = await getDashboardData(ctx.user.companyId);
  const maxFunnel = Math.max(...data.funnel.map((f) => f.count), 1);

  const kpis = [
    { label: "Leads novos", value: data.kpis.newLeads, href: "/leads" },
    { label: "Em atendimento", value: data.kpis.attendingLeads, href: "/leads" },
    { label: "Orçamentos enviados", value: data.kpis.quotesSent, href: "/orcamentos" },
    { label: "Aguardando resposta", value: data.kpis.quotesWaiting, href: "/orcamentos" },
    { label: "Vendas fechadas", value: data.kpis.wonLeads, href: "/relatorios" },
    { label: "Receita do mês", value: formatBRL(data.kpis.revenueMonth), href: "/financeiro" },
    { label: "Contas a receber", value: formatBRL(data.kpis.toReceive), href: "/financeiro" },
    { label: "Sem retorno", value: data.kpis.inactiveCustomers, href: "/recuperacao" },
    { label: "Agenda de hoje", value: data.kpis.todayAppointments, href: "/agenda" },
    { label: "Taxa de conversão", value: `${data.kpis.conversion}%`, href: "/relatorios" },
  ];

  return (
    <div>
      <PageHeader
        title="O que está acontecendo hoje"
        subtitle="Um olhar executivo sobre leads, vendas, agenda e o dinheiro que ainda não entrou."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((k) => (
          <Link key={k.label} href={k.href}>
            <Card className="h-full p-4 transition hover:-translate-y-0.5 hover:border-brand/30">
              <p className="text-xs text-muted">{k.label}</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight">{k.value}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-5">
          <h2 className="font-medium">Funil comercial</h2>
          <p className="mt-1 text-sm text-muted">
            Quantidade e valor estimado em cada etapa.
          </p>
          <div className="mt-6 space-y-4">
            {data.funnel.map((step, i) => {
              const meta = FUNNEL_STAGES.find((s) => s.id === step.stage);
              return (
                <div key={step.stage}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium">{meta?.label ?? step.stage}</span>
                    <span className="text-muted">
                      {step.count} · {formatBRL(step.value ?? 0)}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-bg-2">
                    <div
                      className="h-2 rounded-full bg-brand"
                      style={{ width: `${Math.max(8, (step.count / maxFunnel) * 100)}%` }}
                    />
                  </div>
                  {i < data.funnel.length - 1 ? (
                    <div className="ml-2 mt-2 h-3 w-px bg-line" />
                  ) : null}
                </div>
              );
            })}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <h2 className="font-medium">Atenção necessária</h2>
            <div className="mt-4 space-y-2">
              {data.alerts.length === 0 ? (
                <p className="text-sm text-muted">Nada urgente no momento.</p>
              ) : (
                data.alerts.map((a) => (
                  <Link
                    key={a.text}
                    href={a.href}
                    className="block rounded-2xl border border-line bg-bg px-3 py-3 text-sm hover:border-copper/40"
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
          </Card>
        </div>
      </div>
    </div>
  );
}
