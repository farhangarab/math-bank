import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Header from "../components/Header";
import { ROUTES } from "../router/routes";
import ClassCard from "../components/ClassCard";
import { useEffect, useState } from "react";
import { getStudentClasses } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useMessage } from "../hooks/useMessage";
import MessageSlot from "../components/MessageSlot";

function StudentDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleView = (id: number) => {
    navigate(`/class/${id}`);
  };
  const [classes, setClasses] = useState([]);
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
      <div className="flex flex-col items-center mt-10">
        {/* Title */}
        <h1 className="text-3xl font-bold text-[#354254]">Student Dashboard</h1>

        <p className="mt-2 mb-6">Welcome {user?.full_name ?? "student"}</p>

        {/* Join class button */}
        <div className="mb-8">
          <MessageSlot message={message} />
          <Button onClick={() => navigate(ROUTES.JOIN_CLASS)}>
            Join Class
          </Button>
        </div>

        {/* My classes section */}
        <div className="w-[700px] border border-[#354254] rounded p-6">
          <h2 className="text-xl font-bold mb-4 text-[#354254]">My Classes</h2>

          {/* Classes list */}
          <div className="flex flex-col gap-4 mt-6">
            {classes.map((c: any) => (
              <ClassCard
                key={c.class_id}
                id={c.class_id}
                name={c.class_name}
                onView={handleView}
              />
            ))}

            {classes.length === 0 && (
              <p className="text-gray-500">No classes yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboardPage;
