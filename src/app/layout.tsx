import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Fraunces, Figtree } from "next/font/google";
import "./globals.css";

const sans = Figtree({
  variable: "--font-sans",
  subsets: ["latin"],
});

const serif = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Atendia — o hub da operação no WhatsApp",
    template: "%s · Atendia",
  },
  description:
    "Organize clientes, vendas e atendimento em um único lugar. Pare de perder dinheiro por esquecer de acompanhar seus clientes. Demo ao vivo com o Studio Bella.",
  metadataBase: new URL("https://atendia-kappa.vercel.app"),
  openGraph: {
    title: "Atendia — pare de perder dinheiro por esquecer o cliente",
    description:
      "Hub comercial para PMEs que vendem e atendem pelo WhatsApp. Demo ao vivo com o Studio Bella.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${sans.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
