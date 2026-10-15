export type Photo = {
  src: string;
  alt: string;
  caption: string;
  credit: string;
};

function unsplash(id: string, w = 2000) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;
}

/** Editorial photography for the marketing site. All Unsplash License. */
export const photos = {
  salonDawn: {
    src: unsplash("photo-1560066984-138dadb4c035"),
    alt: "Salão vazio de manhã, cadeiras e espelhos em luz quente",
    caption: "Antes da primeira cliente. A operação ainda está no celular da dona.",
    credit: "Unsplash",
  },
  cutting: {
    src: unsplash("photo-1562322140-8baeececf3df"),
    alt: "Cabeleireira cortando o cabelo de uma cliente",
    caption: "O serviço acontece. O follow-up, quase nunca.",
    credit: "Unsplash",
  },
  color: {
    src: unsplash("photo-1522337360788-8b13dee7a37e"),
    alt: "Coloração de cabelo em andamento",
    caption: "Orçamento de luzes que saiu no Zap e ninguém cobrou resposta.",
    credit: "Unsplash",
  },
  chairs: {
    src: unsplash("photo-1633681926022-84c23e8cb2d6"),
    alt: "Fileira de cadeiras de salão",
    caption: "Quatro estações. Um funil. Nenhuma planilha paralela.",
    credit: "Unsplash",
  },
  stylist: {
    src: unsplash("photo-1595476108010-b4d1f102b1b1"),
    alt: "Profissional de salão em retrato",
    caption: "Marina Costa, dona. Entra de manhã e vê o que precisa de atenção hoje.",
    credit: "Unsplash",
  },
  wash: {
    src: unsplash("photo-1521590836062-11c226221b15"),
    alt: "Lavagem de cabelo no salão",
    caption: "Quem lavou, cortou e não voltou em 30 dias aparece numa lista.",
    credit: "Unsplash",
  },
  desk: {
    src: unsplash("photo-1487412947147-5cebf100ffc2", 1600),
    alt: "Bancada de estética com pincéis e luz suave",
    caption: "A recepção para de anotar retorno em papel.",
    credit: "Unsplash",
  },
  hands: {
    src: unsplash("photo-1516975080664-ed2fc6a32937", 1600),
    alt: "Mãos trabalhando em um serviço de beleza",
    caption: "O dia a dia continua no WhatsApp. O Atendia segura o resto.",
    credit: "Unsplash",
  },
} as const satisfies Record<string, Photo>;
