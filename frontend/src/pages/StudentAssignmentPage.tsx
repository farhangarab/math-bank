import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAttempt, saveAttempt, submitAttempt } from "../api/attempt";
import Header from "../components/Header";
import Button from "../components/Button";
import ConfirmModal from "../components/ConfirmModal";

type Question = {
  id: number;
  question_text: string;
  points: number;
  correct_answer?: string;
};

const StudentAssignmentPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [savedAnswers, setSavedAnswers] = useState<Record<number, string>>({});

  const [result, setResult] = useState<any>(null);
  const [attemptStatus, setAttemptStatus] = useState("");
  const isSubmitted = attemptStatus === "SUBMITTED";
  const isReviewMode =
    searchParams.get("mode") === "review" || user?.role === "TEACHER";
  const isReadOnly = isReviewMode || isSubmitted;

  const [saveMessage, setSaveMessage] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const formatAnswers = () => {
    return Object.entries(answers).map(([questionId, value]) => ({
      question_id: Number(questionId),
      answer_text: value,
    }));
  };

  const isChanged = () => {
    return JSON.stringify(answers) !== JSON.stringify(savedAnswers);
  };

  const handleSave = async () => {
    if (isReadOnly) return;

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

  const handleConfirm = async () => {
    if (isReadOnly) return;

    setShowConfirm(false);
    try {
      const formatted = formatAnswers();
      await submitAttempt(Number(attemptId), formatted);

      const submittedAttempt = await getAttempt(Number(attemptId));

      setQuestions(submittedAttempt.questions);
      setAttemptStatus("SUBMITTED");
      setResult({
        total_score: submittedAttempt.total_score,
        results: submittedAttempt.answers.map((a: any) => ({
          question_id: a.question_id,
          is_correct: a.is_correct,
          score: a.score,
        })),
      });
      setSubmitMessage("Assignment submitted successfully.");
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnswerChange = (questionId: number, value: string) => {
    if (isReadOnly) return;

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
  const currentResult = result?.results?.find(
    (r: any) => r.question_id === currentQuestion?.id,
  );
  const showReviewDetails = Boolean(result) && isReadOnly;

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
              disabled={isReadOnly}
              className="border border-[#354254] px-3 py-2 w-full"
              placeholder={
                isReadOnly
                  ? "Answer is read-only in review mode"
                  : "Enter your answer"
              }
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

              {!isReadOnly ? (
                <Button
                  onClick={handleSave}
                  disabled={!isChanged()}
                  variant="ghost"
                >
                  Save Progress
                </Button>
              ) : (
                <div className="text-sm text-gray-500">
                  {isSubmitted ? "Submitted" : "Review mode"}
                </div>
              )}

              <Button
                onClick={() => setCurrentIndex((i) => i + 1)}
                disabled={currentIndex === questions.length - 1}
              >
                Next
              </Button>
            </div>
            {/* submit */}
            {!isReadOnly && (
              <div className="mt-6 flex justify-end">
                <Button onClick={() => setShowConfirm(true)}>Submit</Button>
              </div>
            )}
            {/* review */}
            {showReviewDetails && (
              <div className="mt-6 text-sm border-t pt-4">
                <p>
                  <strong>Your answer:</strong>{" "}
                  {answers[currentQuestion.id] || "-"}
                </p>

                {currentQuestion.correct_answer && (
                  <p>
                    <strong>Correct answer:</strong>{" "}
                    {currentQuestion.correct_answer}
                  </p>
                )}

                <p>
                  <strong>Result:</strong>{" "}
                  {currentResult?.is_correct ? "Correct✅" : "Incorrect❌"}
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
