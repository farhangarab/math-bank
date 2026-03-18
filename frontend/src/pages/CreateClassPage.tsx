import Header from "../components/Header";
import Button from "../components/Button";
import Input from "../components/Input";
import { ROUTES } from "../router/routes";
import { useNavigate } from "react-router-dom";

function CreateClassPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Header
        leftText="Back"
        leftAction={() => navigate(ROUTES.TEACHER_DASHBOARD)}
      />

      <div className="flex flex-col items-center mt-10">
        {/* Title */}
        <h1 className="text-3xl font-bold text-[#354254]">Create Class</h1>

        <p className="mt-2 mb-6">Enter class name</p>

        {/* Form box */}
        <div className="w-[700px] border border-[#354254] rounded p-6">
          {/* Label */}
          <p className="mb-2 font-semibold text-[#354254]">Class Name</p>
          <div className="mb-4">
            <Input placeholder="Enter class name" />
          </div>

          <Button>Create</Button>
        </div>
      </div>
    </div>
  );
}

export default CreateClassPage;
