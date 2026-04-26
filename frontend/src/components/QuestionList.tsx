import MathPreview from "./MathPreview";
import type { Question } from "../types/question";

type Props = {
  questions: Question[];
};

function QuestionList({ questions }: Props) {
  if (questions.length === 0) {
    return <p>No questions yet</p>;
  }

  return (
    <div>
      {questions.map((q) => (
        <div key={q.id} className="mb-6 p-4 border border-gray-200 rounded">
          {/* Q1 Title */}
          <div className="font-bold text-brand-primary mb-2">Q{q.order_index}</div>

          {/* Question text */}
          <div className="mb-3 whitespace-pre-wrap text-brand-primary">
            <MathPreview expression={q.question_text} />
          </div>

          {/* Answer */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-brand-primary">Answer:</span>

            <div className="border border-brand-primary px-2 py-1 text-sm bg-gray-50">
              <MathPreview expression={q.correct_answer ?? ""} noBorder />
            </div>
          </div>

          {/* Metadata */}
          <div className="text-sm text-gray-500 italic flex gap-5 flex-wrap">
            <span>Points: {q.points}</span>
            <span>Simplified: {q.require_simplified ? "Yes" : "No"}</span>
            <span>Type: {q.grading_type}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default QuestionList;
