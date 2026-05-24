import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ARCHETYPES, ARCHETYPE_KEYS } from '@/data/archetypes';
import type { ArchetypeKey } from '@/data/questions';
import ReporteClient from '@/components/ReporteClient';

interface Props {
  params: Promise<{ code: string }>;
}

// Prerender all 6 archetype report pages at build time
export function generateStaticParams() {
  return ARCHETYPE_KEYS.map((code) => ({ code }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const archetype = ARCHETYPES[code?.toLowerCase() as ArchetypeKey];
  if (!archetype) return {};
  return {
    title: `Reporte completo · ${archetype.name} — ¿Cuánto me conocés?`,
    description: `Análisis profundo de ${archetype.name}: ${archetype.tagline}`,
  };
}

export default async function ReportePage({ params }: Props) {
  const { code }  = await params;
  const key       = code?.toLowerCase() as ArchetypeKey;
  const archetype = ARCHETYPES[key];
  if (!archetype) notFound();

  return <ReporteClient code={key} />;
}
