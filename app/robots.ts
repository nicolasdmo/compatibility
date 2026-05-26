import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // API routes, token-gated compat reports, private dashboards & match pages
      disallow: ['/api/', '/compat/', '/d/', '/match/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
