import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com o Atendia para ver a demo ou um tenant com a cara da sua operação.",
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}
