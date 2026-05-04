import type { Assignment } from "../types/assignment";
import Tooltip from "./ui/Tooltip";
import { formatDueDate, formatNumber } from "../utils/format";
import MoreActionsMenu from "./MoreActionsMenu";

type Props = {
  assignments: Assignment[];
  role: "STUDENT" | "TEACHER";
  onOpen?: (assignment: Assignment) => void;
  onEdit?: (id: number) => void;
  onMoreEdit?: (assignment: Assignment) => void;
  onDelete?: (assignment: Assignment) => void;
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

function getStatusTooltip(status?: string) {
  if (status === "IN_PROGRESS") return "You have started this assignment.";
  if (status === "SUBMITTED") return "This assignment has been turned in.";
  return "You have not started this assignment yet.";
}

function AssignmentTable({
  assignments,
  role,
  onOpen,
  onEdit,
  onMoreEdit,
  onDelete,
}: Props) {
  const studentColumns = "2fr 2fr 1.2fr 1fr 120px";
  const teacherColumns = "2fr 2fr 120px 120px 48px";

  return (
    <>
      <div className="space-y-3 min-[821px]:hidden">
        {assignments.map((a) => (
          <article
            key={a.id}
            className="relative rounded-md border border-brand-borderSoft bg-white p-4"
          >
            {role === "TEACHER" && (
              <div className="absolute right-3 top-3">
                <MoreActionsMenu
                  label={`More actions for ${a.title}`}
                  onEdit={() => onMoreEdit?.(a)}
                  onDelete={() => onDelete?.(a)}
                />
              </div>
            )}

            <h3
              className={`truncate text-base font-semibold text-brand-primary ${
                role === "TEACHER" ? "pr-8" : ""
              }`}
            >
              {a.title}
            </h3>

            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <dt className="font-semibold text-gray-500">Due</dt>
                <dd className="text-gray-800">{formatDueDate(a.due_date)}</dd>
              </div>

              {role === "STUDENT" ? (
                <>
                  <div>
                    <dt className="font-semibold text-gray-500">Status</dt>
                    <dd className="text-gray-800">
                      <Tooltip text={getStatusTooltip(a.status)}>
                        <span>{a.status ?? "NOT_STARTED"}</span>
                      </Tooltip>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-500">Score</dt>
                    <dd className="text-gray-800">{formatStudentScore(a)}</dd>
                  </div>
                </>
              ) : null}
            </dl>

            {role === "STUDENT" ? (
              <button
                onClick={() => onOpen?.(a)}
                className="mt-4 w-full rounded-md bg-brand-primary px-4 py-2 font-semibold text-white hover:bg-brand-primaryHover"
              >
                {getStudentActionLabel(a.status)}
              </button>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Tooltip text="Add or review questions." className="w-full">
                  <button
                    onClick={() => onEdit?.(a.id)}
                    className="w-full rounded-md border border-brand-primary px-4 py-2 font-semibold text-brand-primary hover:bg-gray-100"
                  >
                    Add
                  </button>
                </Tooltip>
                <button
                  onClick={() => onOpen?.(a)}
                  className="w-full rounded-md bg-brand-primary px-4 py-2 font-semibold text-white hover:bg-brand-primaryHover"
                >
                  Submissions
                </button>
              </div>
            )}
          </article>
        ))}
      </div>

      <div className="hidden overflow-visible rounded-md border border-brand-borderSoft min-[821px]:block">
        <div
          className="grid gap-3 bg-brand-surface px-4 py-3 font-semibold text-brand-primary"
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
              <div className="text-right">More</div>
            </>
          )}
        </div>

        {assignments.map((a) => (
          <div
            key={a.id}
            className="grid items-center gap-3 border-t border-brand-borderSoft px-4 py-3"
            style={{
              gridTemplateColumns:
                role === "STUDENT" ? studentColumns : teacherColumns,
            }}
          >
            <div className="min-w-0 truncate text-brand-primary">{a.title}</div>
            <div>{formatDueDate(a.due_date)}</div>

            {role === "STUDENT" && (
              <>
                <div>
                  <Tooltip text={getStatusTooltip(a.status)}>
                    <span>{a.status ?? "NOT_STARTED"}</span>
                  </Tooltip>
                </div>
                <div>{formatStudentScore(a)}</div>

                <div className="flex justify-start">
                  <button
                    onClick={() => onOpen?.(a)}
                    className="w-[110px] rounded bg-brand-primary py-1 text-white hover:bg-brand-primaryHover"
                  >
                    {getStudentActionLabel(a.status)}
                  </button>
                </div>
              </>
            )}

            {role === "TEACHER" && (
              <>
                <div className="flex justify-start">
                  <Tooltip text="Add or review questions.">
                    <button
                      onClick={() => onEdit?.(a.id)}
                      className="w-[110px] rounded border border-brand-primary py-1 text-brand-primary hover:bg-gray-100"
                    >
                      Add
                    </button>
                  </Tooltip>
                </div>

                <div className="flex justify-start">
                  <button
                    onClick={() => onOpen?.(a)}
                    className="w-[110px] rounded bg-brand-primary py-1 text-white hover:bg-brand-primaryHover"
                  >
                    Submissions
                  </button>
                </div>
                <div className="flex justify-end">
                  <MoreActionsMenu
                    label={`More actions for ${a.title}`}
                    onEdit={() => onMoreEdit?.(a)}
                    onDelete={() => onDelete?.(a)}
                  />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default AssignmentTable;
