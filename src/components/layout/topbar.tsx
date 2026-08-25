"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Menu, Search } from "lucide-react";
import { markNotificationRead, markNotificationsRead } from "@/actions/comms";
import { formatDateTime } from "@/lib/format";

const TITLES: Record<string, string> = {
  "/dashboard": "Visão geral",
  "/leads": "Pipeline de leads",
  "/clientes": "Clientes",
  "/orcamentos": "Orçamentos",
  "/whatsapp": "Central WhatsApp",
  "/agenda": "Agenda",
  "/ordens": "Ordens de serviço",
  "/servicos": "Serviços",
  "/financeiro": "Financeiro",
  "/recuperacao": "Clientes para recuperar",
  "/automacao": "Automações",
  "/tarefas": "Tarefas",
  "/relatorios": "Relatórios",
  "/configuracoes": "Configurações",
};

const SHORTCUTS = [
  { href: "/leads", label: "Novo lead", hint: "Pipeline comercial" },
  { href: "/orcamentos/novo", label: "Novo orçamento", hint: "Proposta comercial" },
  { href: "/whatsapp", label: "Abrir WhatsApp", hint: "Inbox" },
  { href: "/agenda", label: "Agenda de hoje", hint: "Horários" },
  { href: "/recuperacao", label: "Clientes parados", hint: "Retomar contato" },
  { href: "/financeiro", label: "Contas a receber", hint: "Caixa" },
  { href: "/relatorios", label: "Relatórios", hint: "Números da operação" },
];

type Notification = {
  id: string;
  title: string;
  body: string;
  href: string | null;
  read: boolean;
  createdAt: string;
};

export function Topbar({
  notifications,
  onMenu,
}: {
  notifications: Notification[];
  onMenu: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const match = Object.keys(TITLES)
    .sort((a, b) => b.length - a.length)
    .find((k) => pathname.startsWith(k));
  const title = TITLES[match ?? "/dashboard"] ?? "Atendia";
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [, start] = useTransition();
  const unread = notifications.filter((n) => !n.read).length;
  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return SHORTCUTS;
    return SHORTCUTS.filter(
      (s) => s.label.toLowerCase().includes(term) || s.hint.toLowerCase().includes(term),
    );
  }, [query]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const typing =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement;
      if (e.key === "/" && !typing) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-line/80 bg-bg/80 px-4 py-3 backdrop-blur-xl lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-full border border-line bg-surface p-2 lg:hidden"
          onClick={onMenu}
          aria-label="Abrir menu"
        >
          <Menu size={16} />
        </button>
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted">
            Studio Bella · Campinas
          </div>
          <div className="text-sm font-medium">{title}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="rounded-full border border-line bg-surface p-2 md:hidden"
          aria-label="Buscar"
        >
          <Search size={16} />
        </button>
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="hidden items-center gap-2 rounded-full border border-line bg-surface px-3 py-2 text-sm text-muted md:flex"
        >
          <Search size={14} />
          Buscar na operação
          <kbd className="rounded-md bg-bg-2 px-1.5 py-0.5 text-[10px]">/</kbd>
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="relative rounded-full border border-line bg-surface p-2"
            aria-label="Notificações"
          >
            <Bell size={16} />
            {unread > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-copper px-1 text-[10px] text-white">
                {unread}
              </span>
            ) : null}
          </button>
          {open ? (
            <div className="absolute right-0 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-line bg-surface p-3 shadow-lg">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">Notificações</span>
                <button
                  type="button"
                  className="text-xs text-brand"
                  onClick={() => start(() => markNotificationsRead())}
                >
                  Marcar como lidas
                </button>
              </div>
              <div className="max-h-80 space-y-2 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-sm text-muted">Nenhuma notificação.</p>
                ) : (
                  notifications.map((n) => (
                    <Link
                      key={n.id}
                      href={n.href ?? "/dashboard"}
                      onClick={() => {
                        start(() => markNotificationRead(n.id));
                        setOpen(false);
                      }}
                      className="block rounded-xl p-2 hover:bg-bg-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium">{n.title}</p>
                        {!n.read ? (
                          <span className="mt-1 h-2 w-2 rounded-full bg-copper" />
                        ) : null}
                      </div>
                      <p className="text-xs text-muted">{n.body}</p>
                      <p className="mt-1 text-[11px] text-muted">
                        {formatDateTime(n.createdAt)}
                      </p>
                    </Link>
                  ))
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {searchOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-24">
          <button
            type="button"
            className="absolute inset-0 bg-[#0b1c1a]/40"
            onClick={() => setSearchOpen(false)}
            aria-label="Fechar busca"
          />
          <div className="relative w-full max-w-lg rounded-3xl border border-line bg-surface p-3 shadow-2xl">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ir para leads, orçamentos, WhatsApp..."
              className="w-full rounded-2xl border border-line bg-bg px-4 py-3 text-sm outline-none focus:border-brand"
            />
            <div className="mt-2 space-y-1">
              {results.map((item) => (
                <button
                  key={item.href}
                  type="button"
                  className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left hover:bg-bg-2"
                  onClick={() => {
                    setSearchOpen(false);
                    router.push(item.href);
                  }}
                >
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-xs text-muted">{item.hint}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
