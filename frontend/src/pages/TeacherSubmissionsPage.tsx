import Header from "../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAssignmentAttempts } from "../api/assignments";
import { useMessage } from "../hooks/useMessage";
import MessageSlot from "../components/MessageSlot";
import type { AttemptSummary } from "../types/attempt";
import { formatNumber } from "../utils/format";
import Panel from "../components/Panel";

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
      } catch (err: any) {
        showApiError(err, "Failed to load submissions.");
      }
    };

    if (id) load();
  }, [id]);

  return (
    <div className="min-h-screen bg-white">
      <Header title="MATHBANK" leftText="Back" leftAction={handleBack} />

      <div className="flex flex-col items-center mt-10">
        <Panel className="w-[800px]">
          <h1 className="text-xl font-bold text-brand-primary mb-4">Submissions</h1>
          <MessageSlot message={message} />

          {/* TABLE HEADER */}
          <div
            className="grid border-b border-brand-primary pb-2 font-semibold text-brand-primary"
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
              className="grid border-b border-gray-300 py-3 items-center"
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

          {attempts.length === 0 && (
            <p className="text-gray-500 mt-4">No students found for this class.</p>
          )}

        </Panel>
      </div>
    </div>
  );
}

export default TeacherSubmissionsPage;
