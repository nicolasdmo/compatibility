-- Migration 003: link challenges to authenticated users (optional)
--
-- challenges.user_id stays nullable so anonymous flow keeps working.
-- When the creator was signed in (Google OAuth), we save their auth.users.id
-- so they can list all their challenges in /mis-retos.

ALTER TABLE challenges
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS challenges_user_id_idx ON challenges(user_id);
