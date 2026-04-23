import Header from "../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAssignmentAttempts } from "../api/assignment";

type Attempt = {
  attempt_id: number | null;
  student_id: number;
  student_name: string;
  score: number | string | null;
  max_score: number | string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "SUBMITTED";
};

function TeacherSubmissionsPage() {
  const tableColumns = "2fr 1.2fr 1fr 120px";

  const { id } = useParams(); // assignment id
  const navigate = useNavigate();

  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [error, setError] = useState("");

  const handleBack = () => {
    navigate(-1);
  };

  const handleView = (attemptId: number) => {
    navigate(`/attempt/${attemptId}?mode=review`);
  };

  const canReviewAttempt = (attempt: Attempt) => {
    return attempt.status === "SUBMITTED" && attempt.attempt_id !== null;
  };

  const getStatusLabel = (status: Attempt["status"]) => {
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

  const getActionLabel = (attempt: Attempt) => {
    if (!canReviewAttempt(attempt)) return null;
    return "Review";
  };

  const formatScore = (attempt: Attempt) => {
    if (attempt.status !== "SUBMITTED" || attempt.score === null) {
      return "-";
    }

    const scoreValue = Number(attempt.score);
    const maxScoreValue = Number(attempt.max_score);

    if (!Number.isFinite(scoreValue) || !Number.isFinite(maxScoreValue)) {
      return "-";
    }

    const displayScore = Number.isInteger(scoreValue)
      ? scoreValue.toString()
      : scoreValue.toFixed(2);
    const displayMaxScore = Number.isInteger(maxScoreValue)
      ? maxScoreValue.toString()
      : maxScoreValue.toFixed(2);

    return `${displayScore}/${displayMaxScore}`;
  };

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAssignmentAttempts(Number(id));
        setAttempts(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    if (id) load();
  }, [id]);

  return (
    <div className="min-h-screen bg-white">
      <Header title="MATHBANK" leftText="Back" leftAction={handleBack} />

      <div className="flex flex-col items-center mt-10">
        <div className="w-[800px] border border-[#354254] rounded p-6">
          <h1 className="text-xl font-bold text-[#354254] mb-4">Submissions</h1>

          {/* TABLE HEADER */}
          <div
            className="grid border-b border-[#354254] pb-2 font-semibold text-[#354254]"
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
                    className="bg-[#354254] text-white w-[110px] py-1 rounded"
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

          {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default TeacherSubmissionsPage;
