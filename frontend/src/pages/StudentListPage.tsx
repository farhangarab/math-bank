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

      <div className="mx-auto mt-6 flex w-full max-w-[960px] flex-col items-center px-4 sm:mt-12 sm:px-6 lg:mt-14">
        <h1 className="line-clamp-2 max-w-full overflow-hidden text-center text-2xl font-bold leading-snug text-brand-primary sm:text-3xl">
          {className || "Class"}
        </h1>

        <Panel className="mt-5 w-full max-w-[900px] sm:mt-10">
          <h2 className="text-xl font-bold mb-4 text-brand-primary">
            Student List
          </h2>

          <MessageSlot message={message} />

          {students.length === 0 ? (
            <p className="mt-6 text-gray-500">No students in this class yet.</p>
          ) : (
            <>
            <div className="mt-4 space-y-2 min-[821px]:hidden">
              {students.map((student, index) => (
                <article
                  key={student.class_member_id}
                  className="rounded-md border border-brand-borderSoft bg-white p-3 sm:p-4"
                >
                  <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-3">
                    <div className="flex min-w-0 items-start gap-2 sm:gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand-surface text-xs font-bold text-brand-primary sm:h-8 sm:w-8 sm:text-sm">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="break-words text-sm font-semibold text-brand-primary sm:text-base">
                          {student.student_name}
                        </h3>
                        <p className="mt-0.5 break-words text-xs text-gray-700 sm:mt-1 sm:text-sm">
                          {student.email}
                        </p>
                      </div>
                    </div>

                    <div className="pl-9 text-xs sm:min-w-36 sm:pl-0 sm:text-right sm:text-sm">
                      <div className="font-semibold text-gray-500">Joined On</div>
                      <div className="text-gray-800">
                        {formatCreatedDate(student.joined_on)}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStudentToRemove(student)}
                    className="mt-3 w-full rounded-md border border-status-errorText px-3 py-1.5 text-sm font-semibold text-status-errorText transition-colors duration-200 hover:bg-status-errorText hover:text-white sm:mt-4 sm:px-4 sm:py-2"
                  >
                    Remove
                  </button>
                </article>
              ))}
            </div>

            <div className="mt-6 hidden rounded-md border border-brand-borderSoft min-[821px]:block">
              <table className="w-full border-collapse text-left">
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
            </>
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
