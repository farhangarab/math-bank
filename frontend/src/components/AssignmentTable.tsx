import type { Assignment } from "../types/assignment";

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

//format date like: Feb 8, 2026 by 11:59pm
function formatDueDate(dateStr?: string) {
  if (!dateStr) return "-";

  const d = new Date(dateStr);

  if (Number.isNaN(d.getTime())) return "-";

  const date = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = d
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
    .toLowerCase()
    .replace(" ", "");

  return `${date} by ${time}`;
}

function formatNumber(value: number | string | null | undefined) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) return "-";

  return Number.isInteger(numberValue)
    ? numberValue.toString()
    : numberValue.toFixed(2);
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
        className="grid border-b border-[#354254] pb-2 font-semibold text-[#354254]"
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
            <div>Edit</div>
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
          <div className="text-[#354254]">{a.title}</div>

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
                    bg-[#354254]
                    text-white
                    w-[110px]
                    py-1
                    rounded
                    hover:bg-[#2b3645]
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
                    border-[#354254]
                    text-[#354254]
                    w-[110px]
                    py-1
                    rounded
                    hover:bg-gray-100
                  "
                >
                  Edit
                </button>
              </div>

              <div className="flex justify-start">
                <button
                  onClick={() => onOpen?.(a)}
                  className="
                    bg-[#354254]
                    text-white
                    w-[110px]
                    py-1
                    rounded
                    hover:bg-[#2b3645]
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
