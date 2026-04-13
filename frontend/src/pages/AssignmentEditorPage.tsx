import Header from "../components/Header";
import Button from "../components/Button";
import MathToolbar from "../components/MathToolbar";

import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { getAssignmentById } from "../api/assignment";
import { getClassById } from "../api/class";
import { getQuestions, createQuestion } from "../api/question";
import MathPreview from "../components/MathPreview";
import QuestionList from "../components/QuestionList";

function AssignmentEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState<any>(null);
  const [classInfo, setClassInfo] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);

  const [text, setText] = useState("");
  const [answer, setAnswer] = useState("");
  const [points, setPoints] = useState("1");

  const [gradingType, setGradingType] = useState("symbolic");
  const [requireSimplified, setRequireSimplified] = useState(false);

  const [activeInput, setActiveInput] = useState<
    HTMLInputElement | HTMLTextAreaElement | null
  >(null);
  const [activeField, setActiveField] = useState<"question" | "answer" | null>(
    null,
  );

  const handleBack = () => navigate(-1);

  async function loadAll() {
    if (!id) return;
    const a = await getAssignmentById(Number(id));
    setAssignment(a);
    const c = await getClassById(a.class_id);
    setClassInfo(c);
    const qs = await getQuestions(a.id);
    setQuestions(qs);
  }

  useEffect(() => {
    loadAll();
  }, [id]);

  async function handleAddQuestion() {
    if (!text.trim() || !answer.trim()) return;
    const orderIndex = questions.length + 1;

    await createQuestion(
      Number(id),
      text,
      answer,
      orderIndex,
      Number(points),
      gradingType,
      requireSimplified,
    );

    setText("");
    setAnswer("");
    setPoints("1");
    loadAll();
  }

  return (
    <div className="min-h-screen bg-white">
      <Header title="MATHBANK" leftText="Back" leftAction={handleBack} />

      <div className="flex flex-col items-center mt-10 pb-10">
        {classInfo && (
          <h1 className="text-3xl text-[#354254] font-bold">
            {classInfo.class_name}
          </h1>
        )}
        {assignment && (
          <h2 className="text-2xl font-semibold text-[#354254] mt-4">
            {assignment.title}
          </h2>
        )}

        {/*
          FORM CARD
          - flex flex-col so toolbar can sit at the bottom
          - max-h + overflow-y-auto on the inner content makes only
            the fields scroll, while the toolbar stays pinned at the bottom
        */}
        <div
          className="w-[800px] border border-[#354254] rounded mt-6 flex flex-col"
          style={{ maxHeight: "calc(100vh - 220px)" }}
        >
          {/* ── scrollable content area ── */}
          <div className="flex-1 overflow-y-auto p-6">
            <h3 className="text-xl font-bold text-[#354254] mb-6">
              Add Question
            </h3>

            {/* QUESTION */}
            <div className="mb-6">
              <label className="block text-[#354254] font-medium mb-2">
                Question
              </label>
              <textarea
                id="question-input"
                onFocus={(e) => {
                  setActiveInput(e.target);
                  setActiveField("question");
                }}
                placeholder="Write your question..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="border border-[#354254] rounded p-3 w-full min-h-[120px] focus:outline-none"
              />
              <div className="relative mt-1">
                <MathPreview expression={text} noBorder />
                {text && (
                  <span className="absolute top-2 right-2 text-[10px] text-gray-400 uppercase tracking-wide">
                    student view
                  </span>
                )}
              </div>
            </div>

            {/* SETTINGS */}
            <div className="flex gap-4 mb-6 items-center">
              <select
                value={gradingType}
                onChange={(e) => {
                  setGradingType(e.target.value);
                  if (e.target.value !== "symbolic")
                    setRequireSimplified(false);
                }}
                className="border border-[#354254] p-2 rounded"
              >
                <option value="exact">Exact</option>
                <option value="symbolic">Symbolic</option>
                <option value="numeric">Numeric</option>
              </select>

              <label className="flex items-center gap-2 text-[#354254]">
                <input
                  type="checkbox"
                  checked={requireSimplified}
                  disabled={gradingType !== "symbolic"}
                  onChange={(e) => setRequireSimplified(e.target.checked)}
                />
                Require simplified
              </label>
            </div>

            {/* ANSWER */}
            <div className="mb-6">
              <label className="block text-[#354254] font-medium mb-2">
                Answer
              </label>
              <input
                id="answer-input"
                onFocus={(e) => {
                  setActiveInput(e.target);
                  setActiveField("answer");
                }}
                type="text"
                placeholder="Correct answer (e.g., 4*x)"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="border border-[#354254] rounded p-3 w-full focus:outline-none"
              />
              {answer && (
                <div className="relative mt-1">
                  <MathPreview expression={answer} noBorder />
                  <span className="absolute top-2 right-2 text-[10px] text-gray-400 uppercase tracking-wide">
                    student view
                  </span>
                </div>
              )}
            </div>

            {/* POINTS */}
            <input
              type="number"
              placeholder="Points"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="border border-[#354254] rounded p-3 w-full mb-6 focus:outline-none"
            />

            <Button onClick={handleAddQuestion}>Save Question</Button>
          </div>

          {/* ── sticky toolbar — always visible at the bottom of the card ── */}
          <div className="border-t border-[#354254] bg-white shrink-0">
            <MathToolbar
              activeInput={activeInput}
              activeField={activeField}
              onQuestionChange={setText}
              onAnswerChange={setAnswer}
            />
          </div>
        </div>

        {/* QUESTIONS LIST */}
        <div className="w-[800px] border border-[#354254] rounded p-6 mt-6">
          <h3 className="text-xl font-bold text-[#354254] mb-4">Questions</h3>
          <QuestionList questions={questions} />
        </div>
      </div>
    </div>
  );
}

export default AssignmentEditorPage;
