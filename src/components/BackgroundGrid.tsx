/** Fixed, decorative drifting lime grid with travelling signal pulses. Pure CSS; stops under reduced motion. */
export const BackgroundGrid = () => (
  <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
    <div className="bg-grid absolute -inset-[80px]" />
    <div className="bg-grid-glow absolute inset-0" />
    {[12, 31, 54, 73, 88].map((left, i) => (
      <span key={left} className="bg-pulse-v" style={{ left: `${left}%`, animationDelay: `${i * 2.3}s`, animationDuration: `${9 + i * 1.7}s` }} />
    ))}
    {[22, 47, 68].map((top, i) => (
      <span key={top} className="bg-pulse-h" style={{ top: `${top}%`, animationDelay: `${1 + i * 3.1}s`, animationDuration: `${12 + i * 2}s` }} />
    ))}
  </div>
);
