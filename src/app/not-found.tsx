import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-bg px-6 text-center">
      <p className="font-serif text-6xl">404</p>
      <h1 className="mt-3 font-serif text-3xl tracking-tight">Essa página não existe.</h1>
      <p className="mt-2 max-w-md text-muted">
        Volte para o site do Atendia ou entre na demonstração do Studio Bella.
      </p>
      <div className="mt-6 flex gap-3">
        <Button href="/" variant="secondary">Ir para o site</Button>
        <Button href="/login">Abrir a demo</Button>
      </div>
    </div>
  );
}
