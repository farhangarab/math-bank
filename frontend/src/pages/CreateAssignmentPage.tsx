import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { createAssignment } from "../api/assignment";
import Header from "../components/Header";
import Input from "../components/Input";
import Button from "../components/Button";
import DueDateTimeFields from "../components/DueDateTimeFields";
import Alert from "../components/Alert";
import { useMessage } from "../hooks/useMessage";
import {
  getLocalDateTimeValue,
  getTimeValue,
  isDateFormatValid,
  isValidDateValue,
  isValidTimeValue,
  type TimePeriod,
} from "../utils/dueDateTime";

export default function CreateAssignmentPage() {
  const { id } = useParams();
  const classId = Number(id);

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueHour, setDueHour] = useState("");
  const [dueMinute, setDueMinute] = useState("");
  const [duePeriod, setDuePeriod] = useState<TimePeriod>("AM");

  const {
    message,
    fieldErrors,
    clearAllMessages,
    clearFieldError,
    showApiError,
    showFieldError,
    showSuccess,
  } = useMessage();

  const now = getLocalDateTimeValue(new Date());

  const handleBack = () => {
    navigate(-1);
  };

  const handleClearDueDateTime = () => {
    setDueDate("");
    setDueHour("");
    setDueMinute("");
    setDuePeriod("AM");
    clearAllMessages();
  };

  async function handleCreate() {
    clearAllMessages();

    if (!title.trim()) {
      showFieldError("title", "Title is required.");
      return;
    }

    const hasDueDate = dueDate.trim() !== "";
    const hasDueTime = dueHour.trim() !== "" || dueMinute.trim() !== "";
    const hasCompleteDueTime = dueHour.trim() !== "" && dueMinute.trim() !== "";
    let dueDateTime: string | undefined;

    if (hasDueDate || hasDueTime) {
      if (!isDateFormatValid(dueDate)) {
        showFieldError("due_date", "Due date format is invalid. Use YYYY-MM-DD.");
        return;
      }

      if (!isValidDateValue(dueDate)) {
        showFieldError("due_date", "Due date is invalid. Choose a real calendar date.");
        return;
      }

      const dueTime = hasDueTime
        ? getTimeValue(dueHour, dueMinute, duePeriod)
        : "23:59";

      if (hasDueTime && (!hasCompleteDueTime || !isValidTimeValue(dueTime))) {
        showFieldError("due_date", "Due time is invalid. Choose hour, minute, and AM or PM.");
        return;
      }

      dueDateTime = `${dueDate}T${dueTime}`;

      if (dueDateTime < now) {
        showFieldError("due_date", "You can't place a due date/time in the past.");
        return;
      }
    }

    try {
      await createAssignment(title, classId, dueDateTime);

      showSuccess("Assignment created successfully.");

      setTimeout(() => {
        navigate(`/class/${classId}`);
      }, 1000);
    } catch (err: any) {
      showApiError(err, "Create assignment failed.");
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
            error={fieldErrors.title}
            onChange={(e) => {
              setTitle(e.target.value);
              clearFieldError("title");
            }}
          />

          <DueDateTimeFields
            date={dueDate}
            hour={dueHour}
            minute={dueMinute}
            now={now}
            period={duePeriod}
            error={fieldErrors.due_date}
            onChangeDate={(value) => {
              setDueDate(value);
              clearFieldError("due_date");
            }}
            onChangeHour={(value) => {
              setDueHour(value);
              clearFieldError("due_date");
            }}
            onChangeMinute={(value) => {
              setDueMinute(value);
              clearFieldError("due_date");
            }}
            onChangePeriod={(value) => {
              setDuePeriod(value);
              clearFieldError("due_date");
            }}
            onClear={handleClearDueDateTime}
          />

          {message && <Alert type={message.type} message={message.text} />}

          <Button onClick={handleCreate}>Create Assignment</Button>
        </div>
      </div>
    </div>
  );
}
