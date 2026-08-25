import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const serif = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${sans.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
