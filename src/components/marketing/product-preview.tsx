export function ProductPreview() {
  return (
    <div className="rise relative">
      <div className="absolute -inset-8 rounded-[2.6rem] bg-brand/12 blur-3xl" />
      <div className="relative overflow-hidden rounded-[1.8rem] border border-white/50 bg-[#081614] shadow-[0_40px_90px_rgba(11,28,26,0.42)]">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#f87171]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#fbbf24]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#34d399]/80" />
          <span className="ml-3 text-[11px] tracking-wide text-white/45">
            atendia.app / Studio Bella
          </span>
        </div>
        <div className="grid bg-[#081614] md:grid-cols-[88px_1fr]">
          <div className="hidden space-y-2 p-3 md:block">
            {["Visão", "WhatsApp", "Leads", "Agenda", "Caixa"].map((item, i) => (
              <div
                key={item}
                className={`rounded-xl px-2 py-2 text-[10px] ${
                  i === 0 ? "bg-white/12 text-white" : "text-white/40"
                }`}
              >
                {item}
              </div>
            ))}
          </div>
          <div className="bg-[#f4efe6] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-[#6a635b]">
                  Bom dia, Marina
                </p>
                <p className="font-serif text-lg text-[#141210]">Hoje a operação pede atenção</p>
              </div>
              <span className="rounded-full bg-[#0e6f67] px-2.5 py-1 text-[10px] text-white">
                3 alertas
              </span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                ["Leads novos", "4", "Rita acabou de chegar"],
                ["A receber", "R$ 1,8 mil", "2 atrasados"],
                ["Sem retorno", "7", "lista pronta"],
              ].map(([k, v, h]) => (
                <div key={k} className="rounded-2xl border border-[#ece4d6] bg-white p-3 shadow-sm">
                  <p className="text-[10px] text-[#6a635b]">{k}</p>
                  <p className="mt-1 font-serif text-lg leading-none">{v}</p>
                  <p className="mt-1 text-[9px] text-[#8a8176]">{h}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-2xl bg-white p-3.5 shadow-sm">
                <p className="text-[11px] font-medium">Funil comercial</p>
                <div className="mt-3 space-y-2">
                  {[
                    ["Novo", 88, "#0e6f67"],
                    ["Atendimento", 64, "#0a4e49"],
                    ["Orçamento", 42, "#c45c26"],
                    ["Negociação", 28, "#b45309"],
                  ].map(([label, w, color]) => (
                    <div key={String(label)}>
                      <div className="mb-1 flex justify-between text-[9px] text-[#6a635b]">
                        <span>{label}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[#e8e1d4]">
                        <div
                          className="h-1.5 rounded-full"
                          style={{ width: `${w}%`, background: String(color) }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-[#d7efe8] bg-[#0b1c1a] p-3.5 text-white">
                <p className="text-[11px] text-white/55">WhatsApp · Rita Almeida</p>
                <p className="mt-2 rounded-2xl rounded-tl-sm bg-white/10 px-3 py-2 text-[11px] leading-relaxed">
                  Oi, vim pelo Instagram. Vocês fazem luzes?
                </p>
                <p className="mt-2 ml-6 rounded-2xl rounded-tr-sm bg-[#0e6f67] px-3 py-2 text-[11px] leading-relaxed">
                  Oi Rita! Temos horário amanhã às 14h. Te mando o orçamento.
                </p>
                <p className="mt-3 text-[10px] text-[#9cd7cf]">Lead criado · orçamento em rascunho</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
