'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

/**
 * Drop this in any server component to fire a GA4 event on mount.
 * Usage: <TrackEvent name="purchase" params={{ transaction_id: paymentId }} />
 */
export default function TrackEvent({
  name,
  params,
}: {
  name: string;
  params?: Record<string, string | number | boolean>;
}) {
  useEffect(() => {
    trackEvent(name, params);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
