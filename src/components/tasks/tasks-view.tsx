"use client";

import { useState, useTransition } from "react";
import { createTask, updateTaskStatus } from "@/actions/operations";
import { formatDate } from "@/lib/format";
import { labelOf, TASK_PRIORITIES, TASK_STATUSES } from "@/lib/constants";
import { Badge, PageHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";

export function TasksView({
  tasks,
  users,
  customers,
}: {
  tasks: {
    id: string;
    title: string;
    description: string | null;
    dueDate: string | null;
    priority: string;
    status: string;
    owner: { name: string } | null;
    customer: { name: string } | null;
  }[];
  users: { id: string; name: string }[];
  customers: { id: string; name: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const tone = (p: string) =>
    p === "URGENT" ? "danger" : p === "HIGH" ? "warn" : p === "LOW" ? "neutral" : "brand";

  return (
    <div>
      <PageHeader
        title="Tarefas"
        subtitle="O que a equipe não pode deixar passar hoje."
        actions={<Button onClick={() => setOpen(true)}>Nova tarefa</Button>}
      />
      <div className="space-y-3">
        {tasks.map((t) => (
          <div key={t.id} className="rounded-2xl border border-line bg-surface p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium">{t.title}</p>
                <p className="text-sm text-muted">
                  {t.owner?.name} · {t.customer?.name ?? "Sem cliente"} · {formatDate(t.dueDate)}
                </p>
                {t.description ? <p className="mt-1 text-sm">{t.description}</p> : null}
              </div>
              <Badge tone={tone(t.priority) as "danger" | "warn" | "neutral" | "brand"}>
                {labelOf(TASK_PRIORITIES, t.priority)}
              </Badge>
            </div>
            <div className="mt-3 flex gap-2">
              {TASK_STATUSES.map((s) => (
                <Button
                  key={s.id}
                  size="sm"
                  variant={t.status === s.id ? "primary" : "secondary"}
                  disabled={pending}
                  onClick={() => start(() => updateTaskStatus(t.id, s.id))}
                >
                  {s.label}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Nova tarefa">
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            start(async () => {
              await createTask({
                title: String(fd.get("title")),
                description: String(fd.get("description") || ""),
                ownerId: String(fd.get("ownerId") || ""),
                customerId: String(fd.get("customerId") || "") || undefined,
                dueDate: String(fd.get("dueDate") || "") || undefined,
                priority: String(fd.get("priority")),
              });
              setOpen(false);
            });
          }}
        >
          <Field label="Título">
            <Input name="title" required />
          </Field>
          <Field label="Descrição">
            <Textarea name="description" />
          </Field>
          <Field label="Responsável">
            <Select name="ownerId">
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Cliente">
            <Select name="customerId">
              <option value="">—</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Prazo">
            <Input name="dueDate" type="datetime-local" />
          </Field>
          <Field label="Prioridade">
            <Select name="priority" defaultValue="NORMAL">
              {TASK_PRIORITIES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </Select>
          </Field>
          <Button type="submit" disabled={pending} className="w-full">
            Salvar
          </Button>
        </form>
      </Modal>
    </div>
  );
}
