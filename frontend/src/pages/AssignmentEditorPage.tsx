import Header from "../components/Header";
import Button from "../components/Button";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { getAssignmentById } from "../api/assignment";
import { getClassById } from "../api/class";

function AssignmentEditorPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [assignment, setAssignment] = useState<any>(null);
  const [classInfo, setClassInfo] = useState<any>(null);

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddQuestion = () => {
    console.log("add question");
  };

  useEffect(() => {
    const load = async () => {
      if (!id) return;

      const a = await getAssignmentById(Number(id));
      setAssignment(a);

      const c = await getClassById(a.class_id);
      setClassInfo(c);
    };

    load();
  }, [id]);

  return (
    <div className="min-h-screen bg-white">
      <Header title="MATHBANK" leftText="Back" leftAction={handleBack} />

      <div className="flex flex-col items-center mt-10">
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

        <div className="mt-6">
          <Button onClick={handleAddQuestion}>Add Question</Button>
        </div>

        <div className="w-[800px] border border-[#354254] rounded p-6 mt-6">
          <h3 className="text-xl font-bold text-[#354254] mb-4">Questions</h3>

          <p className="text-gray-500">No questions yet</p>
        </div>
      </div>
    </div>
  );
}

export default AssignmentEditorPage;
