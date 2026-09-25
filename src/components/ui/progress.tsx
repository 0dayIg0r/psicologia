export function Progress({ value, max = 100, label }: { value: number; max?: number; label: string }) {
  return (
    <div className="registration-progress" aria-label={label}>
      <span style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
    </div>
  );
}
