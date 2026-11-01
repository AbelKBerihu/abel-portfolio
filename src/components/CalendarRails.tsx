import { useEffect, useState } from 'react';
import { useSettings } from '@/hooks/use-portfolio';

export function CalendarRails() {
  const { settings } = useSettings();
  const [now, setNow] = useState(new Date());

  // calendar_rail_mode can be 'both' | 'left' | 'right' | 'none'
  const mode = settings.calendar_rail_mode || 'both';

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (mode === 'none' || mode === 'disabled' || mode === 'hidden') {
    return null;
  }

  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = (calendar: string) => {
    try {
      return new Intl.DateTimeFormat(`en-US-u-ca-${calendar}`, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(now);
    } catch {
      return now.toLocaleDateString();
    }
  };

  const showLeft = mode === 'both' || mode === 'left';
  const showRight = mode === 'both' || mode === 'right';

  return (
    <div aria-hidden="true" className="pointer-events-none hidden xl:block">
      {showLeft && (
        <div className="calendar-rail calendar-rail-left">
          <span className="text-primary font-jetbrains">ETH /</span> {date('ethiopic')} · {time}
        </div>
      )}
      {showRight && (
        <div className="calendar-rail calendar-rail-right">
          <span className="text-primary font-jetbrains">GREG /</span> {date('gregory')} · {time}
        </div>
      )}
    </div>
  );
}
