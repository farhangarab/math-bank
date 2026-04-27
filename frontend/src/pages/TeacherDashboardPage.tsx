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
import { formatCreatedDate } from "../utils/format";
import CopyIcon from "../components/icons/CopyIcon";

function TeacherDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [copiedClassId, setCopiedClassId] = useState<number | null>(null);

  const handleView = (id: number) => {
    navigate(`/class/${id}`);
  };

  const handleCopyClassCode = (id: number, code?: string) => {
    if (!code) return;

    navigator.clipboard?.writeText(code);
    setCopiedClassId(id);

    setTimeout(() => {
      setCopiedClassId(null);
    }, 1500);
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
      <div className="flex flex-col items-center mt-10">
        {/* Title */}
        <h1 className="text-3xl font-bold text-brand-primary">Teacher Dashboard</h1>

        <p className="mt-2 mb-6">Welcome {user?.full_name ?? "teacher"}</p>

        {/* Create class button */}
        <div className="mb-8">
          <MessageSlot message={message} />
          <Button onClick={() => navigate(ROUTES.CREATE_CLASS)}>Create Class</Button>
        </div>

        {/* My classes section */}
        <Panel className="w-full max-w-[900px]">
          <h2 className="text-xl font-bold mb-4 text-brand-primary">My Classes</h2>

          {classes.length === 0 ? (
            <p className="mt-6 text-gray-500">No classes yet.</p>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-md border border-brand-borderSoft">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead className="bg-brand-surface text-sm text-brand-primary">
                  <tr>
                    <th className="px-4 py-3 font-bold">Class Name</th>
                    <th className="px-4 py-3 font-bold">Class Code</th>
                    <th className="px-4 py-3 font-bold">Students</th>
                    <th className="px-4 py-3 font-bold">Assignments</th>
                    <th className="px-4 py-3 font-bold">Created</th>
                    <th className="px-4 py-3 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map((c) => (
                    <tr key={c.id} className="border-t border-brand-borderSoft">
                      <td className="px-4 py-3 font-semibold text-brand-primary">
                        {c.class_name}
                      </td>
                      <td className="px-4 py-3 font-bold text-gray-600">
                        {c.class_code ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleCopyClassCode(c.id, c.class_code)}
                              className="flex cursor-copy items-center gap-2 font-bold text-gray-600 hover:text-brand-primary"
                            >
                              <span>{c.class_code}</span>
                              <CopyIcon />
                            </button>
                            {copiedClassId === c.id && (
                              <span className="rounded-full border border-status-successBorder bg-status-successBg px-2 py-1 text-sm font-semibold text-status-successText">
                                Copied
                              </span>
                            )}
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {c.students_count ?? 0}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {c.assignments_count ?? 0}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {formatCreatedDate(c.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex w-full items-center justify-between gap-2">
                          <Button onClick={() => handleView(c.id)}>View</Button>
                          <button
                            type="button"
                            aria-label={`More actions for ${c.class_name}`}
                            className="ml-auto rounded-md px-2 py-2 text-xl font-bold leading-none text-brand-primary transition-colors hover:bg-brand-surface"
                          >
                            &#8942;
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

export default TeacherDashboardPage;
