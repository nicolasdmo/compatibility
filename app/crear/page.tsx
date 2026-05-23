import type { Metadata } from 'next';
import CrearFlow from '@/components/CrearFlow';

export const metadata: Metadata = {
  title: 'Crear mi reto — ¿Cuánto me conocés?',
  description: 'Hacé el test, generá tu link y mandáselo a quien quieras. Gratis, 2 minutos.',
};

export default function CrearPage() {
  return <CrearFlow />;
}
