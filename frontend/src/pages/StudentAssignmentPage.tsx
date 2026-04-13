import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAttempt, submitAttempt } from "../api/attempt";

type Question = {
  id: number;
  question_text: string;
  points: number;
};

const StudentAssignmentPage = () => {
  const { attemptId } = useParams();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<any>(null);

  const formatAnswers = () => {
    return Object.entries(answers).map(([questionId, value]) => ({
      question_id: Number(questionId),
      answer_text: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const formatted = formatAnswers();

      const res = await submitAttempt(Number(attemptId), formatted);

      setResult(res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAttempt(Number(attemptId));
        setQuestions(data.questions);
      } catch (err) {
        console.error(err);
      }
    };

    if (attemptId) load();
  }, [attemptId]);

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-xl font-bold text-[#354254] mb-6">
        Attempt {attemptId}
      </h1>

      {currentQuestion && (
        <div className="border border-[#354254] p-6 rounded">
          <h2 className="font-bold mb-2">Q{currentIndex + 1}</h2>

          <p className="mb-4">{currentQuestion.question_text}</p>

          {/* answer input (temporary) */}
          <input
            type="text"
            value={answers[currentQuestion.id] || ""}
            onChange={(e) =>
              handleAnswerChange(currentQuestion.id, e.target.value)
            }
            className="border border-[#354254] px-3 py-2 w-full"
            placeholder="Enter your answer"
          />

          {/* navigation */}
          <div className="flex justify-between mt-6">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => i - 1)}
              className="border px-4 py-1"
            >
              Prev
            </button>

            <button
              disabled={currentIndex === questions.length - 1}
              onClick={() => setCurrentIndex((i) => i + 1)}
              className="border px-4 py-1"
            >
              Next
            </button>
          </div>
          <button
            onClick={handleSubmit}
            className="bg-[#354254] text-white px-4 py-2 rounded mt-6"
          >
            Submit
          </button>
        </div>
      )}
      {result && (
        <div className="mt-6 border border-[#354254] p-4 rounded">
          <h2 className="font-bold text-[#354254]">
            Score: {result.total_score} / {result.max_score}
          </h2>

          <div className="mt-4">
            {result.results.map((r: any, index: number) => (
              <div key={index}>
                Q{index + 1}: {r.is_correct ? "✅" : "❌"}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAssignmentPage;
