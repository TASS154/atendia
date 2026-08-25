"use client";

import { useMemo, useState, useTransition } from "react";
import { sendInboxMessage } from "@/actions/comms";
import { formatBRL, formatPhone, formatTime } from "@/lib/format";
import { TEMPLATE_CATEGORIES, labelOf } from "@/lib/constants";
import { Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { cn } from "@/lib/utils";

type Conversation = {
  id: string;
  phone: string;
  lastMessage: string | null;
  lastMessageAt: string | null;
  status: string;
  label: string | null;
  unreadCount: number;
  customer: {
    id: string;
    name: string;
    phone: string;
    lastServiceAt: string | null;
    nextReturnAt: string | null;
    totalSpent: number;
    tags: { tag: { name: string } }[] | undefined;
  } | null;
  lead: { name: string } | null;
  owner: { name: string } | null;
  messages: {
    id: string;
    direction: string;
    body: string;
    createdAt: string;
    isAutomated: boolean;
  }[];
};

export function Inbox({
  conversations,
  templates,
}: {
  conversations: Conversation[];
  templates: { id: string; name: string; category: string; body: string }[];
}) {
  const [currentId, setCurrentId] = useState(conversations[0]?.id);
  const [text, setText] = useState("");
  const [pending, start] = useTransition();
  const current = conversations.find((c) => c.id === currentId) ?? conversations[0];
  const name = current?.customer?.name ?? current?.lead?.name ?? current?.phone;

  const quick = useMemo(
    () =>
      TEMPLATE_CATEGORIES.map((cat) => ({
        ...cat,
        template: templates.find((t) => t.category === cat.id),
      })),
    [templates],
  );

  return (
    <div className="grid min-h-[70vh] overflow-hidden rounded-3xl border border-line bg-surface lg:grid-cols-[280px_1fr_260px]">
      <aside className="border-b border-line lg:border-b-0 lg:border-r">
        <div className="border-b border-line p-4 text-sm font-medium">Conversas</div>
        <div className="max-h-[28vh] overflow-y-auto lg:max-h-[70vh]">
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setCurrentId(c.id)}
              className={cn(
                "w-full border-b border-line px-4 py-3 text-left",
                c.id === current?.id ? "bg-brand-soft" : "hover:bg-bg-2",
              )}
            >
              <div className="flex justify-between gap-2">
                <span className="text-sm font-medium">
                  {c.customer?.name ?? c.lead?.name ?? formatPhone(c.phone)}
                </span>
                <span className="text-[11px] text-muted">
                  {c.lastMessageAt ? formatTime(c.lastMessageAt) : ""}
                </span>
              </div>
              <p className="mt-1 line-clamp-1 text-xs text-muted">{c.lastMessage}</p>
              <div className="mt-1 flex items-center gap-2">
                {c.label ? <Badge>{c.label}</Badge> : null}
                {c.unreadCount > 0 ? <Badge tone="copper">{c.unreadCount}</Badge> : null}
              </div>
            </button>
          ))}
        </div>
      </aside>

      <section className="flex min-h-[50vh] flex-col">
        <div className="border-b border-line px-4 py-3">
          <p className="font-medium">{name}</p>
          <p className="text-xs text-muted">{formatPhone(current?.phone ?? "")}</p>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {current?.messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "max-w-[80%] rounded-2xl px-3 py-2 text-sm",
                m.direction === "OUT"
                  ? "ml-auto bg-brand text-white"
                  : "bg-bg-2 text-ink",
              )}
            >
              <p>{m.body}</p>
              <p className={cn("mt-1 text-[10px]", m.direction === "OUT" ? "text-white/70" : "text-muted")}>
                {formatTime(m.createdAt)}
                {m.isAutomated ? " · automático" : ""}
              </p>
            </div>
          ))}
        </div>
        <div className="border-t border-line p-3">
          <div className="mb-2 flex flex-wrap gap-1">
            {quick.map((q) =>
              q.template ? (
                <button
                  key={q.id}
                  className="rounded-full bg-bg-2 px-2 py-1 text-[11px]"
                  onClick={() =>
                    setText(
                      q.template!.body.replaceAll("{{cliente}}", name ?? "cliente"),
                    )
                  }
                >
                  {q.label}
                </button>
              ) : null,
            )}
          </div>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!current || !text.trim()) return;
              const body = text;
              setText("");
              start(() => sendInboxMessage(current.id, body));
            }}
          >
            <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Escreva uma mensagem" />
            <Button type="submit" disabled={pending || !text.trim()}>
              Enviar
            </Button>
          </form>
        </div>
      </section>

      <aside className="hidden border-l border-line p-4 text-sm lg:block">
        <p className="text-xs uppercase tracking-wide text-muted">Cliente</p>
        <p className="mt-1 font-medium">{name}</p>
        <p className="text-muted">{formatPhone(current?.phone ?? "")}</p>
        <p className="mt-3 text-xs text-muted">Responsável</p>
        <p>{current?.owner?.name ?? "—"}</p>
        {current?.customer ? (
          <>
            <p className="mt-3 text-xs text-muted">Valor gasto</p>
            <p>{formatBRL(current.customer.totalSpent)}</p>
            <p className="mt-3 text-xs text-muted">Último serviço</p>
            <p>{current.customer.lastServiceAt ? formatTime(current.customer.lastServiceAt) : "—"}</p>
            <p className="mt-3 text-xs text-muted">Próximo retorno</p>
            <p>{current.customer.nextReturnAt ? formatTime(current.customer.nextReturnAt) : "—"}</p>
          </>
        ) : (
          <p className="mt-4 text-muted">Ainda é um lead. Converta no pipeline.</p>
        )}
      </aside>
    </div>
  );
}
