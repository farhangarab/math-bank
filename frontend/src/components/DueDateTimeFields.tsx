import { useRef } from "react";

import {
  getTimePartsFromDateTime,
  getTimeValue,
  hours,
  isValidDateValue,
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

  const handleDateTimePick = (value: string) => {
    if (!value) {
      onClear();
      return;
    }

    const [dateValue] = value.split("T");
    const timeParts = getTimePartsFromDateTime(value);

    onChangeDate(dateValue);
    onChangeHour(timeParts.hour);
    onChangeMinute(timeParts.minute);
    onChangePeriod(timeParts.period);
  };

  const timeValue = getTimeValue(hour, minute, period);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
      <div>
        <label
          htmlFor="due-date"
          className="mb-2 block font-semibold text-[#354254]"
        >
          Due date (optional)
        </label>

        <input
          id="due-date"
          type="text"
          value={date}
          onChange={(e) => onChangeDate(e.target.value)}
          placeholder="YYYY-MM-DD"
          className="w-full border border-[#354254] p-2 rounded"
        />
      </div>

      <div>
        <label
          htmlFor="due-time"
          className="mb-2 block font-semibold text-[#354254]"
        >
          Due time (optional)
        </label>

        <div id="due-time" className="grid grid-cols-3 gap-2">
          <select
            aria-label="Due hour"
            value={hour}
            onChange={(e) => onChangeHour(e.target.value)}
            className="w-full border border-[#354254] p-2 rounded"
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
            className="w-full border border-[#354254] p-2 rounded"
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
            className="w-full border border-[#354254] p-2 rounded"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </div>

      <div className="flex items-end gap-2">
        <button
          type="button"
          onClick={handleOpenCalendar}
          className="rounded border border-[#354254] px-3 py-2 font-semibold text-[#354254] hover:bg-[#354254] hover:text-white"
        >
          Calendar
        </button>

        <button
          type="button"
          onClick={onClear}
          className="rounded border border-[#354254] px-3 py-2 font-semibold text-[#354254] hover:bg-[#354254] hover:text-white"
        >
          Clear
        </button>

        <input
          ref={datePickerRef}
          type="datetime-local"
          value={isValidDateValue(date) && timeValue ? `${date}T${timeValue}` : ""}
          min={now}
          onChange={(e) => handleDateTimePick(e.target.value)}
          className="absolute h-px w-px opacity-0"
          tabIndex={-1}
        />
      </div>
    </div>
  );
}

export default DueDateTimeFields;
