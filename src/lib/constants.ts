export const APP_NAME = "Atendia";
export const APP_TAGLINE =
  "Organize clientes, vendas e atendimento — e pare de perder dinheiro por esquecer o follow-up.";

export const ROLES = {
  ADMIN: "Administrador",
  MANAGER: "Gerente",
  STAFF: "Funcionário",
} as const;

export const LEAD_STAGES = [
  { id: "NEW", label: "Novo", color: "bg-sky-100 text-sky-800" },
  { id: "ATTENDING", label: "Atendimento", color: "bg-amber-100 text-amber-800" },
  { id: "QUOTE", label: "Orçamento", color: "bg-indigo-100 text-indigo-800" },
  { id: "NEGOTIATION", label: "Negociação", color: "bg-violet-100 text-violet-800" },
  { id: "WON", label: "Fechado", color: "bg-emerald-100 text-emerald-800" },
  { id: "LOST", label: "Perdido", color: "bg-stone-200 text-stone-600" },
] as const;

export const FUNNEL_STAGES = LEAD_STAGES.filter((s) => s.id !== "LOST");

export const QUOTE_STATUSES = [
  { id: "DRAFT", label: "Rascunho" },
  { id: "SENT", label: "Enviado" },
  { id: "VIEWED", label: "Visualizado" },
  { id: "NEGOTIATING", label: "Em negociação" },
  { id: "APPROVED", label: "Aprovado" },
  { id: "REJECTED", label: "Recusado" },
  { id: "EXPIRED", label: "Expirado" },
] as const;

export const APPOINTMENT_TYPES = [
  { id: "SERVICE", label: "Serviço" },
  { id: "ATTENDANCE", label: "Atendimento" },
  { id: "MEETING", label: "Reunião" },
  { id: "RETURN", label: "Retorno" },
  { id: "TASK", label: "Tarefa" },
] as const;

export const APPOINTMENT_STATUSES = [
  { id: "SCHEDULED", label: "Agendado" },
  { id: "CONFIRMED", label: "Confirmado" },
  { id: "IN_PROGRESS", label: "Em atendimento" },
  { id: "COMPLETED", label: "Concluído" },
  { id: "CANCELLED", label: "Cancelado" },
  { id: "NO_SHOW", label: "Não compareceu" },
] as const;

export const WORK_ORDER_STATUSES = [
  { id: "OPEN", label: "Aberta" },
  { id: "AWAITING_APPROVAL", label: "Aguardando aprovação" },
  { id: "APPROVED", label: "Aprovada" },
  { id: "IN_PROGRESS", label: "Em execução" },
  { id: "COMPLETED", label: "Concluída" },
  { id: "CANCELLED", label: "Cancelada" },
] as const;

export const PAYMENT_STATUSES = [
  { id: "PENDING", label: "Pendente" },
  { id: "PAID", label: "Pago" },
  { id: "OVERDUE", label: "Atrasado" },
  { id: "CANCELLED", label: "Cancelado" },
] as const;

export const PAYMENT_METHODS = [
  { id: "PIX", label: "Pix" },
  { id: "CARD", label: "Cartão" },
  { id: "CASH", label: "Dinheiro" },
  { id: "TRANSFER", label: "Transferência" },
] as const;

export const TASK_PRIORITIES = [
  { id: "LOW", label: "Baixa" },
  { id: "NORMAL", label: "Normal" },
  { id: "HIGH", label: "Alta" },
  { id: "URGENT", label: "Urgente" },
] as const;

export const TASK_STATUSES = [
  { id: "TODO", label: "A fazer" },
  { id: "DOING", label: "Em andamento" },
  { id: "DONE", label: "Concluída" },
] as const;

export const ORIGINS = [
  "WhatsApp",
  "Instagram",
  "Indicação",
  "Google",
  "Walk-in",
  "Facebook",
  "Site",
];

export const TEMPLATE_CATEGORIES = [
  { id: "GREETING", label: "Saudação" },
  { id: "QUOTE", label: "Envio de orçamento" },
  { id: "CONFIRMATION", label: "Confirmação de agendamento" },
  { id: "POST_SALE", label: "Pós-venda" },
  { id: "BILLING", label: "Cobrança" },
  { id: "RETURN", label: "Retorno" },
] as const;

export const AUTOMATION_TRIGGERS = [
  { id: "QUOTE_CREATED", label: "Orçamento criado" },
  { id: "QUOTE_SENT", label: "Orçamento enviado" },
  { id: "SERVICE_COMPLETED", label: "Serviço concluído" },
  { id: "APPOINTMENT_SCHEDULED", label: "Agendamento criado" },
  { id: "CUSTOMER_INACTIVE", label: "Cliente sem retorno" },
  { id: "LEAD_CREATED", label: "Novo lead" },
] as const;

export function labelOf<T extends { id: string; label: string }>(
  list: readonly T[],
  id: string,
) {
  return list.find((i) => i.id === id)?.label ?? id;
}
