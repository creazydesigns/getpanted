export function StatusBadge({ status }: { status: string }) {
  const normalized = status.replace(/\s+/g, "_").toLowerCase();
  return <span className={`admin-status admin-status-${normalized}`}>{status.replace(/_/g, " ")}</span>;
}
