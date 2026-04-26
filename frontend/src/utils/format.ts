export function formatNumber(value: number | string | null | undefined) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) return "-";

  return Number.isInteger(numberValue)
    ? numberValue.toString()
    : numberValue.toFixed(2);
}

export function formatDueDate(dateStr?: string) {
  if (!dateStr) return "-";

  const d = new Date(dateStr);

  if (Number.isNaN(d.getTime())) return "-";

  const date = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = d
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
    .toLowerCase()
    .replace(" ", "");

  return `${date} by ${time}`;
}
