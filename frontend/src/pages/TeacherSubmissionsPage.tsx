import Header from "../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAssignmentAttempts } from "../api/assignment";

type Attempt = {
  attempt_id: number;
  student_name: string;
  score: number;
  status: string;
};

function TeacherSubmissionsPage() {
  const { id } = useParams(); // assignment id
  const navigate = useNavigate();

  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [error, setError] = useState("");

  const handleBack = () => {
    navigate(-1);
  };

  const handleView = (attemptId: number) => {
    navigate(`/attempt/${attemptId}?mode=review`);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAssignmentAttempts(Number(id));
        setAttempts(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    if (id) load();
  }, [id]);

  return (
    <div className="min-h-screen bg-white">
      <Header title="MATHBANK" leftText="Back" leftAction={handleBack} />

      <div className="flex flex-col items-center mt-10">
        <div className="w-[800px] border border-[#354254] rounded p-6">
          <h1 className="text-xl font-bold text-[#354254] mb-4">Submissions</h1>

          {/* TABLE HEADER */}
          <div className="grid grid-cols-4 border-b border-[#354254] pb-2 font-semibold text-[#354254]">
            <div>Name</div>
            <div>Score</div>
            <div>Status</div>
            <div></div>
          </div>

          {/* ROWS */}
          {attempts.map((a) => (
            <div
              key={a.attempt_id}
              className="grid grid-cols-4 border-b border-gray-300 py-3 items-center"
            >
              <div>{a.student_name}</div>

              <div>{a.score}</div>

              <div>{a.status}</div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleView(a.attempt_id)}
                  className="bg-[#354254] text-white px-3 py-1 rounded"
                >
                  View
                </button>
              </div>
            </div>
          ))}

          {attempts.length === 0 && (
            <p className="text-gray-500 mt-4">No submissions yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeacherSubmissionsPage;
