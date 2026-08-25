# Atendia

Hub comercial para PMEs que vendem e atendem pelo WhatsApp: lead → cliente → orçamento → follow-up → agendamento → serviço → pagamento → pós-venda.

Site institucional + demo ao vivo com o tenant **Studio Bella** (salão em Campinas).

## Demo

- Site: `/` · Preços: `/precos` · Casos: `/casos` · Sobre: `/sobre` · Contato: `/contato`
- App: `/login`
- Conta: `ivan.p@example.net`
- Senha: `demo1234`

```bash
npm install
cp .env.example .env
npm run setup
npm run dev
```

Abra `http://localhost:3000`.

## Stack

Next.js App Router, Prisma + SQLite, sessões em cookie, WhatsApp mock (pronto para Cloud API).
