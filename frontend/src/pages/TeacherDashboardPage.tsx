import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Header from "../components/Header";
import { ROUTES } from "../router/routes";
import { useEffect, useState } from "react";
import { getTeacherClasses } from "../api/classes";
import { useAuth } from "../context/AuthContext";
import { useMessage } from "../hooks/useMessage";
import MessageSlot from "../components/MessageSlot";
import type { ClassInfo } from "../types/class";
import Panel from "../components/Panel";
import { formatCreatedDate, getFirstName } from "../utils/format";
import CopyClassCode from "../components/CopyClassCode";
import MoreActionsMenu from "../components/MoreActionsMenu";

function TeacherDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleView = (id: number) => {
    navigate(`/class/${id}`);
  };

  const handleViewStudents = (id: number) => {
    navigate(`/teacher/classes/${id}/students`);
  };

  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const { message, clearAllMessages, showApiError } = useMessage();

  useEffect(() => {
    const loadClasses = async () => {
      try {
        clearAllMessages();
        const data = await getTeacherClasses();

        setClasses(data);
      } catch (err: any) {
        showApiError(err, "Failed to load classes.");
      }
    };

    if (user) {
      loadClasses();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* MAIN CONTAINER */}
      <div className="mx-auto mt-10 flex w-full max-w-[960px] flex-col items-center px-4 sm:px-6">
        {/* Title */}
        <h1 className="text-center text-3xl font-bold text-brand-primary">
          Teacher Dashboard
        </h1>

        <p className="mb-6 mt-2 text-center">
          Welcome back, {getFirstName(user?.full_name)}! 👋
        </p>

        {/* Create class button */}
        <div className="mb-8">
          <MessageSlot message={message} />
          <Button onClick={() => navigate(ROUTES.CREATE_CLASS)}>
            Create Class
          </Button>
        </div>

        {/* My classes section */}
        <Panel className="w-full max-w-[900px]">
          <h2 className="text-xl font-bold mb-4 text-brand-primary">
            My Classes
          </h2>

          {classes.length === 0 ? (
            <p className="mt-6 text-gray-500">No classes yet.</p>
          ) : (
            <>
            <div className="mt-4 space-y-2 min-[821px]:hidden">
              {classes.map((c) => (
                <article
                  key={c.id}
                  className="relative rounded-md border border-brand-borderSoft bg-white p-3 sm:p-4"
                >
                  <div className="absolute right-3 top-3">
                    <MoreActionsMenu label={`More actions for ${c.class_name}`} />
                  </div>

                  <h3 className="truncate pr-8 text-sm font-semibold text-brand-primary sm:text-base">
                    {c.class_name}
                  </h3>
                  <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs sm:gap-x-4 sm:text-sm">
                    <div>
                      <dt className="font-semibold text-gray-500">Class Code</dt>
                      <dd className="text-gray-800">
                        <CopyClassCode code={c.class_code} />
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-gray-500">Students</dt>
                      <dd>
                        <button
                          type="button"
                          onClick={() => handleViewStudents(c.id)}
                          aria-label={`Open student list for ${c.class_name}`}
                          className="font-semibold text-brand-primary underline"
                        >
                          {c.students_count ?? 0}
                        </button>
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-gray-500">Assignments</dt>
                      <dd className="text-gray-800">
                        {c.assignments_count ?? 0}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-gray-500">Created</dt>
                      <dd className="text-gray-800">
                        {formatCreatedDate(c.created_at)}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-3 sm:mt-4">
                    <Button
                      className="w-full px-3 py-1.5 text-sm sm:px-4 sm:py-2"
                      onClick={() => handleView(c.id)}
                    >
                      View
                    </Button>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 hidden rounded-md border border-brand-borderSoft min-[821px]:block">
              <table className="w-full border-collapse text-left">
                <thead className="bg-brand-surface text-sm text-brand-primary">
                  <tr>
                    <th className="px-4 py-3 font-bold">Class Name</th>
                    <th className="px-4 py-3 font-bold">Class Code</th>
                    <th className="px-4 py-3 font-bold">Students</th>
                    <th className="px-4 py-3 font-bold">Assignments</th>
                    <th className="px-4 py-3 font-bold">Created</th>
                    <th className="px-4 py-3 font-bold">Actions</th>
                    <th className="px-4 py-3 text-right font-bold">
                      More
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map((c) => (
                    <tr key={c.id} className="border-t border-brand-borderSoft">
                      <td className="max-w-[220px] truncate px-4 py-3 font-semibold text-brand-primary">
                        {c.class_name}
                      </td>
                      <td className="px-4 py-3 font-bold text-gray-600">
                        <CopyClassCode code={c.class_code} />
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        <button
                          type="button"
                          onClick={() => handleViewStudents(c.id)}
                          title="View Student List"
                          aria-label={`Open student list for ${c.class_name}`}
                          className="font-semibold text-brand-primary underline"
                        >
                          {c.students_count ?? 0}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {c.assignments_count ?? 0}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {formatCreatedDate(c.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          className="px-4 py-1.5 text-sm"
                          onClick={() => handleView(c.id)}
                        >
                          View
                        </Button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <MoreActionsMenu label={`More actions for ${c.class_name}`} />
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
    </div>
  );
}

export default TeacherDashboardPage;
