// Central app configuration — single source of truth for URL & pricing.
// Keep every price / domain reference pointing here so they never drift apart.

/** Canonical public URL of the site (used for OG tags, sitemap, checkout). */
export const SITE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? 'https://compatibility.vercel.app';

/** Brand name shown across the UI. */
export const BRAND_NAME = '¿Cuánto me conocés?';

/** Premium report price — numeric amount charged through MercadoPago. */
export const PRICE_AMOUNT = 4999;

/** Currency code for the charge. */
export const PRICE_CURRENCY = 'ARS';

/** Human-readable price shown across the UI. */
export const PRICE_DISPLAY = '$4.999';

/** Compatibility A↔B report — low-ticket impulse buy at peak emotion. */
export const COMPAT_PRICE_AMOUNT  = 1999;
export const COMPAT_PRICE_DISPLAY = '$1.999';
