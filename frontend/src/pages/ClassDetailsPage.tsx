import Header from "../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../router/routes";
import Button from "../components/Button";
import { useEffect, useState } from "react";
import { getAssignments } from "../api/assignments";
import { getClassById } from "../api/classes";
import AssignmentTable from "../components/AssignmentTable";
import { startAttempt } from "../api/attempts";
import type { Assignment } from "../types/assignment";
import { useAuth } from "../context/AuthContext";
import { useMessage } from "../hooks/useMessage";
import MessageSlot from "../components/MessageSlot";
import type { ClassInfo } from "../types/class";
import Panel from "../components/Panel";
import CopyClassCode from "../components/CopyClassCode";

function ClassDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
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
    navigate(`/assignment/${assignmentId}/questions`);
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

      <div className="mx-auto mt-10 flex w-full max-w-[900px] flex-col items-center px-4 sm:px-6">
        {classInfo && (
          <>
            <h1 className="text-center text-3xl font-bold text-brand-primary">
              {classInfo.class_name}
            </h1>

            {user?.role === "TEACHER" && (
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-gray-600">
                <span>Class code:</span>
                <CopyClassCode code={classInfo.class_code} />
              </div>
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

        <Panel className="mt-6 w-full">
          <h2 className="text-xl font-bold mb-4 text-brand-primary">Assignments</h2>

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
        </Panel>
      </div>
    </div>
  );
}

export default ClassDetailsPage;
