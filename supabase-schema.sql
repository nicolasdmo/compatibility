-- ¿Cuánto me conocés? — schema completo
-- Pegar en Supabase SQL Editor

-- ── A's challenges: tests completados que generan link compartible ────
CREATE TABLE IF NOT EXISTS challenges (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shortcode     TEXT UNIQUE NOT NULL,          -- link público corto: /r/AB12X
  owner_code    TEXT UNIQUE NOT NULL,          -- link privado del dashboard: /d/XYZ999
  creator_name  TEXT NOT NULL,                 -- "Juan"
  creator_email TEXT,                          -- opcional, para notificarle por mail
  answers       JSONB NOT NULL,                -- {"1":"a","2":"c",...}
  archetype     TEXT NOT NULL,                 -- ISLP, ENVF, etc.
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS challenges_shortcode_idx  ON challenges(shortcode);
CREATE INDEX IF NOT EXISTS challenges_owner_code_idx ON challenges(owner_code);
CREATE INDEX IF NOT EXISTS challenges_email_idx      ON challenges(creator_email);

-- ── B's attempts: intentos de adivinar a A ───────────────────────────
CREATE TABLE IF NOT EXISTS attempts (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id        UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  guesser_name        TEXT NOT NULL,
  answers             JSONB NOT NULL,
  score               INTEGER NOT NULL,        -- 0-10 (cantidad de aciertos)
  perceived_archetype TEXT NOT NULL,           -- qué arquetipo creyó B que era A
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS attempts_challenge_id_idx ON attempts(challenge_id);

-- ── Purchases: lo paga A (sobre sí mismo) o B (sobre A) ──────────────
CREATE TABLE IF NOT EXISTS purchases (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id    UUID REFERENCES challenges(id) ON DELETE SET NULL,
  buyer_email     TEXT NOT NULL,
  buyer_name      TEXT,
  buyer_role      TEXT,                        -- 'owner' (es A) | 'guesser' (es B)
  archetype       TEXT NOT NULL,               -- el arquetipo del reporte
  payment_id      TEXT UNIQUE NOT NULL,
  payment_status  TEXT DEFAULT 'approved',
  amount          NUMERIC,
  currency        TEXT DEFAULT 'ARS',
  access_token    TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  email_sent      BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS purchases_email_idx        ON purchases(buyer_email);
CREATE INDEX IF NOT EXISTS purchases_access_token_idx ON purchases(access_token);
CREATE INDEX IF NOT EXISTS purchases_payment_id_idx   ON purchases(payment_id);

-- ── RLS: solo service role lee/escribe (las APIs server-side) ────────
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts   ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "no anon access" ON challenges FOR ALL TO anon USING (false);
CREATE POLICY "no anon access" ON attempts   FOR ALL TO anon USING (false);
CREATE POLICY "no anon access" ON purchases  FOR ALL TO anon USING (false);
