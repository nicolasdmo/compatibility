import type { Metadata } from 'next';
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Providers from '@/components/Providers';
import { SITE_URL } from '@/lib/config';
import './globals.css';

const bricolage = Bricolage_Grotesque({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
});

const inter = Inter({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const jetbrains = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: '¿Cuánto me conocés? — A quién le importás de verdad',
  description:
    'Hacé el test. Mandalo. Vas a saber quién te conoce, quién te escucha, y quién hace que crea que sí. 12 preguntas, 2 minutos.',
  openGraph: {
    title: '¿Cuánto me conocés?',
    description: 'Tu pareja, tu mejor amigo, tu vieja. Vemos quién te conoce de verdad — y a quién le duele fallar.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '¿Cuánto me conocés?',
    description: 'Tu pareja, tu mejor amigo, tu vieja. Vemos quién te conoce de verdad — y a quién le duele fallar.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${bricolage.variable} ${inter.variable} ${jetbrains.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
