"use client";

import { useState } from "react";
import Image from "next/image";
import { photos } from "@/lib/photos";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-full bg-bg">
      <SiteHeader />
      <main className="mx-auto grid max-w-6xl items-stretch gap-0 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden min-h-[28rem] lg:block">
          <Image
            src={photos.color.src}
            alt={photos.color.alt}
            fill
            sizes="50vw"
            className="photo-treat object-cover"
          />
        </div>
        <div className="px-6 py-16 lg:px-12">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted">Contato</p>
          <h1 className="mt-3 font-serif text-5xl tracking-tight">
            Conte como a sua operação vende hoje.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted">
            Sem checkout nesta versão. A gente usa o pedido para entender o segmento
            e se a demo do Studio Bella já basta.
          </p>

          <div className="mt-10 max-w-lg border-t border-line pt-8">
            {sent ? (
              <div>
                <p className="font-serif text-3xl tracking-tight">Pedido registrado.</p>
                <p className="mt-3 text-muted">
                  Nesta demo o formulário não dispara e-mail — é o fluxo comercial
                  para o visitante percorrer. Enquanto isso, entre como Marina.
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
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
