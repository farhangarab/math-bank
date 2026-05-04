import Header from "../../components/layout/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAssignmentAttempts } from "../../api/assignments";
import { useMessage } from "../../hooks/useMessage";
import MessageSlot from "../../components/ui/MessageSlot";
import type { AttemptSummary } from "../../types/attempt";
import { formatNumber } from "../../utils/format";
import Panel from "../../components/ui/Panel";

function TeacherSubmissionsPage() {
  const tableColumns = "2fr 1.2fr 1fr 120px";

  const { id } = useParams(); // assignment id
  const navigate = useNavigate();

  const [attempts, setAttempts] = useState<AttemptSummary[]>([]);
  const { message, clearAllMessages, showApiError } = useMessage();

  const handleBack = () => {
    navigate(-1);
  };

  const handleView = (attemptId: number) => {
    navigate(`/attempt/${attemptId}?mode=review`);
  };

  const canReviewAttempt = (attempt: AttemptSummary) => {
    return attempt.status === "SUBMITTED" && attempt.attempt_id !== null;
  };

  const getStatusLabel = (status: AttemptSummary["status"]) => {
    switch (status) {
      case "SUBMITTED":
        return "Submitted";
      case "IN_PROGRESS":
        return "In Progress";
      case "NOT_STARTED":
        return "Not Started";
      default:
        return status;
    }
  };

  const getActionLabel = (attempt: AttemptSummary) => {
    if (!canReviewAttempt(attempt)) return null;
    return "Review";
  };

  const formatScore = (attempt: AttemptSummary) => {
    if (attempt.status !== "SUBMITTED" || attempt.score === null) {
      return "-";
    }

    const displayScore = formatNumber(attempt.score);
    const displayMaxScore = formatNumber(attempt.max_score);

    if (displayScore === "-" || displayMaxScore === "-") return "-";

    return `${displayScore}/${displayMaxScore}`;
  };

  useEffect(() => {
    const load = async () => {
      try {
        clearAllMessages();
        const data = await getAssignmentAttempts(Number(id));
        setAttempts(data);
      } catch (err) {
        showApiError(err, "Failed to load submissions.");
      }
    };

    if (id) void load();
  }, [clearAllMessages, id, showApiError]);

  return (
    <div className="min-h-screen bg-white">
      <Header title="MATHBANK" leftText="Back" leftAction={handleBack} />

      <div className="mx-auto mt-10 flex w-full max-w-[900px] flex-col items-center px-4 sm:px-6">
        <Panel className="w-full">
          <h1 className="text-xl font-bold text-brand-primary mb-4">Submissions</h1>
          <MessageSlot message={message} />

          <div className="space-y-3 min-[721px]:hidden">
            {attempts.map((a) => (
              <article
                key={a.attempt_id ?? `student-${a.student_id}`}
                className="rounded-md border border-brand-borderSoft bg-white p-4"
              >
                <h2 className="break-words text-base font-semibold text-brand-primary">
                  {a.student_name}
                </h2>
                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <dt className="font-semibold text-gray-500">Status</dt>
                    <dd className="text-gray-800">{getStatusLabel(a.status)}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-500">Score</dt>
                    <dd className="text-gray-800">{formatScore(a)}</dd>
                  </div>
                </dl>

                {canReviewAttempt(a) ? (
                  <button
                    onClick={() => handleView(a.attempt_id!)}
                    className="mt-4 w-full rounded-md bg-brand-primary px-4 py-2 font-semibold text-white hover:bg-brand-primaryHover"
                  >
                    {getActionLabel(a)}
                  </button>
                ) : (
                  <div className="mt-4 rounded-md bg-brand-surface px-4 py-2 text-center font-semibold text-gray-500">
                    {a.status === "IN_PROGRESS" ? "Waiting" : "No submission"}
                  </div>
                )}
              </article>
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-md border border-brand-borderSoft min-[721px]:block">
          {/* TABLE HEADER */}
          <div
            className="grid gap-3 bg-brand-surface px-4 py-3 font-semibold text-brand-primary"
            style={{ gridTemplateColumns: tableColumns }}
          >
            <div>Student</div>
            <div>Status</div>
            <div>Score</div>
            <div>Action</div>
          </div>

          {/* ROWS */}
          {attempts.map((a) => (
            <div
              key={a.attempt_id ?? `student-${a.student_id}`}
              className="grid items-center gap-3 border-t border-brand-borderSoft px-4 py-3"
              style={{ gridTemplateColumns: tableColumns }}
            >
              <div>{a.student_name}</div>

              <div>{getStatusLabel(a.status)}</div>

              <div>{formatScore(a)}</div>

              <div className="flex justify-start">
                {canReviewAttempt(a) ? (
                  <button
                    onClick={() => handleView(a.attempt_id!)}
                    className="bg-brand-primary text-white w-[110px] py-1 rounded"
                  >
                    {getActionLabel(a)}
                  </button>
                ) : (
                  <span className="text-gray-400 w-[110px]">
                    {a.status === "IN_PROGRESS" ? "Waiting" : "-"}
                  </span>
                )}
              </div>
            </div>
          ))}
          </div>

          {attempts.length === 0 && (
            <p className="text-gray-500 mt-4">No students found for this class.</p>
          )}

        </Panel>
      </div>
    </div>
  );
}

export default TeacherSubmissionsPage;
