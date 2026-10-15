"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { photos } from "@/lib/photos";
import { demoLoginAction, loginAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Logo } from "@/components/marketing/logo";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <div className="grid min-h-full lg:grid-cols-2">
      <div className="relative hidden min-h-full lg:block">
        <Image
          src={photos.salonDawn.src}
          alt={photos.salonDawn.alt}
          fill
          priority
          sizes="50vw"
          className="photo-treat object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1410]/80 via-transparent to-[#1a1410]/20" />
        <div className="absolute bottom-0 p-10 text-white">
          <p className="font-serif text-3xl tracking-tight">Studio Bella, 8h12.</p>
          <p className="mt-2 max-w-sm text-sm text-white/75">
            A Marina ainda não atendeu o primeiro Zap. Você entra no meio da manhã dela.
          </p>
        </div>
      </div>

      <div className="flex min-h-full flex-col bg-bg px-6 py-8 lg:px-14">
        <div className="flex items-center justify-between">
          <Logo />
          <Link href="/" className="ink-link text-sm text-muted hover:text-ink">
            Voltar ao site
          </Link>
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
          <p className="text-[11px] uppercase tracking-[0.22em] text-copper">Demonstração ao vivo</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight">
            Entre como dona do Studio Bella.
          </h1>
          <p className="mt-3 text-muted">
            Funil, WhatsApp, orçamentos, agenda e caixa já estão preenchidos.
            Siga o roteiro da manhã — cada número abre um registro.
          </p>
          <form
            className="mt-8 space-y-4"
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
              Um clique — mesma conta
            </Button>
          </form>
          <ol className="mt-10 space-y-3 border-t border-line pt-6 text-sm text-muted">
            <li>1. Veja o que pede atenção hoje</li>
            <li>2. Abra o WhatsApp da Rita</li>
            <li>3. Arraste o lead e mude um orçamento</li>
            <li>4. Recupere quem parou de voltar</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
