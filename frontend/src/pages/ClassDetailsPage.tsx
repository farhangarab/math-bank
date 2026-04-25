import Header from "../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../router/routes";
import Button from "../components/Button";
import { useEffect, useState } from "react";
import { getAssignments } from "../api/assignment";
import { getClassById } from "../api/class";
import AssignmentTable from "../components/AssignmentTable";
import { startAttempt } from "../api/attempt";
import type { Assignment } from "../types/assignment";
import { useAuth } from "../context/AuthContext";
import { useMessage } from "../hooks/useMessage";
import MessageSlot from "../components/MessageSlot";

function ClassDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classInfo, setClassInfo] = useState<any>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const { message, clearAllMessages, showApiError } = useMessage();
  const { user } = useAuth();

  const handleBack = () => {
    if (user?.role === "STUDENT") {
      navigate(ROUTES.STUDENT_DASHBOARD);
    } else {
      navigate(ROUTES.TEACHER_DASHBOARD);
    }
  };

  const handleCreateAssignment = () => {
    navigate(`/class/${id}/create-assignment`);
  };

  const handleEditAssignment = (assignmentId: number) => {
    navigate(`/assignment/${assignmentId}/edit`);
  };

  const handleOpenAssignment = (assignment: Assignment) => {
    navigate(`/assignment/${assignment.id}/submissions`);
  };

  const handleStart = async (assignment: Assignment) => {
    try {
      clearAllMessages();
      if (assignment.attempt_id) {
        navigate(`/attempt/${assignment.attempt_id}`);
        return;
      }

      const res = await startAttempt(assignment.id);
      navigate(`/attempt/${res.attempt_id}`);
    } catch (err) {
      showApiError(err, "Failed to open assignment.");
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        clearAllMessages();
        const classData = await getClassById(Number(id));
        setClassInfo(classData);

        const assign = await getAssignments(Number(id));

        setAssignments(assign);
      } catch (err: any) {
        showApiError(err, "Failed to load class details.");
      }
    };

    if (id && user) load();
  }, [id, user]);

  return (
    <div className="min-h-screen bg-white">
      <Header title="MATHBANK" leftText="Back" leftAction={handleBack} />

      <div className="flex flex-col items-center mt-10">
        {classInfo && (
          <>
            <h1 className="text-3xl font-bold text-[#354254]">
              {classInfo.class_name}
            </h1>

            {user?.role === "TEACHER" && (
              <p className="mt-2 text-gray-600">
                Class code: {classInfo.class_code}
              </p>
            )}

            {user?.role === "TEACHER" && (
              <div className="mt-4 mb-6">
                <MessageSlot message={message} />
                <Button onClick={handleCreateAssignment}>
                  Create Assignment
                </Button>
              </div>
            )}
          </>
        )}

        <div className="w-[800px] border border-[#354254] rounded p-6 mt-6">
          <h2 className="text-xl font-bold mb-4 text-[#354254]">Assignments</h2>

          <div className="flex flex-col gap-4">
            <AssignmentTable
              assignments={assignments}
              role={user?.role ?? "STUDENT"}
              onEdit={handleEditAssignment}
              onOpen={
                user?.role === "STUDENT" ? handleStart : handleOpenAssignment
              }
            />

            {assignments.length === 0 && (
              <p className="text-gray-500">No assignments yet</p>
            )}

            {user?.role !== "TEACHER" && <MessageSlot message={message} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClassDetailsPage;
