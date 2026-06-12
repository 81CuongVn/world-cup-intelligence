const tl = await fetch('https://api.fifa.com/api/v3/timelines/400021441?language=en').then((r) => r.json());
const COMMENTARY = new Set([
  'Goal!', 'Goal', 'Assist', 'Substitution', 'Yellow Card', 'Red Card', 'VAR',
  'Start Time', 'End Time', 'Coin Toss', 'Penalty', 'Own Goal', 'Goal Prevention',
]);
let n = 0;
for (const ev of tl.Event ?? []) {
  const label = ev.TypeLocalized?.find((t) => t.Locale?.toLowerCase().startsWith('en'))?.Description ?? '';
  if (!COMMENTARY.has(label) && label !== 'Attempt at Goal') continue;
  const text = ev.EventDescription?.find((t) => t.Locale?.toLowerCase().startsWith('en'))?.Description ?? '';
  if (!text.trim()) continue;
  n++;
}
console.log('commentary lines', n);
