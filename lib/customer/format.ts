export function formatNaira(amount: number): string {
  return `₦${Math.round(amount).toLocaleString("en-NG")}`;
}

export function shortOrderId(id: string): string {
  return `GP-${id.slice(0, 8).toUpperCase()}`;
}
