# ¿Cuánto me conocés?

Test viral de personalidad con mecánica de "reto": hacés el test, mandás el link a quien quieras, y vemos cuánto te conocen de verdad.

## Mecánica

1. **A** entra al sitio, hace el test (10 preguntas), pone su nombre
2. Recibe un link único: `meconoces.app/r/AB12X`
3. **A** se lo manda a quien quiera (pareja, amigos, familia)
4. **B** abre el link, contesta el test **pensando en A**
5. **B** ve cuánto conoce a **A** (score 0–10) + dónde se equivocó
6. **A** ve en su dashboard todos los intentos
7. Premium opcional: el reporte profundo de **A** ($4.999 ARS)

## Stack

- **Next.js 16** + React 19 (App Router, Turbopack)
- **Supabase** (PostgreSQL, RLS)
- **MercadoPago** Checkout Pro
- **Vercel** (deploy + Analytics + Speed Insights)

## Estructura

```
app/
├── page.tsx              # Landing
├── crear/                # A: crear reto (test + nombre)
├── r/[shortcode]/        # B: recibir reto (contestar pensando en A)
├── match/[attemptId]/    # B: ver score
├── d/[ownerCode]/        # A: dashboard con todos los intentos
├── reporte/[code]/       # Compra + entrega del premium
└── api/
    ├── challenge/        # POST: crear challenge
    ├── attempt/          # POST: registrar intento
    ├── checkout/         # POST: iniciar pago en MP
    └── webhook/mp/       # POST: webhook de MP
```

## Setup local

```bash
npm install
cp .env.example .env.local  # llenar las claves
npm run dev
```

Variables de entorno requeridas (`.env.local`):

- `NEXT_PUBLIC_BASE_URL`
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`
- `MP_ACCESS_TOKEN`, `MP_WEBHOOK_SECRET`

## Schema

Correr `supabase-schema.sql` en el SQL Editor de Supabase.
