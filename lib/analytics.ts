/**
 * Analytics utility — wraps gtag so event calls are safe everywhere.
 * gtag is loaded globally via the Script tag in layout.tsx.
 */

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Window { gtag?: (...args: any[]) => void }
}

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', eventName, params);
}

// ── Named events ────────────────────────────────────────────────

export const Analytics = {
  /** Creator shared their challenge link */
  challengeCreated: () =>
    trackEvent('challenge_created'),

  /** Someone opened a challenge link and started answering */
  challengeStarted: (shortcode: string) =>
    trackEvent('challenge_started', { shortcode }),

  /** Someone finished all 12 questions */
  challengeCompleted: (shortcode: string, score: number, total: number) =>
    trackEvent('challenge_completed', { shortcode, score, total }),

  /** User clicked the buy button for compat pack */
  checkoutStarted: (attemptId: string) =>
    trackEvent('checkout_started', { attempt_id: attemptId }),

  /** User successfully purchased the compat pack */
  purchase: (attemptId: string, paymentId: string) =>
    trackEvent('purchase', {
      transaction_id: paymentId,
      attempt_id:     attemptId,
      currency:       'ARS',
    }),

  /** User viewed their full compat result (free or paid) */
  resultViewed: (score: number, total: number) =>
    trackEvent('result_viewed', { score, total }),
};
