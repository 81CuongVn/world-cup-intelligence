export function ScenarioRealtimeTimeline({ updatedAt }: { updatedAt: string }) {
  return (
    <p className="font-mono-data text-[11px] text-muted-dim">
      Last updated {new Date(updatedAt).toLocaleString()}
    </p>
  );
}
