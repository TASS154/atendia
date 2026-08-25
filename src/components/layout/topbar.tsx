"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu } from "lucide-react";
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
  const match = Object.keys(TITLES)
    .sort((a, b) => b.length - a.length)
    .find((k) => pathname.startsWith(k));
  const title = TITLES[match ?? "/dashboard"] ?? "Atendia";
  const [open, setOpen] = useState(false);
  const [, start] = useTransition();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-line bg-[color-mix(in_srgb,var(--bg)_88%,white)] px-4 py-3 backdrop-blur lg:px-8">
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
            Operação
          </div>
          <div className="text-sm font-medium">{title}</div>
        </div>
      </div>
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
    </header>
  );
}
