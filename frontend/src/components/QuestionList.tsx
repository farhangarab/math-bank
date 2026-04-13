import MathPreview from "./MathPreview";

type Question = {
  id: number;
  question_text: string;
  correct_answer: string;
  points: number;
  order_index: number;
  grading_type: string;
  require_simplified: boolean;
};

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
          <div className="font-bold text-[#354254] mb-2">Q{q.order_index}</div>

          {/* Question text */}
          <div className="mb-3 whitespace-pre-wrap text-[#354254]">
            <MathPreview expression={q.question_text} />
          </div>

          {/* Answer */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-[#354254]">Answer:</span>

            <div className="border border-[#354254] px-2 py-1 text-sm bg-gray-50">
              <MathPreview expression={q.correct_answer} />
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
