"use client";

import { useTransition } from "react";
import {
  createUserAccount,
  saveCompany,
  saveTemplate,
  saveWhatsAppConfig,
} from "@/actions/comms";
import { ROLES, TEMPLATE_CATEGORIES } from "@/lib/constants";
import { Card, PageHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";

export function SettingsView({
  company,
  users,
  templates,
  whatsapp,
  categories,
  role,
}: {
  company: {
    name: string;
    phone: string | null;
    email: string | null;
    address: string | null;
    city: string | null;
    document: string | null;
    segment: string | null;
  };
  users: { id: string; name: string; email: string; role: string; active: boolean }[];
  templates: { id: string; name: string; category: string; body: string }[];
  whatsapp: {
    phoneNumberId: string | null;
    businessAccountId: string | null;
    accessToken: string | null;
    webhookUrl: string | null;
    verifyToken: string | null;
    mode: string;
    connected: boolean;
  } | null;
  categories: { id: string; name: string }[];
  role: string;
}) {
  const [pending, start] = useTransition();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações"
        subtitle="Empresa, equipe, templates, WhatsApp Cloud API e preferências da demonstração."
      />

      <Card className="p-5">
        <h2 className="font-medium">Perfil da empresa</h2>
        <form
          className="mt-4 grid gap-3 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            start(() =>
              saveCompany({
                name: String(fd.get("name")),
                phone: String(fd.get("phone") || ""),
                email: String(fd.get("email") || ""),
                address: String(fd.get("address") || ""),
                city: String(fd.get("city") || ""),
                document: String(fd.get("document") || ""),
                segment: String(fd.get("segment") || ""),
              }),
            );
          }}
        >
          <Field label="Nome">
            <Input name="name" defaultValue={company.name} />
          </Field>
          <Field label="Segmento">
            <Input name="segment" defaultValue={company.segment ?? ""} />
          </Field>
          <Field label="Telefone">
            <Input name="phone" defaultValue={company.phone ?? ""} />
          </Field>
          <Field label="E-mail">
            <Input name="email" defaultValue={company.email ?? ""} />
          </Field>
          <Field label="CNPJ">
            <Input name="document" defaultValue={company.document ?? ""} />
          </Field>
          <Field label="Cidade">
            <Input name="city" defaultValue={company.city ?? ""} />
          </Field>
          <Field label="Endereço" className="sm:col-span-2">
            <Input name="address" defaultValue={company.address ?? ""} />
          </Field>
          <Button type="submit" disabled={pending}>
            Salvar empresa
          </Button>
        </form>
      </Card>

      <Card className="p-5">
        <h2 className="font-medium">Usuários e permissões</h2>
        <div className="mt-3 space-y-2 text-sm">
          {users.map((u) => (
            <div key={u.id} className="flex justify-between rounded-xl bg-bg px-3 py-2">
              <span>
                {u.name} · {u.email}
              </span>
              <span className="text-muted">
                {ROLES[u.role as keyof typeof ROLES] ?? u.role}
              </span>
            </div>
          ))}
        </div>
        {role === "ADMIN" ? (
          <form
            className="mt-4 grid gap-3 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              start(() =>
                createUserAccount({
                  name: String(fd.get("name")),
                  email: String(fd.get("email")),
                  password: String(fd.get("password")),
                  role: String(fd.get("role")),
                }),
              );
              e.currentTarget.reset();
            }}
          >
            <Field label="Nome">
              <Input name="name" required />
            </Field>
            <Field label="E-mail">
              <Input name="email" type="email" required />
            </Field>
            <Field label="Senha">
              <Input name="password" type="password" required />
            </Field>
            <Field label="Papel">
              <Select name="role" defaultValue="STAFF">
                <option value="ADMIN">Administrador</option>
                <option value="MANAGER">Gerente</option>
                <option value="STAFF">Funcionário</option>
              </Select>
            </Field>
            <Button type="submit" disabled={pending}>
              Adicionar usuário
            </Button>
          </form>
        ) : null}
      </Card>

      <Card className="p-5">
        <h2 className="font-medium">Categorias de serviço</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((c) => (
            <span key={c.id} className="rounded-full bg-bg-2 px-3 py-1 text-sm">
              {c.name}
            </span>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="font-medium">Templates de mensagens</h2>
        <div className="mt-4 space-y-4">
          {templates.map((t) => (
            <form
              key={t.id}
              className="space-y-2 rounded-2xl border border-line p-3"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                start(() =>
                  saveTemplate({
                    id: t.id,
                    name: String(fd.get("name")),
                    category: String(fd.get("category")),
                    body: String(fd.get("body")),
                  }),
                );
              }}
            >
              <div className="grid gap-2 sm:grid-cols-2">
                <Input name="name" defaultValue={t.name} />
                <Select name="category" defaultValue={t.category}>
                  {TEMPLATE_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </Select>
              </div>
              <Textarea name="body" defaultValue={t.body} />
              <Button type="submit" size="sm" disabled={pending}>
                Salvar template
              </Button>
            </form>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="font-medium">WhatsApp Business Cloud API</h2>
        <p className="mt-1 text-sm text-muted">
          A demonstração usa MockWhatsAppService. Preencha os campos abaixo quando for
          ligar a conta oficial — o restante do sistema já fala com a interface WhatsAppService.
        </p>
        <form
          className="mt-4 grid gap-3 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            start(() =>
              saveWhatsAppConfig({
                phoneNumberId: String(fd.get("phoneNumberId") || ""),
                businessAccountId: String(fd.get("businessAccountId") || ""),
                accessToken: String(fd.get("accessToken") || ""),
                webhookUrl: String(fd.get("webhookUrl") || ""),
                verifyToken: String(fd.get("verifyToken") || ""),
                mode: String(fd.get("mode")),
              }),
            );
          }}
        >
          <Field label="Modo">
            <Select name="mode" defaultValue={whatsapp?.mode ?? "mock"}>
              <option value="mock">Demonstração (mock)</option>
              <option value="live">Cloud API (live)</option>
            </Select>
          </Field>
          <Field label="Phone Number ID">
            <Input name="phoneNumberId" defaultValue={whatsapp?.phoneNumberId ?? ""} />
          </Field>
          <Field label="Business Account ID">
            <Input name="businessAccountId" defaultValue={whatsapp?.businessAccountId ?? ""} />
          </Field>
          <Field label="Access Token">
            <Input name="accessToken" defaultValue={whatsapp?.accessToken ?? ""} />
          </Field>
          <Field label="Webhook URL">
            <Input name="webhookUrl" defaultValue={whatsapp?.webhookUrl ?? ""} />
          </Field>
          <Field label="Verify Token">
            <Input name="verifyToken" defaultValue={whatsapp?.verifyToken ?? ""} />
          </Field>
          <Button type="submit" disabled={pending}>
            Salvar WhatsApp
          </Button>
        </form>
      </Card>
    </div>
  );
}
