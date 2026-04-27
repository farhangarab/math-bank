import MathPreview from "./MathPreview";
import PencilIcon from "./icons/PencilIcon";
import TrashIcon from "./icons/TrashIcon";
import type { Question } from "../types/question";

type Props = {
  questions: Question[];
};

function QuestionList({ questions }: Props) {
  if (questions.length === 0) {
    return (
      <div className="rounded-md border border-brand-borderSoft bg-brand-surface px-4 py-6 text-center text-sm text-gray-500">
        No questions yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-brand-borderSoft text-xs uppercase tracking-wide text-gray-500">
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
              className="border-b border-brand-borderSoft last:border-b-0"
            >
              <td className="px-3 py-4 align-top font-semibold text-brand-primary">
                {q.order_index ?? index + 1}
              </td>
              <td className="px-3 py-4 align-top text-brand-primary">
                <div className="line-clamp-2 max-w-[420px] overflow-hidden">
                  <span className="font-semibold">
                    (Q{q.order_index ?? index + 1}){" "}
                  </span>
                  <MathPreview expression={q.question_text} compact noBorder />
                </div>
              </td>
              <td className="px-3 py-4 align-top text-brand-primary">
                <div className="line-clamp-2 max-w-[220px] overflow-hidden rounded-md border border-brand-borderSoft bg-brand-surface px-2 py-1">
                  <MathPreview
                    expression={q.correct_answer ?? ""}
                    compact
                    noBorder
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
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
                    aria-label={`Edit question ${q.order_index ?? index + 1}`}
                    title="Edit"
                  >
                    <PencilIcon />
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-status-errorText text-status-errorText hover:bg-status-errorBg"
                    aria-label={`Delete question ${q.order_index ?? index + 1}`}
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
  );
}

export default QuestionList;
