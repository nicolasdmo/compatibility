/**
 * Animated gradient orbs in the background.
 * Pure CSS — no JS, no re-renders.
 * Place once near the root of any page.
 */
export default function GradientOrbs() {
  return (
    <div className="orbs-container" aria-hidden>
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
    </div>
  );
}
