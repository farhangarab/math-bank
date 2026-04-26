import { useRef } from "react";

import {
  hours,
  minutes,
  type TimePeriod,
} from "../utils/dueDateTime";

type Props = {
  date: string;
  hour: string;
  minute: string;
  now: string;
  period: TimePeriod;
  onChangeDate: (date: string) => void;
  onChangeHour: (hour: string) => void;
  onChangeMinute: (minute: string) => void;
  onChangePeriod: (period: TimePeriod) => void;
  onClear: () => void;
  error?: string;
};

function DueDateTimeFields({
  date,
  hour,
  minute,
  now,
  period,
  onChangeDate,
  onChangeHour,
  onChangeMinute,
  onChangePeriod,
  onClear,
  error,
}: Props) {
  const datePickerRef = useRef<HTMLInputElement>(null);

  const handleOpenCalendar = () => {
    const datePicker = datePickerRef.current;

    if (!datePicker) {
      return;
    }

    const picker = datePicker as HTMLInputElement & { showPicker?: () => void };

    if (picker.showPicker) {
      picker.showPicker();
      return;
    }

    picker.click();
  };

  const handleDatePick = (value: string) => {
    if (!value) {
      onClear();
      return;
    }

    onChangeDate(value);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto] lg:items-start">
      <div>
        <label
          htmlFor="due-date"
          className="mb-2 block font-semibold text-brand-primary"
        >
          Due date (optional)
        </label>

        <input
          id="due-date"
          type="text"
          value={date}
          onChange={(e) => onChangeDate(e.target.value)}
          placeholder="YYYY-MM-DD"
          aria-invalid={Boolean(error)}
          className={`w-full rounded border p-2 ${
            error ? "border-status-errorText bg-status-errorBg" : "border-brand-primary"
          }`}
        />
        {error && <p className="mt-1 text-sm text-status-errorText">{error}</p>}
      </div>

      <div>
        <label
          htmlFor="due-time"
          className="mb-2 block font-semibold text-brand-primary"
        >
          Due time (optional)
        </label>

        <div id="due-time" className="grid grid-cols-3 gap-2">
          <select
            aria-label="Due hour"
            value={hour}
            onChange={(e) => onChangeHour(e.target.value)}
            className={`w-full rounded border p-2 ${
              error ? "border-status-errorText bg-status-errorBg" : "border-brand-primary"
            }`}
          >
            <option value="">Hour</option>
            {hours.map((hourOption) => (
              <option key={hourOption} value={hourOption}>
                {hourOption}
              </option>
            ))}
          </select>

          <select
            aria-label="Due minute"
            value={minute}
            onChange={(e) => onChangeMinute(e.target.value)}
            className={`w-full rounded border p-2 ${
              error ? "border-status-errorText bg-status-errorBg" : "border-brand-primary"
            }`}
          >
            <option value="">Min</option>
            {minutes.map((minuteOption) => (
              <option key={minuteOption} value={minuteOption}>
                {minuteOption}
              </option>
            ))}
          </select>

          <select
            aria-label="Due AM or PM"
            value={period}
            onChange={(e) => onChangePeriod(e.target.value as TimePeriod)}
            className={`w-full rounded border p-2 ${
              error ? "border-status-errorText bg-status-errorBg" : "border-brand-primary"
            }`}
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </div>

      <div className="flex items-start gap-2 pt-8">
        <button
          type="button"
          onClick={handleOpenCalendar}
          className="rounded border border-brand-primary px-3 py-2 font-semibold text-brand-primary hover:bg-brand-primary hover:text-white"
        >
          Calendar
        </button>

        <button
          type="button"
          onClick={onClear}
          className="rounded border border-brand-primary px-3 py-2 font-semibold text-brand-primary hover:bg-brand-primary hover:text-white"
        >
          Clear
        </button>

        <input
          ref={datePickerRef}
          type="date"
          value={date}
          min={now.slice(0, 10)}
          onChange={(e) => handleDatePick(e.target.value)}
          className="absolute h-px w-px opacity-0"
          tabIndex={-1}
        />
      </div>
    </div>
  );
}

export default DueDateTimeFields;
