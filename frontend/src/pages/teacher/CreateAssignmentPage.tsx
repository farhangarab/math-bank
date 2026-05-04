import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  createAssignment,
  getAssignmentById,
  updateAssignment,
} from "../../api/assignments";
import Header from "../../components/layout/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import DueDateTimeFields from "../../components/assignment/DueDateTimeFields";
import { useMessage } from "../../hooks/useMessage";
import MessageSlot from "../../components/ui/MessageSlot";
import {
  getLocalDateTimeValue,
  getTimePartsFromDateTime,
  getTimeValue,
  isDateFormatValid,
  isValidDateValue,
  isValidTimeValue,
  type TimePeriod,
} from "../../utils/dueDateTime";

export default function CreateAssignmentPage() {
  const { id, assignmentId } = useParams();
  const classId = Number(id);
  const editAssignmentId = assignmentId ? Number(assignmentId) : null;
  const isEditMode = editAssignmentId !== null;

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueHour, setDueHour] = useState("");
  const [dueMinute, setDueMinute] = useState("");
  const [duePeriod, setDuePeriod] = useState<TimePeriod>("AM");
  const [originalAssignment, setOriginalAssignment] = useState({
    title: "",
    dueDate: "",
    dueHour: "",
    dueMinute: "",
    duePeriod: "AM" as TimePeriod,
  });

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
  const pageTitle = isEditMode ? "Update Assignment" : "Create Assignment";
  const buttonText = isEditMode ? "Update" : "Create Assignment";

  useEffect(() => {
    async function loadAssignmentForEdit() {
      if (!editAssignmentId) return;

      try {
        clearAllMessages();
        const assignment = await getAssignmentById(editAssignmentId);

        if (assignment.class_id !== classId) {
          showApiError(
            new Error("Assignment does not belong to this class."),
            "Failed to load assignment.",
          );
          return;
        }

        const date = assignment.due_date?.slice(0, 10) ?? "";
        const timeParts = assignment.due_date
          ? getTimePartsFromDateTime(assignment.due_date)
          : { hour: "", minute: "", period: "AM" as TimePeriod };

        setTitle(assignment.title);
        setDueDate(date);
        setDueHour(timeParts.hour);
        setDueMinute(timeParts.minute);
        setDuePeriod(timeParts.period);
        setOriginalAssignment({
          title: assignment.title,
          dueDate: date,
          dueHour: timeParts.hour,
          dueMinute: timeParts.minute,
          duePeriod: timeParts.period,
        });
      } catch (err) {
        showApiError(err, "Failed to load assignment.");
      }
    }

    void loadAssignmentForEdit();
  }, [classId, clearAllMessages, editAssignmentId, showApiError]);

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

  function buildDueDateTime() {
    if (!title.trim()) {
      showFieldError("title", "Title is required.");
      return null;
    }

    const hasDueDate = dueDate.trim() !== "";
    const hasDueHour = dueHour.trim() !== "";
    const hasDueMinute = dueMinute.trim() !== "";
    const hasDueTime = hasDueHour || hasDueMinute;
    let dueDateTime: string | undefined;

    if (hasDueDate || hasDueTime) {
      if (hasDueTime && !hasDueDate) {
        showFieldError("due_date", "Due date is required when due time is selected. Use YYYY-MM-DD.");
        return null;
      }

      if (!isDateFormatValid(dueDate)) {
        showFieldError("due_date", "Due date format is invalid. Use YYYY-MM-DD.");
        return null;
      }

      if (!isValidDateValue(dueDate)) {
        showFieldError(
          "due_date",
          "Due date is invalid. Use YYYY-MM-DD and choose a real calendar date.",
        );
        return null;
      }

      let dueTime = "23:59";

      if (hasDueTime) {
        if (!hasDueHour) {
          showFieldError("due_date", "Due hour is required when due minute is selected.");
          return null;
        }

        dueTime = getTimeValue(dueHour, hasDueMinute ? dueMinute : "00", duePeriod);
      }

      if (hasDueTime && !isValidTimeValue(dueTime)) {
        showFieldError("due_date", "Due time is invalid. Choose hour, minute, and AM or PM.");
        return null;
      }

      dueDateTime = `${dueDate}T${dueTime}`;

      if (dueDateTime < now && dueDateTime !== originalDueDateTime()) {
        showFieldError("due_date", "You can't place a due date/time in the past.");
        return null;
      }
    }

    return dueDateTime ?? "";
  }

  function originalDueDateTime() {
    if (!originalAssignment.dueDate) return "";

    return `${originalAssignment.dueDate}T${getTimeValue(
      originalAssignment.dueHour,
      originalAssignment.dueMinute || "00",
      originalAssignment.duePeriod,
    )}`;
  }

  function currentFormData() {
    return {
      title: title.trim(),
      dueDate: dueDate.trim(),
      dueHour,
      dueMinute,
      duePeriod,
    };
  }

  function hasAssignmentChanges() {
    if (!isEditMode) return true;

    const current = currentFormData();

    return (
      current.title !== originalAssignment.title.trim() ||
      current.dueDate !== originalAssignment.dueDate ||
      current.dueHour !== originalAssignment.dueHour ||
      current.dueMinute !== originalAssignment.dueMinute ||
      current.duePeriod !== originalAssignment.duePeriod
    );
  }

  async function handleSubmit() {
    clearAllMessages();

    const dueDateTime = buildDueDateTime();
    if (dueDateTime === null) return;

    try {
      if (isEditMode && editAssignmentId) {
        await updateAssignment(
          editAssignmentId,
          title.trim(),
          dueDateTime || undefined,
        );

        showSuccess("Assignment updated successfully.");
      } else {
        await createAssignment(title.trim(), classId, dueDateTime || undefined);

        showSuccess("Assignment created successfully.");
      }

      setTimeout(() => {
        navigate(`/class/${classId}`);
      }, 1000);
    } catch (err) {
      showApiError(
        err,
        isEditMode ? "Update assignment failed." : "Create assignment failed.",
      );
    }
  }

  const isUpdateDisabled = isEditMode && !hasAssignmentChanges();

  return (
    <div className="min-h-screen bg-white">
      <Header title="MATHBANK" leftText="Back" leftAction={handleBack} />

      <div className="mx-auto mt-10 w-full max-w-2xl px-4 sm:px-6">
        <h1 className="text-2xl font-bold text-brand-primary mb-6">
          {pageTitle}
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

          <MessageSlot message={message} />

          <span
            className="mt-2 inline-block"
            title={
              isUpdateDisabled ? "Make a change before updating." : undefined
            }
          >
            <Button onClick={handleSubmit} disabled={isUpdateDisabled}>
              {buttonText}
            </Button>
          </span>
        </div>
      </div>
    </div>
  );
}
