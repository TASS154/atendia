"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  MessageCircle,
  Receipt,
  Repeat2,
  Settings,
  Sparkles,
  Users,
  Wallet,
  Wrench,
  Kanban,
  ListTodo,
  BarChart3,
  Scissors,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/actions/auth";

const NAV = [
  { href: "/dashboard", label: "Visão geral", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: Kanban },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/orcamentos", label: "Orçamentos", icon: Receipt },
  { href: "/whatsapp", label: "WhatsApp", icon: MessageCircle },
  { href: "/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/ordens", label: "Ordens de serviço", icon: ClipboardList },
  { href: "/servicos", label: "Serviços", icon: Scissors },
  { href: "/financeiro", label: "Financeiro", icon: Wallet },
  { href: "/recuperacao", label: "Para recuperar", icon: Repeat2 },
  { href: "/automacao", label: "Automação", icon: Sparkles },
  { href: "/tarefas", label: "Tarefas", icon: ListTodo },
  { href: "/relatorios", label: "Relatórios", icon: BarChart3 },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

export function Sidebar({
  company,
  user,
  open,
  onClose,
}: {
  company: string;
  user: { name: string; role: string; initials: string };
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-ink/20 lg:hidden"
          onClick={onClose}
          aria-label="Fechar menu"
        />
      ) : null}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[272px] flex-col border-r border-line bg-[#fbf8f3] p-4 transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Link href="/dashboard" className="mb-6 px-2" onClick={onClose}>
          <div className="font-serif text-2xl tracking-tight text-ink">Atendia</div>
          <div className="mt-0.5 text-xs text-muted">{company}</div>
        </Link>
        <nav className="flex-1 space-y-0.5 overflow-y-auto scrollbar-thin">
          {NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                  active
                    ? "bg-brand text-white"
                    : "text-ink-soft hover:bg-bg-2 text-muted hover:text-ink",
                )}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-3 rounded-2xl border border-line bg-surface p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-brand-2">
              {user.initials}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{user.name}</div>
              <div className="text-xs text-muted">
                {user.role === "ADMIN"
                  ? "Administradora"
                  : user.role === "MANAGER"
                    ? "Gerente"
                    : "Equipe"}
              </div>
            </div>
          </div>
          <form action={logoutAction}>
            <button className="mt-3 w-full text-left text-xs text-muted hover:text-ink">
              Sair da conta
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}

export { Bell, Wrench };
