/** Hiển thị dung lượng phù hợp (B → KB → MB → GB). */
export function formatBytes(bytes: number, fractionDigits = 1): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "0 B";
  if (bytes < 1024) return `${Math.round(bytes)} B`;

  const units = ["KB", "MB", "GB", "TB"] as const;
  let v = bytes / 1024;
  let u = 0;
  while (v >= 1024 && u < units.length - 1) {
    v /= 1024;
    u += 1;
  }
  const rounded =
    v >= 100 || fractionDigits === 0 ? Math.round(v) : Number(v.toFixed(fractionDigits));
  return `${rounded} ${units[u]}`;
}
