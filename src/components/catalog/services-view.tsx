"use client";

import { useState, useTransition } from "react";
import { createService, toggleService } from "@/actions/operations";
import { formatBRL } from "@/lib/format";
import { Badge, PageHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";

export function ServicesView({
  services,
  categories,
}: {
  services: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    durationMin: number;
    category: string;
    active: boolean;
  }[];
  categories: { id: string; name: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();

  return (
    <div>
      <PageHeader
        title="Serviços"
        subtitle="O catálogo é genérico — troque os itens e o Atendia serve salão, oficina ou clínica."
        actions={<Button onClick={() => setOpen(true)}>Novo serviço</Button>}
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <div key={s.id} className="rounded-2xl border border-line bg-surface p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium">{s.name}</p>
                <p className="text-xs text-muted">{s.category} · {s.durationMin} min</p>
              </div>
              <Badge tone={s.active ? "ok" : "neutral"}>{s.active ? "Ativo" : "Inativo"}</Badge>
            </div>
            <p className="mt-3 text-xl font-semibold">{formatBRL(s.price)}</p>
            {s.description ? <p className="mt-2 text-sm text-muted">{s.description}</p> : null}
            <Button
              size="sm"
              variant="secondary"
              className="mt-3"
              disabled={pending}
              onClick={() => start(() => toggleService(s.id, !s.active))}
            >
              {s.active ? "Desativar" : "Ativar"}
            </Button>
          </div>
        ))}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Novo serviço">
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            start(async () => {
              await createService({
                name: String(fd.get("name")),
                description: String(fd.get("description") || ""),
                price: Number(fd.get("price")),
                durationMin: Number(fd.get("durationMin")),
                category: String(fd.get("category")),
              });
              setOpen(false);
            });
          }}
        >
          <Field label="Nome">
            <Input name="name" required />
          </Field>
          <Field label="Categoria">
            <Select name="category">
              {categories.map((c) => (
                <option key={c.id}>{c.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Preço">
            <Input name="price" type="number" step="0.01" required />
          </Field>
          <Field label="Duração (min)">
            <Input name="durationMin" type="number" defaultValue={45} />
          </Field>
          <Field label="Descrição">
            <Textarea name="description" />
          </Field>
          <Button type="submit" disabled={pending} className="w-full">
            Salvar
          </Button>
        </form>
      </Modal>
    </div>
  );
}
