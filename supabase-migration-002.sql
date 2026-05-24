-- Migration 002: support compatibility A↔B report product

-- Link purchases to specific attempts (for compatibility reports)
ALTER TABLE purchases
  ADD COLUMN IF NOT EXISTS attempt_id UUID REFERENCES attempts(id) ON DELETE SET NULL;

-- Distinguish product types
ALTER TABLE purchases
  ADD COLUMN IF NOT EXISTS product_type TEXT DEFAULT 'archetype_report';

-- Allow buyer_email to be optional for archetype_report (MP sometimes omits it)
ALTER TABLE purchases
  ALTER COLUMN buyer_email DROP NOT NULL;

CREATE INDEX IF NOT EXISTS purchases_attempt_id_idx   ON purchases(attempt_id);
CREATE INDEX IF NOT EXISTS purchases_product_type_idx ON purchases(product_type);
