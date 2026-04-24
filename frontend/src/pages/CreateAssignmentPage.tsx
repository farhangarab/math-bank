import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { createAssignment } from "../api/assignment";
import Header from "../components/Header";
import Input from "../components/Input";
import Button from "../components/Button";

function getLocalDateTimeValue(date: Date) {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 16);
}

function isValidDateValue(value: string) {
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

function isValidTimeValue(value: string) {
  const match = value.match(/^(\d{2}):(\d{2})$/);

  if (!match) {
    return false;
  }

  const [, hour, minute] = match.map(Number);
  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
}

function getTimePartsFromDateTime(value: string) {
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

function getTimeValue(hour: string, minute: string, period: string) {
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

const hours = Array.from({ length: 12 }, (_, index) => String(index + 1));
const minutes = Array.from({ length: 60 }, (_, index) =>
  String(index).padStart(2, "0")
);

export default function CreateAssignmentPage() {
  const { id } = useParams();
  const classId = Number(id);

  const navigate = useNavigate();
  const datePickerRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueHour, setDueHour] = useState("");
  const [dueMinute, setDueMinute] = useState("");
  const [duePeriod, setDuePeriod] = useState("AM");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const now = getLocalDateTimeValue(new Date());

  const handleBack = () => {
    navigate(-1);
  };

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
      setDueDate("");
      setDueHour("");
      setDueMinute("");
      setDuePeriod("AM");
      return;
    }

    const [dateValue] = value.split("T");
    const timeParts = getTimePartsFromDateTime(value);

    setDueDate(dateValue);
    setDueHour(timeParts.hour);
    setDueMinute(timeParts.minute);
    setDuePeriod(timeParts.period);
  };

  const handleClearDueDateTime = () => {
    setDueDate("");
    setDueHour("");
    setDueMinute("");
    setDuePeriod("AM");
    setError("");
    setSuccess("");
  };

  async function handleCreate() {
    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    const hasDueDate = dueDate.trim() !== "";
    const hasDueTime = dueHour.trim() !== "" || dueMinute.trim() !== "";
    let dueDateTime: string | undefined;

    if (hasDueDate || hasDueTime) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
        setError("Due date format is invalid. Use YYYY-MM-DD.");
        return;
      }

      if (!isValidDateValue(dueDate)) {
        setError("Due date is invalid. Choose a real calendar date.");
        return;
      }

      const dueTime = getTimeValue(dueHour, dueMinute, duePeriod);

      if (!dueTime || !isValidTimeValue(dueTime)) {
        setError("Due time is invalid. Choose hour, minute, and AM or PM.");
        return;
      }

      dueDateTime = `${dueDate}T${dueTime}`;

      if (dueDateTime < now) {
        setError("You can't place a due date/time in the past.");
        return;
      }
    }

    try {
      await createAssignment(title, classId, dueDateTime);

      setSuccess("Assignment created successfully");

      setTimeout(() => {
        navigate(`/class/${classId}`);
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header title="MATHBANK" leftText="Back" leftAction={handleBack} />

      <div className="max-w-2xl mx-auto mt-10">
        <h1 className="text-2xl font-bold text-[#354254] mb-6">
          Create Assignment
        </h1>

        <div className="space-y-4">
          <Input
            placeholder="Assignment title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

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
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
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
                  value={dueHour}
                  onChange={(e) => setDueHour(e.target.value)}
                  className="w-full border border-[#354254] p-2 rounded"
                >
                  <option value="">Hour</option>
                  {hours.map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  ))}
                </select>

                <select
                  aria-label="Due minute"
                  value={dueMinute}
                  onChange={(e) => setDueMinute(e.target.value)}
                  className="w-full border border-[#354254] p-2 rounded"
                >
                  <option value="">Min</option>
                  {minutes.map((minute) => (
                    <option key={minute} value={minute}>
                      {minute}
                    </option>
                  ))}
                </select>

                <select
                  aria-label="Due AM or PM"
                  value={duePeriod}
                  onChange={(e) => setDuePeriod(e.target.value)}
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
                onClick={handleClearDueDateTime}
                className="rounded border border-[#354254] px-3 py-2 font-semibold text-[#354254] hover:bg-[#354254] hover:text-white"
              >
                Clear
              </button>

              <input
                ref={datePickerRef}
                type="datetime-local"
                value={
                  isValidDateValue(dueDate) &&
                  getTimeValue(dueHour, dueMinute, duePeriod)
                    ? `${dueDate}T${getTimeValue(dueHour, dueMinute, duePeriod)}`
                    : ""
                }
                min={now}
                onChange={(e) => handleDateTimePick(e.target.value)}
                className="absolute h-px w-px opacity-0"
                tabIndex={-1}
              />
            </div>
          </div>

          {error && <p className="text-red-600 font-medium">{error}</p>}

          {success && <p className="text-green-600 font-medium">{success}</p>}

          <Button onClick={handleCreate}>Create Assignment</Button>
        </div>
      </div>
    </div>
  );
}
