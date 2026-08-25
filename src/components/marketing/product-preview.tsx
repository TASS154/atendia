export function ProductPreview() {
  return (
    <div className="rise relative">
      <div className="absolute -inset-6 rounded-[2.4rem] bg-brand/10 blur-2xl" />
      <div className="relative overflow-hidden rounded-[1.8rem] border border-white/60 bg-[#0b1c1a] shadow-[0_30px_80px_rgba(11,28,26,0.35)]">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="ml-3 text-xs text-white/50">atendia.app / visão geral</span>
        </div>
        <div className="grid gap-px bg-white/10 md:grid-cols-[72px_1fr]">
          <div className="hidden space-y-3 bg-[#0b1c1a] p-3 md:block">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`h-7 rounded-lg ${i === 0 ? "bg-white/15" : "bg-white/5"}`}
              />
            ))}
          </div>
          <div className="bg-[#f3efe7] p-4">
            <div className="grid grid-cols-3 gap-2">
              {[
                ["Leads novos", "4"],
                ["Receita", "R$ 2,4 mil"],
                ["Sem retorno", "7"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-2xl bg-white p-3 shadow-sm">
                  <p className="text-[10px] text-[#6a635b]">{k}</p>
                  <p className="mt-1 font-serif text-lg">{v}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs font-medium">Funil comercial</p>
              <div className="mt-3 space-y-2">
                {[88, 64, 42, 28, 16].map((w) => (
                  <div key={w} className="h-2 rounded-full bg-[#e8e1d4]">
                    <div className="h-2 rounded-full bg-[#0e6f67]" style={{ width: `${w}%` }} />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 rounded-2xl border border-[#f0d9c8] bg-white p-3 text-xs">
              7 clientes estão há mais de 30 dias sem retornar
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
