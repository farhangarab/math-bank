import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Header from "../../components/layout/Header";
import { ROUTES } from "../../router/routes";
import { useEffect, useState } from "react";
import { getStudentClasses } from "../../api/classes";
import { useAuth } from "../../hooks/useAuth";
import { useMessage } from "../../hooks/useMessage";
import MessageSlot from "../../components/ui/MessageSlot";
import type { ClassInfo } from "../../types/class";
import Panel from "../../components/ui/Panel";
import { getFirstName } from "../../utils/format";

function StudentDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleView = (id: number) => {
    navigate(`/class/${id}`);
  };
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const { message, clearAllMessages, showApiError } = useMessage();

  useEffect(() => {
    const loadClasses = async () => {
      try {
        clearAllMessages();
        const data = await getStudentClasses();

        setClasses(data);
      } catch (err) {
        showApiError(err, "Failed to load classes.");
      }
    };

    if (user) {
      void loadClasses();
    }
  }, [clearAllMessages, showApiError, user]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* MAIN CONTAINER */}
      <div className="mx-auto mt-10 flex w-full max-w-[760px] flex-col items-center px-4 sm:px-6">
        {/* Title */}
        <h1 className="text-center text-3xl font-bold text-brand-primary">
          Student Dashboard
        </h1>

        <p className="mb-6 mt-2 text-center">
          Welcome back, {getFirstName(user?.full_name)}! 👋
        </p>

        {/* Join class button */}
        <div className="mb-8">
          <MessageSlot message={message} />
          <Button onClick={() => navigate(ROUTES.JOIN_CLASS)}>
            Join Class
          </Button>
        </div>

        {/* My classes section */}
        <Panel className="w-full">
          <h2 className="text-xl font-bold mb-4 text-brand-primary">
            My Classes
          </h2>

          {classes.length === 0 ? (
            <p className="mt-6 text-gray-500">No classes yet.</p>
          ) : (
            <>
              <div className="mt-4 space-y-2 min-[821px]:hidden">
                {classes.map((c) => {
                  const classId = c.class_id ?? c.id;

                  return (
                    <article
                      key={classId}
                      className="rounded-md border border-brand-borderSoft bg-white p-3 sm:p-4"
                    >
                      <h3 className="truncate text-sm font-semibold text-brand-primary sm:text-base">
                        {c.class_name}
                      </h3>

                      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs sm:text-sm">
                        <div className="min-w-0">
                          <dt className="font-semibold text-gray-500">
                            Professor
                          </dt>
                          <dd className="truncate text-gray-800">
                            {c.professor_name}
                          </dd>
                        </div>
                        <div>
                          <dt className="font-semibold text-gray-500">
                            Assignments
                          </dt>
                          <dd className="text-gray-800">
                            {c.assignments_count ?? 0}
                          </dd>
                        </div>
                      </dl>

                      <div className="mt-3 sm:mt-4">
                        <Button
                          className="w-full px-3 py-1.5 text-sm sm:px-4 sm:py-2"
                          onClick={() => handleView(classId)}
                        >
                          View
                        </Button>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="mt-6 hidden overflow-hidden rounded-md border border-brand-borderSoft min-[821px]:block">
                <table className="w-full border-collapse text-left">
                  <thead className="bg-brand-surface text-sm text-brand-primary">
                    <tr>
                      <th className="px-4 py-3 font-bold">Class Name</th>
                      <th className="px-4 py-3 font-bold">Professor</th>
                      <th className="px-4 py-3 font-bold">Assignments</th>
                      <th className="px-4 py-3 font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classes.map((c) => {
                      const classId = c.class_id ?? c.id;

                      return (
                        <tr
                          key={classId}
                          className="border-t border-brand-borderSoft"
                        >
                          <td className="max-w-[240px] truncate px-4 py-3 font-semibold text-brand-primary">
                            {c.class_name}
                          </td>
                          <td className="max-w-[200px] truncate px-4 py-3 text-gray-700">
                            {c.professor_name}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {c.assignments_count ?? 0}
                          </td>
                          <td className="px-4 py-3">
                            <Button
                              className="px-4 py-1.5 text-sm"
                              onClick={() => handleView(classId)}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
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

export default StudentDashboardPage;
