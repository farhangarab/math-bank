import type { Assignment } from "../types/assignment";
import { formatDueDate, formatNumber } from "../utils/format";

type Props = {
  assignments: Assignment[];
  role: "STUDENT" | "TEACHER";
  onOpen?: (assignment: Assignment) => void;
  onEdit?: (id: number) => void;
};

function getStudentActionLabel(status?: string) {
  if (status === "IN_PROGRESS") return "Continue";
  if (status === "SUBMITTED") return "Review";
  return "Start";
}

function formatStudentScore(assignment: Assignment) {
  if (assignment.status !== "SUBMITTED" || assignment.score == null) {
    return "-";
  }

  const score = formatNumber(assignment.score);
  const maxScore = formatNumber(assignment.max_score);

  if (score === "-" || maxScore === "-") return "-";

  return `${score}/${maxScore}`;
}

function AssignmentTable({ assignments, role, onOpen, onEdit }: Props) {
  const studentColumns = "2fr 2fr 1.2fr 1fr 120px";
  const teacherColumns = "2fr 2fr 120px 120px";

  return (
    <div className="w-full">
      {/* HEADER */}
      <div
        className="grid border-b border-brand-primary pb-2 font-semibold text-brand-primary"
        style={{
          gridTemplateColumns:
            role === "STUDENT" ? studentColumns : teacherColumns,
        }}
      >
        <div>Name</div>

        <div>Due</div>

        {role === "STUDENT" && (
          <>
            <div>Status</div>
            <div>Score</div>
            <div>Action</div>
          </>
        )}

        {role === "TEACHER" && (
          <>
            <div>Questions</div>
            <div>Action</div>
          </>
        )}
      </div>

      {/* ROWS */}
      {assignments.map((a) => (
        <div
          key={a.id}
          className="grid border-b border-gray-300 py-3 items-center"
          style={{
            gridTemplateColumns:
              role === "STUDENT" ? studentColumns : teacherColumns,
          }}
        >
          {/* NAME */}
          <div className="text-brand-primary">{a.title}</div>

          {/* DUE */}
          <div>{formatDueDate(a.due_date)}</div>

          {/* STUDENT */}
          {role === "STUDENT" && (
            <>
              <div>{a.status ?? "NOT_STARTED"}</div>
              <div>{formatStudentScore(a)}</div>

              <div className="flex justify-start">
                <button
                  onClick={() => onOpen?.(a)}
                  className="
                    bg-brand-primary
                    text-white
                    w-[110px]
                    py-1
                    rounded
                    hover:bg-brand-primaryHover
                  "
                >
                  {getStudentActionLabel(a.status)}
                </button>
              </div>
            </>
          )}

          {/* TEACHER */}
          {role === "TEACHER" && (
            <>
              <div className="flex justify-start">
                <button
                  onClick={() => onEdit?.(a.id)}
                  className="
                    border
                    border-brand-primary
                    text-brand-primary
                    w-[110px]
                    py-1
                    rounded
                    hover:bg-gray-100
                  "
                >
                  Add
                </button>
              </div>

              <div className="flex justify-start">
                <button
                  onClick={() => onOpen?.(a)}
                  className="
                    bg-brand-primary
                    text-white
                    w-[110px]
                    py-1
                    rounded
                    hover:bg-brand-primaryHover
                  "
                >
                  Submissions
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default AssignmentTable;
