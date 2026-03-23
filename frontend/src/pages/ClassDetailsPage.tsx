import Header from "../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../router/routes";

function ClassDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      {/* header */}
      <Header
        title="MATHBANK"
        leftText="Back"
        leftAction={() => navigate(ROUTES.TEACHER_DASHBOARD)}
      />

      <div className="flex flex-col items-center mt-10">
        <h1 className="text-3xl font-bold text-[#354254]">Class Details</h1>

        <p className="mt-4">Class ID: {id}</p>
      </div>
    </div>
  );
}

export default ClassDetailsPage;
