import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Header from "../components/Header";
import { ROUTES } from "../router/routes";
import ClassCard from "../components/ClassCard";
import { useEffect, useState } from "react";
import { getTeacherClasses } from "../api/classes";
import { useAuth } from "../context/AuthContext";
import { useMessage } from "../hooks/useMessage";
import MessageSlot from "../components/MessageSlot";
import type { ClassInfo } from "../types/class";
import Panel from "../components/Panel";

function TeacherDashboardPage() {
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
        <Panel className="w-[700px]">
          <h2 className="text-xl font-bold mb-4 text-brand-primary">My Classes</h2>

          {/* Example list */}
          <div className="flex flex-col gap-4 mt-6">
            {classes.map((c) => (
              <ClassCard
                key={c.id}
                id={c.id}
                name={c.class_name}
                code={c.class_code}
                onView={handleView}
              />
            ))}

            {classes.length === 0 && (
              <p className="text-gray-500">No classes yet.</p>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}

export default TeacherDashboardPage;
