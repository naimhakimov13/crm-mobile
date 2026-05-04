type Props = { title: string; subtitle?: string };

export function EmptyState({ title, subtitle }: Props) {
  return (
    <div className="card text-center text-ink-500">
      <div className="font-medium text-ink-900">{title}</div>
      {subtitle && <div className="text-sm mt-1">{subtitle}</div>}
    </div>
  );
}
