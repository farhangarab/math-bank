import MathPreview from "./MathPreview";
import PencilIcon from "./icons/PencilIcon";
import TrashIcon from "./icons/TrashIcon";
import type { Question } from "../types/question";

type Props = {
  questions: Question[];
  onEditQuestion: (question: Question) => void;
  onDeleteQuestion: (question: Question) => void;
};

function QuestionList({ questions, onEditQuestion, onDeleteQuestion }: Props) {
  if (questions.length === 0) {
    return (
      <div className="rounded-md border border-brand-borderSoft bg-brand-surface px-4 py-6 text-center text-sm text-gray-500">
        No questions yet.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 min-[821px]:hidden">
        {questions.map((q, index) => (
          <article
            key={q.id}
            className="rounded-md border border-brand-borderSoft bg-white p-4"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-surface text-sm font-bold text-brand-primary">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1 text-brand-primary">
                <MathPreview
                  expression={q.question_text}
                  compact
                  noBorder
                  singleLine
                />
              </div>
            </div>

            <dl className="mt-3 grid grid-cols-[1fr_auto] gap-3 text-sm">
              <div className="min-w-0">
                <dt className="font-semibold text-gray-500">Answer</dt>
                <dd className="mt-1 min-w-0 rounded-md border border-brand-borderSoft bg-brand-surface px-2 py-1 text-brand-primary">
                  <MathPreview
                    expression={q.correct_answer ?? ""}
                    compact
                    noBorder
                    singleLine
                  />
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-gray-500">Points</dt>
                <dd className="mt-1 text-brand-primary">{q.points}</dd>
              </div>
            </dl>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => onEditQuestion(q)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
                aria-label={`Edit question ${index + 1}`}
                title="Edit"
              >
                <PencilIcon />
              </button>
              <button
                type="button"
                onClick={() => onDeleteQuestion(q)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-status-errorText text-status-errorText hover:bg-status-errorBg"
                aria-label={`Delete question ${index + 1}`}
                title="Delete"
              >
                <TrashIcon />
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-md border border-brand-borderSoft min-[821px]:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-brand-surface text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="w-14 px-3 py-3 font-semibold">#</th>
              <th className="px-3 py-3 font-semibold">Question</th>
              <th className="w-56 px-3 py-3 font-semibold">Answer</th>
              <th className="w-20 px-3 py-3 font-semibold">Points</th>
              <th className="w-28 px-3 py-3 text-right font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q, index) => (
              <tr
                key={q.id}
                className="border-t border-brand-borderSoft"
              >
                <td className="px-3 py-4 align-top font-semibold text-brand-primary">
                  {index + 1}
                </td>
                <td className="px-3 py-4 align-top text-brand-primary">
                  <div className="max-w-[420px] overflow-hidden">
                    <MathPreview
                      expression={q.question_text}
                      compact
                      noBorder
                      singleLine
                    />
                  </div>
                </td>
                <td className="px-3 py-4 align-top text-brand-primary">
                  <div className="max-w-[220px] overflow-hidden rounded-md border border-brand-borderSoft bg-brand-surface px-2 py-1">
                    <MathPreview
                      expression={q.correct_answer ?? ""}
                      compact
                      noBorder
                      singleLine
                    />
                  </div>
                </td>
                <td className="px-3 py-4 align-top text-brand-primary">
                  {q.points}
                </td>
                <td className="px-3 py-4 align-top">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEditQuestion(q)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
                      aria-label={`Edit question ${index + 1}`}
                      title="Edit"
                    >
                      <PencilIcon />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteQuestion(q)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-status-errorText text-status-errorText hover:bg-status-errorBg"
                      aria-label={`Delete question ${index + 1}`}
                      title="Delete"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default QuestionList;
