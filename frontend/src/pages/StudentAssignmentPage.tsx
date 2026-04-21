import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAttempt, saveAttempt, submitAttempt } from "../api/attempt";
import Header from "../components/Header";
import Button from "../components/Button";
import ConfirmModal from "../components/ConfirmModal";

type Question = {
  id: number;
  question_text: string;
  points: number;
  correct_answer: string;
};

const StudentAssignmentPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [savedAnswers, setSavedAnswers] = useState<Record<number, string>>({});

  const [result, setResult] = useState<any>(null);
  const [attemptStatus, setAttemptStatus] = useState("");
  const isSubmitted = attemptStatus === "SUBMITTED";

  const [saveMessage, setSaveMessage] = useState("");

  const [submitMessage, setSubmitMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  // ---------------------------
  // format answers for API
  // ---------------------------
  const formatAnswers = () => {
    return Object.entries(answers).map(([questionId, value]) => ({
      question_id: Number(questionId),
      answer_text: value,
    }));
  };

  // ---------------------------
  // detect changes
  // ---------------------------
  const isChanged = () => {
    return JSON.stringify(answers) !== JSON.stringify(savedAnswers);
  };

  // ---------------------------
  // save progress
  // ---------------------------
  const handleSave = async () => {
    try {
      const formatted = formatAnswers();

      await saveAttempt(Number(attemptId), formatted);

      setSavedAnswers(answers);

      setSaveMessage("Progress saved successfully!");

      setTimeout(() => {
        setSaveMessage("");
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------------------
  // Submit Confirmation
  // ---------------------------
  const handleConfirm = async () => {
    setShowConfirm(false);
    try {
      const formatted = formatAnswers();

      const res = await submitAttempt(Number(attemptId), formatted);
      setResult(res);
      setAttemptStatus("SUBMITTED");
      setSubmitMessage("Assignment submitted successfully.");
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------------------
  // input change
  // ---------------------------
  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // ---------------------------
  // load attempt
  // ---------------------------
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAttempt(Number(attemptId));

        setQuestions(data.questions);
        setAttemptStatus(data.status);

        const saved: Record<number, string> = {};
        data.answers.forEach((a: any) => {
          saved[a.question_id] = a.answer_text;
        });

        setAnswers(saved);
        setSavedAnswers(saved);

        if (data.status === "SUBMITTED") {
          setResult({
            total_score: data.total_score,
            results: data.answers.map((a: any) => ({
              question_id: a.question_id,
              is_correct: a.is_correct,
              score: a.score,
            })),
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (attemptId) load();
  }, [attemptId]);

  const currentQuestion = questions[currentIndex];

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <div className="min-h-screen bg-white">
      <Header leftText="Back" leftAction={() => navigate(-1)} />

      <div className="p-10 mx-auto">
        {currentQuestion && (
          <div className="w-full">
            {submitMessage && (
              <div className="mb-4 text-blue-600 font-semibold">
                {submitMessage}
              </div>
            )}
            {/* question */}
            <h2 className="font-bold mb-2 text-[#354254]">
              Q{currentIndex + 1}
            </h2>

            <p className="mb-4">{currentQuestion.question_text}</p>

            {/* input */}
            <input
              type="text"
              value={answers[currentQuestion.id] || ""}
              onChange={(e) =>
                handleAnswerChange(currentQuestion.id, e.target.value)
              }
              disabled={isSubmitted}
              className="border border-[#354254] px-3 py-2 w-full"
              placeholder="Enter your answer"
            />
            {saveMessage && (
              <div className="mb-4 text-green-600 font-semibold">
                {saveMessage}
              </div>
            )}
            {/* navigation */}
            <div className="flex justify-between items-center mt-6">
              <Button
                onClick={() => setCurrentIndex((i) => i - 1)}
                disabled={currentIndex === 0}
              >
                Prev
              </Button>

              <Button
                onClick={handleSave}
                disabled={!isChanged() || isSubmitted}
                variant="ghost"
              >
                Save Progress
              </Button>

              <Button
                onClick={() => setCurrentIndex((i) => i + 1)}
                disabled={currentIndex === questions.length - 1}
              >
                Next
              </Button>
            </div>

            {/* submit */}
            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => setShowConfirm(true)}
                disabled={isSubmitted}
              >
                Submit
              </Button>
            </div>

            {/* review */}
            {result && (
              <div className="mt-6 text-sm border-t pt-4">
                <p>
                  <strong>Your answer:</strong>{" "}
                  {answers[currentQuestion.id] || "-"}
                </p>

                <p>
                  <strong>Correct answer:</strong>{" "}
                  {currentQuestion.correct_answer}
                </p>

                <p>
                  <strong>Result:</strong>{" "}
                  {result.results.find(
                    (r: any) => r.question_id === currentQuestion.id,
                  )?.is_correct
                    ? "✅"
                    : "❌"}
                </p>
              </div>
            )}
            {/* Confirmation Model */}
            <ConfirmModal
              open={showConfirm}
              title="Submit Assignment?"
              message="Once you submit, your answers will be locked and cannot be changed."
              onCancel={() => setShowConfirm(false)}
              onConfirm={handleConfirm}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAssignmentPage;
