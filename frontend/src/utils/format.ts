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

export function formatSubmittedDate(dateStr?: string | null) {
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

  return `${date} at ${time}`;
}
// format class created date
export function formatCreatedDate(dateText?: string | null) {
  if (!dateText) return "-";

  const date = new Date(dateText);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function getFirstName(fullName?: string | null, fallback = "there") {
  const name = fullName?.trim();

  if (!name) return fallback;

  return name.split(/\s+/)[0];
}
