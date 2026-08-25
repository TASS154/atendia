"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-full bg-bg">
      <SiteHeader />
      <main className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Contato</p>
          <h1 className="mt-3 font-serif text-5xl tracking-tight">
            Conte como a sua operação vende hoje.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted">
            Sem checkout nesta versão. A gente usa o pedido para entender o segmento,
            o tamanho da equipe e se a demo do Studio Bella já basta — ou se vale um
            tenant com a cara do seu negócio.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-ink">
            {[
              "Resposta em dia útil, pelo WhatsApp ou e-mail",
              "Pode começar só pela demo, sem compromisso",
              "Planos Essencial (R$ 189) e Operação (R$ 349)",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[2rem] border border-line bg-surface p-6 shadow-[0_20px_50px_rgba(20,18,16,0.05)] md:p-8">
          {sent ? (
            <div>
              <p className="font-serif text-3xl tracking-tight">Pedido registrado.</p>
              <p className="mt-3 text-muted">
                Nesta demo o formulário não dispara e-mail de verdade — é o fluxo
                comercial para o visitante percorrer. Enquanto isso, entre como
                Marina e veja a operação do Studio Bella.
              </p>
              <Button href="/login" className="mt-6">
                Abrir a demonstração
              </Button>
            </div>
          ) : (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <Field label="Nome">
                <Input name="name" required placeholder="Seu nome" />
              </Field>
              <Field label="WhatsApp">
                <Input name="phone" required placeholder="(19) 99999-0000" />
              </Field>
              <Field label="E-mail">
                <Input name="email" type="email" required placeholder="voce@empresa.com" />
              </Field>
              <Field label="Segmento">
                <Select name="segment" defaultValue="salao">
                  <option value="salao">Salão / estética</option>
                  <option value="clinica">Clínica / estúdio</option>
                  <option value="oficina">Oficina / assistência</option>
                  <option value="outro">Outro serviço</option>
                </Select>
              </Field>
              <Field label="O que você quer resolver">
                <Textarea
                  name="message"
                  required
                  placeholder="Ex.: orçamento some no Zap, cliente não volta, cobrança atrasada..."
                />
              </Field>
              <Button type="submit" className="w-full">
                Enviar pedido
              </Button>
              <p className="text-xs text-muted">
                Demo comercial. Nenhum dado é enviado a um CRM externo.
              </p>
            </form>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
