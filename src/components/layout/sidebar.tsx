"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
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
  Kanban,
  ListTodo,
  BarChart3,
  Scissors,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/actions/auth";

const GROUPS = [
  {
    label: "Operação",
    items: [
      { href: "/dashboard", label: "Visão geral", icon: LayoutDashboard },
      { href: "/whatsapp", label: "WhatsApp", icon: MessageCircle },
      { href: "/agenda", label: "Agenda", icon: CalendarDays },
      { href: "/tarefas", label: "Tarefas", icon: ListTodo },
    ],
  },
  {
    label: "Comercial",
    items: [
      { href: "/leads", label: "Leads", icon: Kanban },
      { href: "/clientes", label: "Clientes", icon: Users },
      { href: "/orcamentos", label: "Orçamentos", icon: Receipt },
      { href: "/servicos", label: "Serviços", icon: Scissors },
    ],
  },
  {
    label: "Entrega e caixa",
    items: [
      { href: "/ordens", label: "Ordens de serviço", icon: ClipboardList },
      { href: "/financeiro", label: "Financeiro", icon: Wallet },
      { href: "/recuperacao", label: "Para recuperar", icon: Repeat2 },
    ],
  },
  {
    label: "Gestão",
    items: [
      { href: "/automacao", label: "Automação", icon: Sparkles },
      { href: "/relatorios", label: "Relatórios", icon: BarChart3 },
      { href: "/configuracoes", label: "Configurações", icon: Settings },
    ],
  },
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
          className="fixed inset-0 z-30 bg-ink/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-label="Fechar menu"
        />
      ) : null}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col bg-sidebar text-white transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Link href="/" className="px-5 pb-3 pt-5" onClick={onClose}>
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/12 text-[13px] font-semibold">
              A
            </span>
            <span className="font-serif text-2xl tracking-tight">Atendia</span>
          </div>
          <div className="mt-2 text-xs text-white/55">{company}</div>
        </Link>
        <nav className="mt-2 flex-1 space-y-5 overflow-y-auto px-3 pb-4 scrollbar-thin">
          {GROUPS.map((group) => (
            <div key={group.label}>
              <p className="mb-1.5 px-3 text-[10px] uppercase tracking-[0.18em] text-white/40">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
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
                          ? "bg-white/12 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
                          : "text-white/65 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <Icon size={16} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="m-3 rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-xs font-semibold">
              {user.initials}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{user.name}</div>
              <div className="text-xs text-white/50">
                {user.role === "ADMIN"
                  ? "Administradora"
                  : user.role === "MANAGER"
                    ? "Gerente"
                    : "Equipe"}
              </div>
            </div>
          </div>
          <form action={logoutAction}>
            <button className="mt-3 w-full text-left text-xs text-white/50 hover:text-white">
              Sair da conta
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
