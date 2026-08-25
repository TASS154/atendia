"use client";

import { useState } from "react";
import Link from "next/link";
import { demoLoginAction, loginAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <div className="mesh grain min-h-full">
      <div className="mx-auto flex min-h-full max-w-6xl flex-col px-6 py-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl tracking-tight">
            Atendia
          </Link>
          <Link href="/" className="text-sm text-muted hover:text-ink">
            Voltar ao site
          </Link>
        </div>
        <div className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-2">
          <div className="max-w-lg">
            <p className="text-xs uppercase tracking-[0.22em] text-brand-2">
              Demonstração ao vivo
            </p>
            <h1 className="mt-3 font-serif text-5xl leading-tight text-ink">
              Entre como dona do Studio Bella.
            </h1>
            <p className="mt-4 text-lg text-muted">
              Funil, WhatsApp, orçamentos, agenda e caixa já estão preenchidos.
              Nada é tela de mentira — cada número abre um registro.
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

          <div className="rounded-[2rem] border border-line bg-surface p-8 shadow-[0_24px_60px_rgba(20,18,16,0.08)]">
            <p className="font-serif text-3xl tracking-tight">Studio Bella</p>
            <p className="mt-1 text-sm text-muted">
              Use a conta da Marina ou entre com um clique.
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
    </div>
  );
}
