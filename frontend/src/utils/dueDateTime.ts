export type TimePeriod = "AM" | "PM";

export type TimeParts = {
  hour: string;
  minute: string;
  period: TimePeriod;
};

export const hours = Array.from({ length: 12 }, (_, index) =>
  String(index + 1)
);

export const minutes = Array.from({ length: 60 }, (_, index) =>
  String(index).padStart(2, "0")
);

export function getLocalDateTimeValue(date: Date) {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 16);
}

export function isDateFormatValid(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function isValidDateValue(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return false;
  }

  const [, year, month, day] = match.map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function isValidTimeValue(value: string) {
  const match = value.match(/^(\d{2}):(\d{2})$/);

  if (!match) {
    return false;
  }

  const [, hour, minute] = match.map(Number);
  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
}

export function getTimePartsFromDateTime(value: string): TimeParts {
  const [, time = ""] = value.split("T");
  const [hourValue = "", minuteValue = ""] = time.split(":");
  const hour24 = Number(hourValue);
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;

  return {
    hour: String(hour12),
    minute: minuteValue,
    period,
  };
}

export function getTimeValue(hour: string, minute: string, period: TimePeriod) {
  if (!hour || !minute || !period) {
    return "";
  }

  let hour24 = Number(hour);

  if (period === "AM" && hour24 === 12) {
    hour24 = 0;
  } else if (period === "PM" && hour24 !== 12) {
    hour24 += 12;
  }

  return `${String(hour24).padStart(2, "0")}:${minute}`;
}
