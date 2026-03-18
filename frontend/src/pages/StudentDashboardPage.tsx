import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Header from "../components/Header";
import { ROUTES } from "../router/routes";
import ClassCard from "../components/ClassCard";
import { useEffect, useState } from "react";
import { getStudentClasses } from "../api/auth";

function StudentDashboardPage() {
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user")!);

        const data = await getStudentClasses(user.id);

        setClasses(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    loadClasses();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* MAIN CONTAINER */}
      <div className="flex flex-col items-center mt-10">
        {/* Title */}
        <h1 className="text-3xl font-bold text-[#354254]">Student Dashboard</h1>

        <p className="mt-2 mb-6">Welcome student</p>

        {/* Join class button */}
        <div className="mb-8">
          <Button onClick={() => navigate(ROUTES.JOIN_CLASS)}>
            Join Class
          </Button>
        </div>

        {/* My classes section */}
        <div className="w-[700px] border border-[#354254] rounded p-6">
          <h2 className="text-xl font-bold mb-4 text-[#354254]">My Classes</h2>

          {/* Example list */}
          <div className="flex flex-col gap-4 mt-6">
            {classes.map((c: any) => (
              <ClassCard key={c.id} name={c.class_name} code={c.class_code} />
            ))}

            {error && <p className="text-red-500">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboardPage;
