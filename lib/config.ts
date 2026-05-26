// Central app configuration — single source of truth for URL & pricing.

/** Canonical public URL of the site (used for OG tags, sitemap, checkout). */
export const SITE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? 'https://compatibility-seven.vercel.app';

/** Brand name shown across the UI. */
export const BRAND_NAME = '¿Cuánto me conocés?';

/** Currency code for the charge. */
export const PRICE_CURRENCY = 'ARS';

/** Compatibility A↔B report — low-ticket impulse buy at peak emotion. */
export const COMPAT_PRICE_AMOUNT  = 1999;
export const COMPAT_PRICE_DISPLAY = '$1.999';
