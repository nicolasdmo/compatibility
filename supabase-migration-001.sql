-- Migration 001: add question_ids column to challenges
-- Run this in Supabase SQL Editor if you already have the table from the original schema.
-- Safe to run multiple times (uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS).

ALTER TABLE challenges
  ADD COLUMN IF NOT EXISTS question_ids JSONB NOT NULL DEFAULT '[]';
