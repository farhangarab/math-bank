import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Header from "../components/Header";
import { ROUTES } from "../router/routes";
import ClassCard from "../components/ClassCard";

function TeacherDashboardPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* MAIN CONTAINER */}
      <div className="flex flex-col items-center mt-10">
        {/* Title */}
        <h1 className="text-3xl font-bold text-[#354254]">Teacher Dashboard</h1>

        <p className="mt-2 mb-6">Welcome teacher</p>

        {/* Create class button */}
        <div className="mb-8" onClick={() => navigate(ROUTES.CREATE_CLASS)}>
          <Button>Create Class</Button>
        </div>

        {/* My classes section */}
        <div className="w-[700px] border border-[#354254] rounded p-6">
          <h2 className="text-xl font-bold mb-4 text-[#354254]">My Classes</h2>

          <ClassCard name="Algebra" code="T111" />
          <ClassCard name="Calculus" code="T222" />
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboardPage;
