import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function ago(days: number, hours = 10) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hours, 15, 0, 0);
  return d;
}

function ahead(days: number, hours = 10) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hours, 0, 0, 0);
  return d;
}

function today(hours: number, minutes = 0) {
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d;
}

async function main() {
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.automationRun.deleteMany();
  await prisma.automationStep.deleteMany();
  await prisma.automation.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.customerHistory.deleteMany();
  await prisma.customerTag.deleteMany();
  await prisma.quoteItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.workOrder.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.task.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.service.deleteMany();
  await prisma.category.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.messageTemplate.deleteMany();
  await prisma.whatsAppConfig.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();

  const hash = await bcrypt.hash("demo1234", 10);

  const company = await prisma.company.create({
    data: {
      id: "company_studio_bella",
      name: "Studio Bella",
      tradeName: "Studio Bella Beleza",
      phone: "19987654321",
      email: "ivan.p@example.net",
      address: "Rua das Palmeiras, 420",
      city: "Campinas",
      state: "SP",
      document: "12.345.678/0001-90",
      segment: "Beleza e estética",
    },
  });

  const marina = await prisma.user.create({
    data: {
      id: "user_marina",
      companyId: company.id,
      name: "Marina Costa",
      email: "ivan.p@example.net",
      passwordHash: hash,
      role: "ADMIN",
      phone: "19999990001",
      initials: "MC",
    },
  });
  const juliana = await prisma.user.create({
    data: {
      id: "user_juliana",
      companyId: company.id,
      name: "Juliana Alves",
      email: "tina.r@example.net",
      passwordHash: hash,
      role: "MANAGER",
      phone: "19999990002",
      initials: "JA",
    },
  });
  const pedro = await prisma.user.create({
    data: {
      id: "user_pedro",
      companyId: company.id,
      name: "Pedro Santos",
      email: "peter.m@example.com",
      passwordHash: hash,
      role: "STAFF",
      phone: "19999990003",
      initials: "PS",
    },
  });
  const camila = await prisma.user.create({
    data: {
      id: "user_camila",
      companyId: company.id,
      name: "Camila Rocha",
      email: "leo.a@example.org",
      passwordHash: hash,
      role: "STAFF",
      phone: "19999990004",
      initials: "CR",
    },
  });

  await prisma.whatsAppConfig.create({
    data: {
      companyId: company.id,
      mode: "mock",
      connected: true,
      webhookUrl: "https://app.atendia.com.br/api/whatsapp/webhook",
      verifyToken: "atendia-verify-demo",
    },
  });

  const categoryNames = ["Cabelo", "Coloração", "Unhas", "Estética", "Sobrancelha", "Tratamentos"];
  const categories = Object.fromEntries(
    await Promise.all(
      categoryNames.map(async (name) => {
        const c = await prisma.category.create({
          data: { companyId: company.id, name },
        });
        return [name, c.id] as const;
      }),
    ),
  );

  const serviceDefs = [
    { id: "svc_corte_f", name: "Corte feminino", price: 80, durationMin: 45, category: "Cabelo", description: "Corte, lavagem e finalização." },
    { id: "svc_corte_m", name: "Corte masculino", price: 55, durationMin: 30, category: "Cabelo", description: "Corte clássico ou degradê." },
    { id: "svc_escova", name: "Escova", price: 70, durationMin: 40, category: "Cabelo", description: "Escova modelada com finalização." },
    { id: "svc_coloracao", name: "Coloração", price: 250, durationMin: 120, category: "Coloração", description: "Coloração completa com tratamento." },
    { id: "svc_mechas", name: "Mechas", price: 320, durationMin: 150, category: "Coloração", description: "Mechas, luzes ou balayage." },
    { id: "svc_manicure", name: "Manicure", price: 50, durationMin: 40, category: "Unhas", description: "Cutilagem, esmaltação e hidratação." },
    { id: "svc_pedicure", name: "Pedicure", price: 60, durationMin: 50, category: "Unhas", description: "Cuidados completos dos pés." },
    { id: "svc_sobrancelha", name: "Design de sobrancelha", price: 40, durationMin: 20, category: "Sobrancelha", description: "Design com pinça e henna opcional." },
    { id: "svc_progressiva", name: "Progressiva", price: 300, durationMin: 180, category: "Tratamentos", description: "Alisamento duradouro." },
    { id: "svc_hidratacao", name: "Hidratação", price: 90, durationMin: 50, category: "Tratamentos", description: "Cronograma de hidratação profunda." },
    { id: "svc_maquiagem", name: "Maquiagem social", price: 150, durationMin: 60, category: "Estética", description: "Make para eventos e ocasiões." },
    { id: "svc_limpeza", name: "Limpeza de pele", price: 180, durationMin: 75, category: "Estética", description: "Limpeza profunda e extração." },
    { id: "svc_depilacao", name: "Depilação perna completa", price: 90, durationMin: 45, category: "Estética", description: "Depilação com cera quente." },
    { id: "svc_penteado", name: "Penteado", price: 120, durationMin: 60, category: "Cabelo", description: "Penteado para festa ou casamento." },
    { id: "svc_spa_pes", name: "Spa dos pés", price: 85, durationMin: 50, category: "Unhas", description: "Esfoliação, hidratação e massagem." },
  ];

  for (const s of serviceDefs) {
    await prisma.service.create({
      data: {
        ...s,
        companyId: company.id,
        categoryId: categories[s.category],
        active: true,
      },
    });
  }

  const tags = await Promise.all(
    [
      { name: "VIP", color: "#0F766E" },
      { name: "Recorrente", color: "#B45309" },
      { name: "Novo", color: "#1D4ED8" },
      { name: "Inativo", color: "#A8A29A" },
      { name: "Indicação", color: "#7C3AED" },
    ].map((t) =>
      prisma.tag.create({ data: { ...t, companyId: company.id } }),
    ),
  );
  const tag = Object.fromEntries(tags.map((t) => [t.name, t.id]));

  type Cust = {
    id: string;
    name: string;
    phone: string;
    email?: string;
    origin: string;
    ownerId: string;
    lastContactAt?: Date;
    lastServiceAt?: Date;
    nextReturnAt?: Date;
    totalSpent: number;
    visitCount: number;
    notes?: string;
    neighborhood?: string;
    tags?: string[];
    createdDaysAgo: number;
  };

  const customers: Cust[] = [
    { id: "cust_ana", name: "Ana Souza", phone: "19991010001", email: "ana.souza@email.com", origin: "WhatsApp", ownerId: marina.id, lastContactAt: ago(35), lastServiceAt: ago(35), nextReturnAt: ago(5), totalSpent: 720, visitCount: 4, notes: "Prefere horários de manhã. Coloração a cada 6 semanas.", neighborhood: "Cambuí", tags: ["VIP", "Inativo"], createdDaysAgo: 180 },
    { id: "cust_carlos", name: "Carlos Lima", phone: "19991010002", email: "carlos.lima@email.com", origin: "Indicação", ownerId: pedro.id, lastContactAt: ago(43), lastServiceAt: ago(43), totalSpent: 250, visitCount: 2, notes: "Corte masculino a cada 20 dias. Não respondeu últimas mensagens.", neighborhood: "Taquaral", tags: ["Inativo"], createdDaysAgo: 90 },
    { id: "cust_beatriz", name: "Beatriz Nunes", phone: "19991010003", email: "beatriz.nunes@email.com", origin: "Instagram", ownerId: juliana.id, lastContactAt: ago(5), lastServiceAt: ago(18), totalSpent: 560, visitCount: 3, notes: "Aguardando retorno do orçamento de mechas.", neighborhood: "Centro", tags: ["Recorrente"], createdDaysAgo: 120 },
    { id: "cust_fernanda_c", name: "Fernanda Oliveira", phone: "19991010004", email: "fernanda.oli@email.com", origin: "WhatsApp", ownerId: marina.id, lastContactAt: ago(2), lastServiceAt: ago(12), nextReturnAt: ahead(18), totalSpent: 980, visitCount: 6, tags: ["VIP", "Recorrente"], neighborhood: "Nova Campinas", createdDaysAgo: 240 },
    { id: "cust_lucas", name: "Lucas Ferreira", phone: "19991010005", origin: "Google", ownerId: pedro.id, lastContactAt: ago(7), lastServiceAt: ago(7), totalSpent: 110, visitCount: 2, neighborhood: "Barão Geraldo", createdDaysAgo: 40 },
    { id: "cust_mariana", name: "Mariana Pires", phone: "19991010006", email: "mariana.pires@email.com", origin: "Indicação", ownerId: camila.id, lastContactAt: ago(1), lastServiceAt: ago(1), totalSpent: 150, visitCount: 3, tags: ["Recorrente"], neighborhood: "Cambuí", createdDaysAgo: 60 },
    { id: "cust_rafael", name: "Rafael Gomes", phone: "19991010007", origin: "WhatsApp", ownerId: pedro.id, lastContactAt: ago(20), lastServiceAt: ago(20), totalSpent: 165, visitCount: 3, neighborhood: "Castelo", createdDaysAgo: 80 },
    { id: "cust_patricia", name: "Patrícia Mendes", phone: "19991010008", email: "patricia.m@email.com", origin: "Instagram", ownerId: juliana.id, lastContactAt: ago(32), lastServiceAt: ago(32), nextReturnAt: ago(2), totalSpent: 430, visitCount: 2, tags: ["Inativo"], neighborhood: "Swiss Park", createdDaysAgo: 100 },
    { id: "cust_bruno", name: "Bruno Carvalho", phone: "19991010009", origin: "Walk-in", ownerId: pedro.id, lastContactAt: ago(4), lastServiceAt: ago(4), totalSpent: 55, visitCount: 1, tags: ["Novo"], neighborhood: "Centro", createdDaysAgo: 4 },
    { id: "cust_juliana_c", name: "Juliana Ribeiro", phone: "19991010010", email: "ju.ribeiro@email.com", origin: "WhatsApp", ownerId: marina.id, lastContactAt: ago(9), lastServiceAt: ago(9), totalSpent: 390, visitCount: 2, neighborhood: "Taquaral", createdDaysAgo: 50 },
    { id: "cust_amanda", name: "Amanda Costa", phone: "19991010011", origin: "Instagram", ownerId: camila.id, lastContactAt: ago(3), lastServiceAt: ago(15), totalSpent: 280, visitCount: 4, tags: ["Recorrente"], neighborhood: "Cambuí", createdDaysAgo: 200 },
    { id: "cust_thiago", name: "Thiago Martins", phone: "19991010012", origin: "Google", ownerId: pedro.id, lastContactAt: ago(14), lastServiceAt: ago(14), totalSpent: 220, visitCount: 4, neighborhood: "Barão Geraldo", createdDaysAgo: 110 },
    { id: "cust_larissa", name: "Larissa Duarte", phone: "19991010013", email: "larissa.d@email.com", origin: "Indicação", ownerId: juliana.id, lastContactAt: ago(6), lastServiceAt: ago(6), totalSpent: 640, visitCount: 3, tags: ["VIP"], neighborhood: "Nova Campinas", createdDaysAgo: 70 },
    { id: "cust_diego", name: "Diego Azevedo", phone: "19991010014", origin: "WhatsApp", ownerId: pedro.id, lastContactAt: ago(38), lastServiceAt: ago(38), totalSpent: 165, visitCount: 3, tags: ["Inativo"], neighborhood: "Centro", createdDaysAgo: 95 },
    { id: "cust_camila_c", name: "Camila Borges", phone: "19991010015", origin: "Instagram", ownerId: marina.id, lastContactAt: ago(11), lastServiceAt: ago(11), totalSpent: 330, visitCount: 2, neighborhood: "Castelo", createdDaysAgo: 45 },
    { id: "cust_renata", name: "Renata Silva", phone: "19991010016", email: "renata.silva@email.com", origin: "WhatsApp", ownerId: juliana.id, lastContactAt: ago(2), lastServiceAt: ago(22), totalSpent: 870, visitCount: 5, tags: ["VIP", "Recorrente"], neighborhood: "Cambuí", createdDaysAgo: 300 },
    { id: "cust_felipe", name: "Felipe Araújo", phone: "19991010017", origin: "Walk-in", ownerId: pedro.id, lastContactAt: ago(8), lastServiceAt: ago(8), totalSpent: 55, visitCount: 1, tags: ["Novo"], neighborhood: "Taquaral", createdDaysAgo: 8 },
    { id: "cust_sofia", name: "Sofia Almeida", phone: "19991010018", origin: "Instagram", ownerId: camila.id, lastContactAt: ago(16), lastServiceAt: ago(16), totalSpent: 190, visitCount: 3, neighborhood: "Swiss Park", createdDaysAgo: 85 },
    { id: "cust_gustavo", name: "Gustavo Teixeira", phone: "19991010019", origin: "Google", ownerId: pedro.id, lastContactAt: ago(21), lastServiceAt: ago(21), totalSpent: 110, visitCount: 2, neighborhood: "Barão Geraldo", createdDaysAgo: 55 },
    { id: "cust_isabela", name: "Isabela Freitas", phone: "19991010020", email: "isabela.f@email.com", origin: "Indicação", ownerId: marina.id, lastContactAt: ago(1), lastServiceAt: ago(28), nextReturnAt: ahead(2), totalSpent: 510, visitCount: 3, tags: ["Recorrente"], neighborhood: "Cambuí", createdDaysAgo: 130 },
    { id: "cust_paulo", name: "Paulo Henrique", phone: "19991010021", origin: "WhatsApp", ownerId: pedro.id, lastContactAt: ago(5), lastServiceAt: ago(5), totalSpent: 55, visitCount: 1, tags: ["Novo"], neighborhood: "Centro", createdDaysAgo: 5 },
    { id: "cust_helena", name: "Helena Castro", phone: "19991010022", origin: "Instagram", ownerId: juliana.id, lastContactAt: ago(40), lastServiceAt: ago(40), totalSpent: 400, visitCount: 2, tags: ["Inativo"], neighborhood: "Nova Campinas", createdDaysAgo: 150 },
    { id: "cust_vinicius", name: "Vinícius Lopes", phone: "19991010023", origin: "Indicação", ownerId: pedro.id, lastContactAt: ago(10), lastServiceAt: ago(10), totalSpent: 165, visitCount: 3, neighborhood: "Castelo", createdDaysAgo: 75 },
    { id: "cust_elisa", name: "Elisa Moreira", phone: "19991010024", email: "elisa.m@email.com", origin: "WhatsApp", ownerId: camila.id, lastContactAt: ago(3), lastServiceAt: ago(3), totalSpent: 110, visitCount: 2, neighborhood: "Cambuí", createdDaysAgo: 30 },
    { id: "cust_rodrigo", name: "Rodrigo Pinto", phone: "19991010025", origin: "Google", ownerId: pedro.id, lastContactAt: ago(17), lastServiceAt: ago(17), totalSpent: 55, visitCount: 1, neighborhood: "Taquaral", createdDaysAgo: 17 },
    { id: "cust_natalia", name: "Natália Souza", phone: "19991010026", origin: "Instagram", ownerId: marina.id, lastContactAt: ago(0, 9), lastServiceAt: ago(13), totalSpent: 450, visitCount: 3, tags: ["Recorrente"], neighborhood: "Swiss Park", createdDaysAgo: 90 },
    { id: "cust_andre", name: "André Barbosa", phone: "19991010027", origin: "Walk-in", ownerId: pedro.id, lastContactAt: ago(6), lastServiceAt: ago(6), totalSpent: 110, visitCount: 2, neighborhood: "Centro", createdDaysAgo: 25 },
    { id: "cust_clara", name: "Clara Mendonça", phone: "19991010028", email: "clara.m@email.com", origin: "Indicação", ownerId: juliana.id, lastContactAt: ago(33), lastServiceAt: ago(33), totalSpent: 300, visitCount: 1, tags: ["Inativo"], neighborhood: "Cambuí", createdDaysAgo: 33 },
    { id: "cust_otavio", name: "Otávio Ramos", phone: "19991010029", origin: "WhatsApp", ownerId: pedro.id, lastContactAt: ago(12), lastServiceAt: ago(12), totalSpent: 55, visitCount: 1, neighborhood: "Barão Geraldo", createdDaysAgo: 12 },
    { id: "cust_livia", name: "Lívia Fernandes", phone: "19991010030", origin: "Instagram", ownerId: camila.id, lastContactAt: ago(2), lastServiceAt: ago(19), totalSpent: 240, visitCount: 4, tags: ["Recorrente"], neighborhood: "Nova Campinas", createdDaysAgo: 160 },
  ];

  for (const c of customers) {
    await prisma.customer.create({
      data: {
        id: c.id,
        companyId: company.id,
        name: c.name,
        phone: c.phone,
        whatsapp: c.phone,
        email: c.email,
        address: "Campinas, SP",
        neighborhood: c.neighborhood,
        city: "Campinas",
        origin: c.origin,
        notes: c.notes,
        ownerId: c.ownerId,
        lastContactAt: c.lastContactAt,
        lastServiceAt: c.lastServiceAt,
        nextReturnAt: c.nextReturnAt,
        totalSpent: c.totalSpent,
        visitCount: c.visitCount,
        createdAt: ago(c.createdDaysAgo),
      },
    });
    if (c.tags?.length) {
      await prisma.customerTag.createMany({
        data: c.tags.map((name) => ({ customerId: c.id, tagId: tag[name] })),
      });
    }
  }

  const leadDefs = [
    { id: "lead_rita", name: "Rita Moreira", phone: "19992020001", stage: "NEW", origin: "WhatsApp", estimatedValue: 250, ownerId: marina.id, lastContactAt: ago(3), notes: "Pediu coloração pelo Instagram e caiu no WhatsApp. Sem resposta há 3 dias." },
    { id: "lead_eduardo", name: "Eduardo Dias", phone: "19992020002", stage: "NEW", origin: "Instagram", estimatedValue: 55, ownerId: pedro.id, lastContactAt: ago(2, 8), notes: "Quer corte masculino ainda esta semana." },
    { id: "lead_vanessa", name: "Vanessa Prado", phone: "19992020003", stage: "NEW", origin: "WhatsApp", estimatedValue: 180, ownerId: juliana.id, lastContactAt: ago(1), notes: "Interessada em limpeza de pele + sobrancelha." },
    { id: "lead_marcos", name: "Marcos Vieira", phone: "19992020004", stage: "NEW", origin: "Google", estimatedValue: 55, ownerId: pedro.id, lastContactAt: ago(0, 11), notes: "Lead de hoje. Ainda não atendido." },
    { id: "lead_aline", name: "Aline Castro", phone: "19992020005", stage: "ATTENDING", origin: "WhatsApp", estimatedValue: 300, ownerId: marina.id, lastContactAt: ago(0, 14), notes: "Tirando dúvidas sobre progressiva." },
    { id: "lead_bruna", name: "Bruna Farias", phone: "19992020006", stage: "ATTENDING", origin: "Indicação", estimatedValue: 150, ownerId: camila.id, lastContactAt: ago(1, 16), notes: "Indicação da Ana Souza. Quer maquiagem para formatura." },
    { id: "lead_henrique", name: "Henrique Melo", phone: "19992020007", stage: "ATTENDING", origin: "Walk-in", estimatedValue: 55, ownerId: pedro.id, lastContactAt: ago(0, 12), notes: "Passou na recepção, vai confirmar horário." },
    { id: "lead_tatiane", name: "Tatiane Lopes", phone: "19992020008", stage: "QUOTE", origin: "Instagram", estimatedValue: 320, ownerId: juliana.id, lastContactAt: ago(4), notes: "Orçamento de mechas enviado." },
    { id: "lead_priscila", name: "Priscila Andrade", phone: "19992020009", stage: "QUOTE", origin: "WhatsApp", estimatedValue: 250, ownerId: marina.id, lastContactAt: ago(2), notes: "Coloração + hidratação. Aguardando resposta." },
    { id: "lead_caio", name: "Caio Nogueira", phone: "19992020010", stage: "QUOTE", origin: "Google", estimatedValue: 90, ownerId: camila.id, lastContactAt: ago(1), notes: "Pacote de depilação." },
    { id: "lead_debora", name: "Débora Pinto", phone: "19992020011", stage: "NEGOTIATION", origin: "WhatsApp", estimatedValue: 470, ownerId: marina.id, lastContactAt: ago(1, 18), notes: "Quer desconto no combo mechas + progressiva." },
    { id: "lead_sandra", name: "Sandra Reis", phone: "19992020012", stage: "NEGOTIATION", origin: "Indicação", estimatedValue: 180, ownerId: juliana.id, lastContactAt: ago(0, 15), notes: "Comparando com outro salão." },
    { id: "lead_converted_1", name: "Bruno Carvalho", phone: "19991010009", stage: "WON", origin: "Walk-in", estimatedValue: 55, ownerId: pedro.id, lastContactAt: ago(4), convertedCustomerId: "cust_bruno" },
    { id: "lead_converted_2", name: "Paulo Henrique", phone: "19991010021", stage: "WON", origin: "WhatsApp", estimatedValue: 55, ownerId: pedro.id, lastContactAt: ago(5), convertedCustomerId: "cust_paulo" },
    { id: "lead_lost", name: "Mônica Vieira", phone: "19992020015", stage: "LOST", origin: "Instagram", estimatedValue: 300, ownerId: marina.id, lastContactAt: ago(12), lostReason: "Fechou com concorrente por preço." },
  ];

  for (const l of leadDefs) {
    await prisma.lead.create({
      data: { ...l, companyId: company.id, email: undefined },
    });
  }

  await prisma.customer.update({
    where: { id: "cust_bruno" },
    data: { convertedFromLeadId: "lead_converted_1" },
  });
  await prisma.customer.update({
    where: { id: "cust_paulo" },
    data: { convertedFromLeadId: "lead_converted_2" },
  });

  const quotes = [
    {
      id: "quote_beatriz",
      number: "ORC-2026-001",
      customerId: "cust_beatriz",
      status: "SENT",
      subtotal: 320,
      discount: 0,
      total: 320,
      paymentTerms: "Pix ou cartão em até 2x",
      validUntil: ahead(5),
      sentAt: ago(5),
      notes: "Mechas com tonalizante.",
      items: [{ serviceId: "svc_mechas", name: "Mechas", quantity: 1, unitPrice: 320, total: 320, kind: "SERVICE" }],
    },
    {
      id: "quote_tatiane",
      number: "ORC-2026-002",
      leadId: "lead_tatiane",
      status: "SENT",
      subtotal: 320,
      discount: 0,
      total: 320,
      paymentTerms: "Pix à vista",
      validUntil: ahead(3),
      sentAt: ago(4),
      items: [{ serviceId: "svc_mechas", name: "Mechas", quantity: 1, unitPrice: 320, total: 320, kind: "SERVICE" }],
    },
    {
      id: "quote_priscila",
      number: "ORC-2026-003",
      leadId: "lead_priscila",
      status: "VIEWED",
      subtotal: 340,
      discount: 20,
      total: 320,
      paymentTerms: "Pix com 5% de desconto",
      validUntil: ahead(6),
      sentAt: ago(2),
      viewedAt: ago(1),
      items: [
        { serviceId: "svc_coloracao", name: "Coloração", quantity: 1, unitPrice: 250, total: 250, kind: "SERVICE" },
        { serviceId: "svc_hidratacao", name: "Hidratação", quantity: 1, unitPrice: 90, discount: 20, total: 70, kind: "SERVICE" },
      ],
    },
    {
      id: "quote_debora",
      number: "ORC-2026-004",
      leadId: "lead_debora",
      status: "NEGOTIATING",
      subtotal: 620,
      discount: 50,
      total: 570,
      paymentTerms: "Proposta de combo",
      validUntil: ahead(4),
      sentAt: ago(3),
      items: [
        { serviceId: "svc_mechas", name: "Mechas", quantity: 1, unitPrice: 320, total: 320, kind: "SERVICE" },
        { serviceId: "svc_progressiva", name: "Progressiva", quantity: 1, unitPrice: 300, discount: 50, total: 250, kind: "SERVICE" },
      ],
    },
    {
      id: "quote_renata",
      number: "ORC-2026-005",
      customerId: "cust_renata",
      status: "APPROVED",
      subtotal: 180,
      discount: 0,
      total: 180,
      paymentTerms: "Cartão",
      sentAt: ago(10),
      respondedAt: ago(9),
      items: [{ serviceId: "svc_limpeza", name: "Limpeza de pele", quantity: 1, unitPrice: 180, total: 180, kind: "SERVICE" }],
    },
    {
      id: "quote_isabela",
      number: "ORC-2026-006",
      customerId: "cust_isabela",
      status: "APPROVED",
      subtotal: 150,
      discount: 0,
      total: 150,
      sentAt: ago(8),
      respondedAt: ago(7),
      items: [{ serviceId: "svc_maquiagem", name: "Maquiagem social", quantity: 1, unitPrice: 150, total: 150, kind: "SERVICE" }],
    },
    {
      id: "quote_helena",
      number: "ORC-2026-007",
      customerId: "cust_helena",
      status: "EXPIRED",
      subtotal: 250,
      discount: 0,
      total: 250,
      validUntil: ago(10),
      sentAt: ago(20),
      items: [{ serviceId: "svc_coloracao", name: "Coloração", quantity: 1, unitPrice: 250, total: 250, kind: "SERVICE" }],
    },
    {
      id: "quote_natalia",
      number: "ORC-2026-008",
      customerId: "cust_natalia",
      status: "DRAFT",
      subtotal: 130,
      discount: 0,
      total: 130,
      items: [
        { serviceId: "svc_manicure", name: "Manicure", quantity: 1, unitPrice: 50, total: 50, kind: "SERVICE" },
        { serviceId: "svc_corte_f", name: "Corte feminino", quantity: 1, unitPrice: 80, total: 80, kind: "SERVICE" },
      ],
    },
    {
      id: "quote_monica",
      number: "ORC-2026-009",
      leadId: "lead_lost",
      status: "REJECTED",
      subtotal: 300,
      discount: 0,
      total: 300,
      sentAt: ago(14),
      respondedAt: ago(12),
      items: [{ serviceId: "svc_progressiva", name: "Progressiva", quantity: 1, unitPrice: 300, total: 300, kind: "SERVICE" }],
    },
    {
      id: "quote_caio",
      number: "ORC-2026-010",
      leadId: "lead_caio",
      status: "SENT",
      subtotal: 90,
      discount: 0,
      total: 90,
      validUntil: ahead(7),
      sentAt: ago(1),
      items: [{ serviceId: "svc_depilacao", name: "Depilação perna completa", quantity: 1, unitPrice: 90, total: 90, kind: "SERVICE" }],
    },
  ];

  for (const q of quotes) {
    const { items, ...rest } = q;
    await prisma.quote.create({
      data: {
        ...rest,
        companyId: company.id,
        createdAt: rest.sentAt ?? ago(1),
        items: { create: items },
      },
    });
  }

  const appts = [
    { id: "apt_today_1", customerId: "cust_mariana", serviceId: "svc_manicure", professionalId: camila.id, title: "Manicure — Mariana Pires", type: "SERVICE", startsAt: today(9, 0), durationMin: 40, status: "CONFIRMED" },
    { id: "apt_today_2", customerId: "cust_lucas", serviceId: "svc_corte_m", professionalId: pedro.id, title: "Corte masculino — Lucas Ferreira", type: "SERVICE", startsAt: today(10, 0), durationMin: 30, status: "SCHEDULED" },
    { id: "apt_today_3", customerId: "cust_fernanda_c", serviceId: "svc_escova", professionalId: marina.id, title: "Escova — Fernanda Oliveira", type: "SERVICE", startsAt: today(11, 30), durationMin: 40, status: "CONFIRMED" },
    { id: "apt_today_4", customerId: "cust_paulo", serviceId: "svc_corte_m", professionalId: pedro.id, title: "Corte masculino — Paulo Henrique", type: "SERVICE", startsAt: today(14, 0), durationMin: 30, status: "SCHEDULED" },
    { id: "apt_today_5", customerId: "cust_elisa", serviceId: "svc_sobrancelha", professionalId: camila.id, title: "Sobrancelha — Elisa Moreira", type: "SERVICE", startsAt: today(15, 30), durationMin: 20, status: "CONFIRMED" },
    { id: "apt_tom_1", customerId: "cust_isabela", serviceId: "svc_maquiagem", professionalId: juliana.id, title: "Maquiagem — Isabela Freitas", type: "SERVICE", startsAt: ahead(1, 9), durationMin: 60, status: "CONFIRMED", confirmationSentAt: ago(0, 8) },
    { id: "apt_tom_2", customerId: "cust_renata", serviceId: "svc_limpeza", professionalId: juliana.id, title: "Limpeza de pele — Renata Silva", type: "SERVICE", startsAt: ahead(1, 11), durationMin: 75, status: "SCHEDULED" },
    { id: "apt_2", customerId: "cust_larissa", serviceId: "svc_coloracao", professionalId: marina.id, title: "Coloração — Larissa Duarte", type: "SERVICE", startsAt: ahead(2, 10), durationMin: 120, status: "SCHEDULED" },
    { id: "apt_return_ana", customerId: "cust_ana", title: "Retorno — Ana Souza", type: "RETURN", startsAt: ahead(3, 10), durationMin: 30, status: "SCHEDULED", professionalId: marina.id },
    { id: "apt_past_1", customerId: "cust_mariana", serviceId: "svc_manicure", professionalId: camila.id, title: "Manicure — Mariana Pires", type: "SERVICE", startsAt: ago(1, 10), durationMin: 40, status: "COMPLETED" },
    { id: "apt_past_2", customerId: "cust_bruno", serviceId: "svc_corte_m", professionalId: pedro.id, title: "Corte masculino — Bruno Carvalho", type: "SERVICE", startsAt: ago(4, 16), durationMin: 30, status: "COMPLETED" },
    { id: "apt_past_3", customerId: "cust_ana", serviceId: "svc_coloracao", professionalId: marina.id, title: "Coloração — Ana Souza", type: "SERVICE", startsAt: ago(35, 10), durationMin: 120, status: "COMPLETED" },
    { id: "apt_past_4", customerId: "cust_carlos", serviceId: "svc_corte_m", professionalId: pedro.id, title: "Corte — Carlos Lima", type: "SERVICE", startsAt: ago(43, 11), durationMin: 30, status: "COMPLETED" },
    { id: "apt_past_5", customerId: "cust_patricia", serviceId: "svc_progressiva", professionalId: marina.id, title: "Progressiva — Patrícia Mendes", type: "SERVICE", startsAt: ago(32, 9), durationMin: 180, status: "COMPLETED" },
    { id: "apt_past_6", customerId: "cust_diego", serviceId: "svc_corte_m", professionalId: pedro.id, title: "Corte — Diego Azevedo", type: "SERVICE", startsAt: ago(38, 15), durationMin: 30, status: "COMPLETED" },
    { id: "apt_past_7", customerId: "cust_helena", serviceId: "svc_mechas", professionalId: juliana.id, title: "Mechas — Helena Castro", type: "SERVICE", startsAt: ago(40, 10), durationMin: 150, status: "COMPLETED" },
    { id: "apt_past_8", customerId: "cust_clara", serviceId: "svc_progressiva", professionalId: marina.id, title: "Progressiva — Clara Mendonça", type: "SERVICE", startsAt: ago(33, 9), durationMin: 180, status: "COMPLETED" },
    { id: "apt_meet", title: "Reunião de equipe", type: "MEETING", startsAt: ahead(1, 18), durationMin: 45, status: "SCHEDULED", professionalId: marina.id },
    { id: "apt_task", title: "Revisar estoque de tintas", type: "TASK", startsAt: today(17, 0), durationMin: 30, status: "SCHEDULED", professionalId: juliana.id },
    { id: "apt_noshow", customerId: "cust_gustavo", serviceId: "svc_corte_m", professionalId: pedro.id, title: "Corte — Gustavo Teixeira", type: "SERVICE", startsAt: ago(21, 10), durationMin: 30, status: "NO_SHOW" },
  ];

  for (const a of appts) {
    await prisma.appointment.create({ data: { ...a, companyId: company.id } });
  }

  await prisma.workOrder.createMany({
    data: [
      { id: "os_1", companyId: company.id, number: "OS-2026-001", customerId: "cust_renata", serviceId: "svc_limpeza", quoteId: "quote_renata", appointmentId: "apt_tom_2", professionalId: juliana.id, description: "Limpeza de pele completa", value: 180, status: "APPROVED", date: ahead(1, 11) },
      { id: "os_2", companyId: company.id, number: "OS-2026-002", customerId: "cust_isabela", serviceId: "svc_maquiagem", quoteId: "quote_isabela", appointmentId: "apt_tom_1", professionalId: juliana.id, description: "Maquiagem para evento", value: 150, status: "APPROVED", date: ahead(1, 9) },
      { id: "os_3", companyId: company.id, number: "OS-2026-003", customerId: "cust_mariana", serviceId: "svc_manicure", appointmentId: "apt_past_1", professionalId: camila.id, description: "Manicure", value: 50, status: "COMPLETED", date: ago(1, 10) },
      { id: "os_4", companyId: company.id, number: "OS-2026-004", customerId: "cust_bruno", serviceId: "svc_corte_m", appointmentId: "apt_past_2", professionalId: pedro.id, description: "Primeiro corte", value: 55, status: "COMPLETED", date: ago(4, 16) },
      { id: "os_5", companyId: company.id, number: "OS-2026-005", customerId: "cust_ana", serviceId: "svc_coloracao", appointmentId: "apt_past_3", professionalId: marina.id, description: "Coloração tom 7.1", materials: "Tinta 7.1, ox 20 vol, máscara", value: 250, status: "COMPLETED", date: ago(35, 10) },
      { id: "os_6", companyId: company.id, number: "OS-2026-006", customerId: "cust_natalia", serviceId: "svc_corte_f", quoteId: "quote_natalia", professionalId: marina.id, description: "Corte + manicure — rascunho da OS", value: 130, status: "OPEN", date: ago(0, 10) },
    ],
  });

  await prisma.payment.createMany({
    data: [
      { companyId: company.id, customerId: "cust_mariana", workOrderId: "os_3", appointmentId: "apt_past_1", description: "Manicure", amount: 50, dueDate: ago(1), paidAt: ago(1), status: "PAID", method: "PIX" },
      { companyId: company.id, customerId: "cust_bruno", workOrderId: "os_4", appointmentId: "apt_past_2", description: "Corte masculino", amount: 55, dueDate: ago(4), paidAt: ago(4), status: "PAID", method: "CASH" },
      { companyId: company.id, customerId: "cust_ana", workOrderId: "os_5", appointmentId: "apt_past_3", description: "Coloração", amount: 250, dueDate: ago(35), paidAt: ago(35), status: "PAID", method: "CARD" },
      { companyId: company.id, customerId: "cust_fernanda_c", description: "Escova + hidratação", amount: 160, dueDate: ago(12), paidAt: ago(12), status: "PAID", method: "PIX" },
      { companyId: company.id, customerId: "cust_larissa", description: "Coloração", amount: 250, dueDate: ago(6), paidAt: ago(6), status: "PAID", method: "PIX" },
      { companyId: company.id, customerId: "cust_renata", quoteId: "quote_renata", workOrderId: "os_1", description: "Limpeza de pele", amount: 180, dueDate: ahead(1), status: "PENDING", method: "CARD" },
      { companyId: company.id, customerId: "cust_isabela", quoteId: "quote_isabela", workOrderId: "os_2", description: "Maquiagem social", amount: 150, dueDate: ahead(1), status: "PENDING", method: "PIX" },
      { companyId: company.id, customerId: "cust_carlos", description: "Corte masculino — saldo", amount: 55, dueDate: ago(10), status: "OVERDUE", method: "PIX" },
      { companyId: company.id, customerId: "cust_patricia", description: "Progressiva — parcela 2", amount: 150, dueDate: ago(5), status: "OVERDUE", method: "TRANSFER" },
      { companyId: company.id, customerId: "cust_helena", description: "Mechas — restante", amount: 120, dueDate: ago(8), status: "OVERDUE", method: "PIX" },
    ],
  });

  await prisma.task.createMany({
    data: [
      { companyId: company.id, title: "Ligar para Ana Souza", description: "Cliente VIP sem retorno há 35 dias.", ownerId: marina.id, customerId: "cust_ana", dueDate: today(18), priority: "URGENT", status: "TODO" },
      { companyId: company.id, title: "Cobrar parcela da Patrícia", description: "Pagamento atrasado da progressiva.", ownerId: juliana.id, customerId: "cust_patricia", dueDate: today(12), priority: "HIGH", status: "DOING" },
      { companyId: company.id, title: "Confirmar horários de amanhã", description: "Enviar confirmação para Isabela e Renata.", ownerId: camila.id, dueDate: today(16), priority: "HIGH", status: "TODO" },
      { companyId: company.id, title: "Revisar orçamento da Débora", description: "Proposta de combo em negociação.", ownerId: marina.id, dueDate: ahead(1, 11), priority: "NORMAL", status: "TODO" },
      { companyId: company.id, title: "Comprar luvas e toucas", description: "Estoque baixo.", ownerId: juliana.id, dueDate: ahead(2, 10), priority: "LOW", status: "TODO" },
    ],
  });

  const templates = [
    { name: "Saudação", category: "GREETING", body: "Olá, {{cliente}}! Aqui é do Studio Bella. Como posso te ajudar hoje?" },
    { name: "Envio de orçamento", category: "QUOTE", body: "Olá, {{cliente}}! Segue o orçamento {{numero}} no valor de {{total}}. Validade até {{validade}}. Qualquer dúvida, estou por aqui!" },
    { name: "Confirmação de agendamento", category: "CONFIRMATION", body: "Olá, {{cliente}}! Passando para confirmar seu agendamento amanhã às {{horario}}. Qualquer imprevisto, me avise." },
    { name: "Lembrete 2h", category: "CONFIRMATION", body: "Seu atendimento está chegando! Nos vemos às {{horario}}." },
    { name: "Pós-venda", category: "POST_SALE", body: "Olá, {{cliente}}! Gostaríamos de saber como foi sua experiência no Studio Bella. Sua opinião nos ajuda a melhorar." },
    { name: "Cobrança", category: "BILLING", body: "Olá, {{cliente}}! Identificamos um pagamento em aberto de {{total}}. Consegue nos ajudar a regularizar?" },
    { name: "Retorno", category: "RETURN", body: "Olá, {{cliente}}! Já faz um tempinho desde seu último atendimento. Gostaria de agendar novamente?" },
    { name: "Follow-up 2 dias", category: "QUOTE", body: "Olá, {{cliente}}! Tudo bem? Passando para saber se conseguiu analisar o orçamento que enviamos." },
    { name: "Follow-up 5 dias", category: "QUOTE", body: "Olá, {{cliente}}! Ficou alguma dúvida sobre o orçamento? Posso te ajudar." },
    { name: "Follow-up 8 dias", category: "QUOTE", body: "{{cliente}}, ainda temos disponibilidade para realizar seu serviço. Gostaria de verificar uma data?" },
  ];
  await prisma.messageTemplate.createMany({
    data: templates.map((t) => ({ ...t, companyId: company.id })),
  });

  const autoQuote = await prisma.automation.create({
    data: {
      companyId: company.id,
      name: "Orçamento sem resposta",
      description: "Follow-up em 2, 5 e 8 dias se o orçamento não for respondido.",
      trigger: "QUOTE_SENT",
      active: true,
      steps: {
        create: [
          { order: 1, type: "WAIT", config: JSON.stringify({ days: 2 }) },
          { order: 2, type: "CONDITION", config: JSON.stringify({ kind: "quote_unanswered" }) },
          { order: 3, type: "ACTION", config: JSON.stringify({ action: "SEND_WHATSAPP", message: "Olá, {{cliente}}! Tudo bem? Passando para saber se conseguiu analisar o orçamento que enviamos." }) },
          { order: 4, type: "WAIT", config: JSON.stringify({ days: 3 }) },
          { order: 5, type: "CONDITION", config: JSON.stringify({ kind: "quote_unanswered" }) },
          { order: 6, type: "ACTION", config: JSON.stringify({ action: "SEND_WHATSAPP", message: "Olá, {{cliente}}! Ficou alguma dúvida sobre o orçamento? Posso te ajudar." }) },
          { order: 7, type: "WAIT", config: JSON.stringify({ days: 3 }) },
          { order: 8, type: "CONDITION", config: JSON.stringify({ kind: "quote_unanswered" }) },
          { order: 9, type: "ACTION", config: JSON.stringify({ action: "SEND_WHATSAPP", message: "{{cliente}}, ainda temos disponibilidade para realizar seu serviço. Gostaria de verificar uma data?" }) },
        ],
      },
    },
  });

  await prisma.automation.create({
    data: {
      companyId: company.id,
      name: "Cliente sem retorno",
      description: "Reativa clientes com mais de 30 dias sem atendimento.",
      trigger: "CUSTOMER_INACTIVE",
      active: true,
      steps: {
        create: [
          { order: 1, type: "CONDITION", config: JSON.stringify({ kind: "customer_inactive" }) },
          { order: 2, type: "ACTION", config: JSON.stringify({ action: "SEND_WHATSAPP", message: "Olá, {{cliente}}! Já faz um tempinho desde seu último atendimento. Gostaria de agendar novamente?" }) },
        ],
      },
    },
  });

  await prisma.automation.create({
    data: {
      companyId: company.id,
      name: "Pós-venda",
      description: "Pesquisa de satisfação após o serviço.",
      trigger: "SERVICE_COMPLETED",
      active: true,
      steps: {
        create: [
          { order: 1, type: "WAIT", config: JSON.stringify({ hours: 3 }) },
          { order: 2, type: "ACTION", config: JSON.stringify({ action: "SEND_WHATSAPP", message: "Olá, {{cliente}}! Gostaríamos de saber como foi sua experiência no Studio Bella." }) },
        ],
      },
    },
  });

  await prisma.automation.create({
    data: {
      companyId: company.id,
      name: "Lembrete 24 horas",
      description: "Confirmação automática no dia anterior.",
      trigger: "APPOINTMENT_SCHEDULED",
      active: true,
      steps: {
        create: [
          { order: 1, type: "WAIT", config: JSON.stringify({ hours: 1 }) },
          { order: 2, type: "ACTION", config: JSON.stringify({ action: "SEND_WHATSAPP", message: "Olá, {{cliente}}! Passando para confirmar seu agendamento amanhã às {{horario}}." }) },
        ],
      },
    },
  });

  await prisma.automation.create({
    data: {
      companyId: company.id,
      name: "Lembrete 2 horas antes",
      description: "Lembrete próximo do horário.",
      trigger: "APPOINTMENT_SCHEDULED",
      active: true,
      steps: {
        create: [
          { order: 1, type: "ACTION", config: JSON.stringify({ action: "NOTIFY", title: "Lembrete de agendamento", body: "Confirme o envio do lembrete de 2 horas.", href: "/agenda" }) },
        ],
      },
    },
  });

  await prisma.automationRun.create({
    data: {
      automationId: autoQuote.id,
      customerId: "cust_beatriz",
      quoteId: "quote_beatriz",
      currentStep: 2,
      nextRunAt: ago(0, 8),
      status: "ACTIVE",
      context: JSON.stringify({
        customerId: "cust_beatriz",
        quoteId: "quote_beatriz",
        customerName: "Beatriz Nunes",
        phone: "19991010003",
      }),
    },
  });

  const history: { customerId: string; type: string; title: string; description?: string; createdAt: Date }[] = [
    { customerId: "cust_ana", type: "CONTACT", title: "Cliente entrou em contato pelo WhatsApp", createdAt: ago(180) },
    { customerId: "cust_ana", type: "QUOTE", title: "Orçamento de R$ 250 enviado", description: "Coloração tom 7.1", createdAt: ago(40) },
    { customerId: "cust_ana", type: "APPOINTMENT", title: "Serviço agendado", description: "Coloração com Marina", createdAt: ago(38) },
    { customerId: "cust_ana", type: "SERVICE", title: "Serviço concluído", description: "Coloração", createdAt: ago(35) },
    { customerId: "cust_ana", type: "PAYMENT", title: "Pagamento registrado", description: "R$ 250 no cartão", createdAt: ago(35) },
    { customerId: "cust_ana", type: "RETURN", title: "Retorno recomendado", description: "Retoque de raiz em 6 semanas", createdAt: ago(35) },
    { customerId: "cust_beatriz", type: "CONTACT", title: "Cliente entrou em contato pelo WhatsApp", createdAt: ago(20) },
    { customerId: "cust_beatriz", type: "QUOTE", title: "Orçamento de R$ 320 enviado", description: "Mechas", createdAt: ago(5) },
    { customerId: "cust_beatriz", type: "FOLLOWUP", title: "Follow-up automático enviado", description: "Mensagem após 2 dias sem resposta", createdAt: ago(3) },
    { customerId: "cust_bruno", type: "CONTACT", title: "Lead convertido em cliente", description: "Origem Walk-in", createdAt: ago(4) },
    { customerId: "cust_bruno", type: "SERVICE", title: "Serviço concluído", description: "Corte masculino", createdAt: ago(4) },
    { customerId: "cust_bruno", type: "PAYMENT", title: "Pagamento registrado", description: "R$ 55 em dinheiro", createdAt: ago(4) },
    { customerId: "cust_carlos", type: "SERVICE", title: "Serviço concluído", description: "Corte masculino", createdAt: ago(43) },
    { customerId: "cust_carlos", type: "PAYMENT", title: "Pagamento atrasado", description: "Saldo de R$ 55", createdAt: ago(10) },
    { customerId: "cust_renata", type: "QUOTE", title: "Orçamento aprovado", description: "Limpeza de pele — R$ 180", createdAt: ago(9) },
    { customerId: "cust_renata", type: "APPOINTMENT", title: "Serviço agendado", description: "Amanhã às 11:00", createdAt: ago(8) },
    { customerId: "cust_mariana", type: "SERVICE", title: "Serviço concluído", description: "Manicure", createdAt: ago(1) },
    { customerId: "cust_mariana", type: "PAYMENT", title: "Pagamento registrado", description: "R$ 50 no Pix", createdAt: ago(1) },
  ];
  await prisma.customerHistory.createMany({ data: history });

  async function convo(
    id: string,
    phone: string,
    customerId: string | null,
    leadId: string | null,
    ownerId: string,
    label: string,
    unread: number,
    messages: { dir: "IN" | "OUT"; body: string; hoursAgo: number; auto?: boolean }[],
  ) {
    const last = messages[messages.length - 1];
    const created = await prisma.conversation.create({
      data: {
        id,
        companyId: company.id,
        customerId,
        leadId,
        phone,
        ownerId,
        label,
        unreadCount: unread,
        lastMessage: last.body,
        lastMessageAt: new Date(Date.now() - last.hoursAgo * 36e5),
        status: "OPEN",
      },
    });
    for (const m of messages) {
      await prisma.message.create({
        data: {
          conversationId: created.id,
          direction: m.dir,
          body: m.body,
          isAutomated: m.auto ?? false,
          createdAt: new Date(Date.now() - m.hoursAgo * 36e5),
        },
      });
    }
  }

  await convo("conv_ana", "19991010001", "cust_ana", null, marina.id, "Retorno", 1, [
    { dir: "IN", body: "Oi, tudo bem? Queria remarcar minha coloração", hoursAgo: 840 },
    { dir: "OUT", body: "Oi Ana! Claro, posso te encaixar. Prefere manhã ou tarde?", hoursAgo: 838 },
    { dir: "IN", body: "Manhã, por volta das 10h", hoursAgo: 836 },
    { dir: "OUT", body: "Perfeito, ficou agendado. Até lá!", hoursAgo: 835 },
    { dir: "OUT", body: "Olá, Ana! Já faz um tempinho desde seu último atendimento. Gostaria de agendar novamente?", hoursAgo: 20, auto: true },
  ]);

  await convo("conv_beatriz", "19991010003", "cust_beatriz", null, juliana.id, "Orçamento", 0, [
    { dir: "IN", body: "Quero fazer mechas, quanto fica?", hoursAgo: 120 },
    { dir: "OUT", body: "Oi Beatriz! O orçamento de mechas fica em R$ 320. Posso te enviar os horários disponíveis.", hoursAgo: 118 },
    { dir: "OUT", body: "Olá, Beatriz! Tudo bem? Passando para saber se conseguiu analisar o orçamento que enviamos.", hoursAgo: 72, auto: true },
  ]);

  await convo("conv_rita", "19992020001", null, "lead_rita", marina.id, "Novo lead", 2, [
    { dir: "IN", body: "Vi vocês no Instagram. Fazem coloração?", hoursAgo: 72 },
    { dir: "OUT", body: "Oi Rita! Fazemos sim. Qual é o seu tom atual e o que você gostaria?", hoursAgo: 70 },
  ]);

  await convo("conv_aline", "19992020005", null, "lead_aline", marina.id, "Atendimento", 1, [
    { dir: "IN", body: "A progressiva danifica muito o cabelo?", hoursAgo: 6 },
    { dir: "OUT", body: "Usamos uma linha mais suave. Posso te passar o orçamento e a duração, combinado?", hoursAgo: 5 },
    { dir: "IN", body: "Pode sim, por favor", hoursAgo: 4 },
  ]);

  await convo("conv_debora", "19992020011", null, "lead_debora", marina.id, "Negociação", 0, [
    { dir: "IN", body: "Se eu fizer mechas e progressiva juntas, tem desconto?", hoursAgo: 30 },
    { dir: "OUT", body: "Consigo deixar o combo em R$ 570. O valor separado seria R$ 620.", hoursAgo: 28 },
    { dir: "IN", body: "Deixa eu ver com meu marido e te falo", hoursAgo: 20 },
  ]);

  await prisma.notification.createMany({
    data: [
      { companyId: company.id, type: "LEAD", title: "Novo lead recebido", body: "Marcos Vieira chegou pelo Google e ainda não foi atendido.", href: "/leads", read: false },
      { companyId: company.id, type: "QUOTE", title: "Orçamento aguardando resposta", body: "5 orçamentos ainda não foram respondidos.", href: "/orcamentos", read: false },
      { companyId: company.id, type: "RETURN", title: "Cliente sem retorno", body: "Ana Souza está há 35 dias sem atendimento.", href: "/recuperacao", read: false },
      { companyId: company.id, type: "APPOINTMENT", title: "Agendamento amanhã", body: "Isabela Freitas às 09:00 — maquiagem social.", href: "/agenda", read: false },
      { companyId: company.id, type: "PAYMENT", title: "Pagamento atrasado", body: "Carlos Lima possui R$ 55 em atraso.", href: "/financeiro", read: false },
      { companyId: company.id, type: "FOLLOWUP", title: "Follow-up realizado", body: "Mensagem automática enviada para Beatriz Nunes.", href: "/whatsapp", read: true },
    ],
  });

  console.log("Studio Bella seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
