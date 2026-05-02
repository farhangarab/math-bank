import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getClassStudents, removeClassStudent } from "../api/classes";
import ConfirmModal from "../components/ConfirmModal";
import Header from "../components/Header";
import MessageSlot from "../components/MessageSlot";
import Panel from "../components/Panel";
import type { ClassStudent } from "../types/class";
import { useMessage } from "../hooks/useMessage";
import { formatCreatedDate } from "../utils/format";

function StudentListPage() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [className, setClassName] = useState("");
  const [students, setStudents] = useState<ClassStudent[]>([]);
  const [studentToRemove, setStudentToRemove] = useState<ClassStudent | null>(
    null,
  );
  const { message, clearAllMessages, showApiError, showSuccess } = useMessage();

  const loadStudents = async () => {
    try {
      clearAllMessages();
      const data = await getClassStudents(Number(classId));
      setClassName(data.class_name);
      setStudents(data.students);
    } catch (err) {
      showApiError(err, "Failed to load students.");
    }
  };

  const handleRemove = async () => {
    if (!studentToRemove) return;

    const selectedStudent = studentToRemove;
    setStudentToRemove(null);

    try {
      clearAllMessages();
      await removeClassStudent(Number(classId), selectedStudent.student_id);
      setStudents((current) =>
        current.filter(
          (student) =>
            student.class_member_id !== selectedStudent.class_member_id,
        ),
      );
      showSuccess("Student removed from class.");
    } catch (err) {
      showApiError(err, "Failed to remove student.");
    }
  };

  useEffect(() => {
    if (classId) {
      loadStudents();
    }
  }, [classId]);

  return (
    <div className="min-h-screen bg-white">
      <Header
        title="MATHBANK"
        leftText="Back"
        leftAction={() => navigate(-1)}
      />

      <div className="mx-auto mt-10 flex w-full max-w-[960px] flex-col items-center px-4 sm:px-6">
        <h1 className="text-center text-3xl font-bold text-brand-primary">
          {className || "Class"}
        </h1>

        <Panel className="mt-8 w-full max-w-[900px]">
          <h2 className="text-xl font-bold mb-4 text-brand-primary">
            Student List
          </h2>

          <MessageSlot message={message} />

          {students.length === 0 ? (
            <p className="mt-6 text-gray-500">No students in this class yet.</p>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-md border border-brand-borderSoft">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead className="bg-brand-surface text-sm text-brand-primary">
                  <tr>
                    <th className="px-4 py-3 font-bold">#</th>
                    <th className="px-4 py-3 font-bold">Student Name</th>
                    <th className="px-4 py-3 font-bold">Email</th>
                    <th className="px-4 py-3 font-bold">Joined On</th>
                    <th className="px-4 py-3 font-bold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr
                      key={student.class_member_id}
                      className="border-t border-brand-borderSoft"
                    >
                      <td className="px-4 py-3 text-gray-700">{index + 1}</td>
                      <td className="px-4 py-3 font-semibold text-brand-primary">
                        {student.student_name}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {student.email}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {formatCreatedDate(student.joined_on)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setStudentToRemove(student)}
                          className="rounded-md border border-status-errorText px-6 py-2 font-semibold text-status-errorText transition-colors duration-200 hover:bg-status-errorText hover:text-white"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>

      <ConfirmModal
        open={studentToRemove !== null}
        title="Remove Student"
        message={`Remove ${studentToRemove?.student_name ?? "this student"} from this class?`}
        onCancel={() => setStudentToRemove(null)}
        onConfirm={handleRemove}
      />
    </div>
  );
}

export default StudentListPage;
