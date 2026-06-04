import { useEffect, useState } from 'react';

export type CountdownParts = {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
};

export function getCountdownParts(targetIso: string, now = Date.now()): CountdownParts {
  const target = new Date(targetIso).getTime();
  const totalMs = Math.max(0, target - now);
  const expired = target <= now;
  const totalSec = Math.floor(totalMs / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return { totalMs, days, hours, minutes, seconds, expired };
}

/** Live countdown; updates every second */
export function useCountdown(targetIso: string | null | undefined): CountdownParts {
  const [parts, setParts] = useState<CountdownParts>(() =>
    targetIso ? getCountdownParts(targetIso) : { totalMs: 0, days: 0, hours: 0, minutes: 0, seconds: 0, expired: true },
  );

  useEffect(() => {
    if (!targetIso) return;
    const tick = () => setParts(getCountdownParts(targetIso));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  return parts;
}
