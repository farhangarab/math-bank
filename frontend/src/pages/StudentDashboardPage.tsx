import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Header from "../components/Header";
import { ROUTES } from "../router/routes";
import ClassCard from "../components/ClassCard";
import { useEffect, useState } from "react";
import { getStudentClasses } from "../api/classes";
import { useAuth } from "../context/AuthContext";
import { useMessage } from "../hooks/useMessage";
import MessageSlot from "../components/MessageSlot";
import type { ClassInfo } from "../types/class";
import Panel from "../components/Panel";
import { getFirstName } from "../utils/format";

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

          {/* Classes list */}
          <div className="flex flex-col gap-4 mt-6">
            {classes.map((c) => (
              <ClassCard
                key={c.class_id ?? c.id}
                id={c.class_id ?? c.id}
                name={c.class_name}
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

export default StudentDashboardPage;
