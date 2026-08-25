"use client";

import { useMemo, useState, useTransition } from "react";
import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { createAppointment, updateAppointmentStatus } from "@/actions/operations";
import { APPOINTMENT_STATUSES, APPOINTMENT_TYPES, labelOf } from "@/lib/constants";
import { formatTime } from "@/lib/format";
import { Badge, PageHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";

type Appt = {
  id: string;
  title: string;
  type: string;
  startsAt: string;
  durationMin: number;
  status: string;
  customer: { name: string } | null;
  professional: { name: string } | null;
};

export function AgendaView({
  appointments,
  customers,
  services,
  users,
}: {
  appointments: Appt[];
  customers: { id: string; name: string }[];
  services: { id: string; name: string; durationMin: number }[];
  users: { id: string; name: string }[];
}) {
  const [view, setView] = useState<"month" | "week" | "day">("week");
  const [cursor, setCursor] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();

  const days = useMemo(() => {
    if (view === "day") return [cursor];
    if (view === "week") {
      const start = startOfWeek(cursor, { weekStartsOn: 1 });
      return eachDayOfInterval({ start, end: endOfWeek(cursor, { weekStartsOn: 1 }) });
    }
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [cursor, view]);

  return (
    <div>
      <PageHeader
        title="Agenda"
        subtitle="Mês, semana ou dia. Ao criar um horário, a confirmação sai no WhatsApp automaticamente."
        actions={
          <>
            <div className="flex rounded-full border border-line bg-surface p-1 text-xs">
              {(["month", "week", "day"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`rounded-full px-3 py-1 ${view === v ? "bg-brand text-white" : ""}`}
                >
                  {v === "month" ? "Mês" : v === "week" ? "Semana" : "Dia"}
                </button>
              ))}
            </div>
            <Button variant="secondary" onClick={() => setCursor(addDays(cursor, view === "month" ? -30 : view === "week" ? -7 : -1))}>
              Anterior
            </Button>
            <Button variant="secondary" onClick={() => setCursor(new Date())}>
              Hoje
            </Button>
            <Button variant="secondary" onClick={() => setCursor(addDays(cursor, view === "month" ? 30 : view === "week" ? 7 : 1))}>
              Próximo
            </Button>
            <Button onClick={() => setOpen(true)}>Novo evento</Button>
          </>
        }
      />

      <div className={`grid gap-2 ${view === "month" ? "grid-cols-2 sm:grid-cols-7" : "grid-cols-1 sm:grid-cols-7"}`}>
        {days.map((day) => {
          const items = appointments.filter((a) => isSameDay(new Date(a.startsAt), day));
          return (
            <div key={day.toISOString()} className="min-h-28 rounded-2xl border border-line bg-surface p-2">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className={!isSameMonth(day, cursor) && view === "month" ? "text-stone-300" : "font-medium"}>
                  {format(day, view === "month" ? "d" : "EEE d", { locale: ptBR })}
                </span>
                {isSameDay(day, new Date()) ? <Badge tone="brand">hoje</Badge> : null}
              </div>
              <div className="space-y-1">
                {items.map((a) => (
                  <button
                    key={a.id}
                    className="w-full rounded-lg bg-brand-soft px-2 py-1 text-left text-[11px]"
                    onClick={() =>
                      start(() =>
                        updateAppointmentStatus(
                          a.id,
                          a.status === "COMPLETED"
                            ? "SCHEDULED"
                            : a.status === "CONFIRMED"
                              ? "COMPLETED"
                              : "CONFIRMED",
                        ),
                      )
                    }
                  >
                    <span className="font-medium">{formatTime(a.startsAt)}</span> {a.title}
                    <div className="text-muted">{labelOf(APPOINTMENT_STATUSES, a.status)}</div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-muted">
        Clique em um evento para avançar o status (agendado → confirmado → concluído). Concluir gera histórico, retorno e cobrança.
      </p>

      <Modal open={open} onClose={() => setOpen(false)} title="Novo evento" wide>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            start(async () => {
              await createAppointment({
                title: String(fd.get("title")),
                type: String(fd.get("type")),
                startsAt: String(fd.get("startsAt")),
                durationMin: Number(fd.get("durationMin") || 30),
                customerId: String(fd.get("customerId") || "") || undefined,
                serviceId: String(fd.get("serviceId") || "") || undefined,
                professionalId: String(fd.get("professionalId") || "") || undefined,
                notes: String(fd.get("notes") || ""),
              });
              setOpen(false);
            });
          }}
        >
          <Field label="Título">
            <Input name="title" required />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tipo">
              <Select name="type" defaultValue="SERVICE">
                {APPOINTMENT_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Duração (min)">
              <Input name="durationMin" type="number" defaultValue={45} />
            </Field>
          </div>
          <Field label="Data e horário">
            <Input name="startsAt" type="datetime-local" required />
          </Field>
          <Field label="Cliente">
            <Select name="customerId">
              <option value="">Sem cliente</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Serviço">
            <Select name="serviceId">
              <option value="">—</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Profissional">
            <Select name="professionalId">
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Observações">
            <Textarea name="notes" />
          </Field>
          <Button type="submit" disabled={pending} className="w-full">
            Agendar
          </Button>
        </form>
      </Modal>
    </div>
  );
}
