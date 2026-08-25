"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { ORIGINS } from "@/lib/constants";
import { formatBRL, formatDate, formatPhone, relativeTime } from "@/lib/format";
import { createCustomer } from "@/actions/customers";
import { Badge, PageHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";

type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  origin: string | null;
  lastContactAt: string | null;
  lastServiceAt: string | null;
  totalSpent: number;
  visitCount: number;
  owner: { name: string } | null;
  tags: { tag: { id: string; name: string; color: string } }[];
};

export function CustomersView({
  customers,
  users,
  tags,
}: {
  customers: Customer[];
  users: { id: string; name: string }[];
  tags: { id: string; name: string }[];
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.phone.includes(term) ||
        (c.email ?? "").toLowerCase().includes(term),
    );
  }, [customers, q]);

  return (
    <div>
      <PageHeader
        title="Clientes"
        subtitle="Prontuário comercial de cada pessoa que já passou pelo WhatsApp."
        actions={<Button onClick={() => setOpen(true)}>Novo cliente</Button>}
      />
      <Input
        placeholder="Buscar por nome, telefone ou e-mail"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="mb-4 max-w-md"
      />
      <div className="hidden overflow-hidden rounded-2xl border border-line md:block">
        <table className="w-full text-sm">
          <thead className="bg-bg-2 text-left text-xs text-muted">
            <tr>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Contato</th>
              <th className="px-4 py-3">Último contato</th>
              <th className="px-4 py-3">Último serviço</th>
              <th className="px-4 py-3">Gasto</th>
              <th className="px-4 py-3">Visitas</th>
            </tr>
          </thead>
          <tbody className="bg-surface">
            {filtered.map((c) => (
              <tr key={c.id} className="border-t border-line">
                <td className="px-4 py-3">
                  <Link href={`/clientes/${c.id}`} className="font-medium hover:text-brand">
                    {c.name}
                  </Link>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {c.tags.map((t) => (
                      <Badge key={t.tag.id}>{t.tag.name}</Badge>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted">{formatPhone(c.phone)}</td>
                <td className="px-4 py-3">{relativeTime(c.lastContactAt)}</td>
                <td className="px-4 py-3">{formatDate(c.lastServiceAt)}</td>
                <td className="px-4 py-3">{formatBRL(c.totalSpent)}</td>
                <td className="px-4 py-3">{c.visitCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-3 md:hidden">
        {filtered.map((c) => (
          <Link
            key={c.id}
            href={`/clientes/${c.id}`}
            className="block rounded-2xl border border-line bg-surface p-4"
          >
            <p className="font-medium">{c.name}</p>
            <p className="text-sm text-muted">{formatPhone(c.phone)}</p>
            <p className="mt-2 text-sm">
              {formatBRL(c.totalSpent)} · {c.visitCount} atendimentos
            </p>
          </Link>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Novo cliente">
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            start(async () => {
              await createCustomer({
                name: String(fd.get("name")),
                phone: String(fd.get("phone")),
                email: String(fd.get("email") || ""),
                document: String(fd.get("document") || ""),
                address: String(fd.get("address") || ""),
                origin: String(fd.get("origin")),
                notes: String(fd.get("notes") || ""),
                ownerId: String(fd.get("ownerId") || ""),
                tagIds: fd.getAll("tagIds").map(String),
              });
              setOpen(false);
            });
          }}
        >
          <Field label="Nome">
            <Input name="name" required />
          </Field>
          <Field label="WhatsApp">
            <Input name="phone" required />
          </Field>
          <Field label="E-mail">
            <Input name="email" type="email" />
          </Field>
          <Field label="CPF/CNPJ">
            <Input name="document" />
          </Field>
          <Field label="Endereço">
            <Input name="address" />
          </Field>
          <Field label="Origem">
            <Select name="origin" defaultValue="WhatsApp">
              {ORIGINS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </Select>
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
          <Field label="Tags">
            <select
              name="tagIds"
              multiple
              className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm"
            >
              {tags.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Observações">
            <Textarea name="notes" />
          </Field>
          <Button type="submit" disabled={pending} className="w-full">
            Salvar
          </Button>
        </form>
      </Modal>
    </div>
  );
}
