import { Bilingual, BiHint } from '../i18n/Bilingual';
import { DataKindBadge } from '../ui/DataKindBadge';

export type Hint = {
  id: string;
  vi: string;
  en: string;
  type: string;
};

type Props = {
  hints: Hint[];
};

export function ProbabilityHintsPanel({ hints }: Props) {
  if (!hints.length) return null;

  return (
    <section className="panel space-y-3 border-pressing/20 shadow-pressing/5">
      <div className="flex flex-wrap items-center gap-2">
        <Bilingual k="match.hints" as="h3" className="text-sm font-semibold uppercase tracking-wider text-pressing" />
        <DataKindBadge kind="predicted" compact />
      </div>
      <Bilingual k="match.hintsNote" as="p" className="text-xs" />
      <ul className="space-y-2">
        {hints.map((h) => (
          <BiHint key={h.id} vi={h.vi} en={h.en} />
        ))}
      </ul>
    </section>
  );
}
