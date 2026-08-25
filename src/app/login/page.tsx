"use client";

import { useState } from "react";
import { demoLoginAction, loginAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <div className="min-h-full bg-[radial-gradient(circle_at_top_left,#d7efe9,transparent_32%),radial-gradient(circle_at_80%_20%,#f4dcc8,transparent_30%),#f3efe8]">
      <div className="mx-auto grid min-h-full max-w-6xl items-center gap-12 px-6 py-12 lg:grid-cols-2">
        <div className="max-w-lg">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Produto de demonstração</p>
          <h1 className="mt-3 font-serif text-5xl leading-tight text-ink">
            Atendia
          </h1>
          <p className="mt-4 text-lg text-muted">
            Organize clientes, vendas e atendimento em um único lugar — e pare de
            perder dinheiro por esquecer de acompanhar seus clientes.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-ink">
            {[
              "WhatsApp vira um funil, não uma conversa perdida",
              "Follow-up automático para orçamento e retorno",
              "Agenda, cobrança e pós-venda conectados ao cliente",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[2rem] border border-line bg-surface p-8 shadow-[0_20px_50px_rgba(28,25,23,0.06)]">
          <p className="font-serif text-2xl">Entrar no Studio Bella</p>
          <p className="mt-1 text-sm text-muted">
            Use a conta da demonstração para percorrer o fluxo comercial completo.
          </p>
          <form
            className="mt-6 space-y-4"
            action={async (formData) => {
              setPending(true);
              setError(null);
              const result = await loginAction(formData);
              if (result?.error) {
                setError(result.error);
                setPending(false);
              }
            }}
          >
            <Field label="E-mail">
              <Input
                name="email"
                type="email"
                defaultValue="ivan.p@example.net"
                required
              />
            </Field>
            <Field label="Senha">
              <Input
                name="password"
                type="password"
                defaultValue="demo1234"
                required
              />
            </Field>
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          <form action={demoLoginAction} className="mt-3">
            <Button variant="secondary" type="submit" className="w-full">
              Entrar na demonstração com um clique
            </Button>
          </form>
          <p className="mt-6 text-xs text-muted">
            Conta: ivan.p@example.net · senha: demo1234
          </p>
        </div>
      </div>
    </div>
  );
}
