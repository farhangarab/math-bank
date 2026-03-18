import Header from "../components/Header";
import Button from "../components/Button";
import Input from "../components/Input";
import { ROUTES } from "../router/routes";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createClass } from "../api/auth";

function CreateClassPage() {
  const [className, setClassName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      setError("");
      setSuccess("");

      const user = JSON.parse(localStorage.getItem("user")!);

      await createClass(user.id, className);

      setSuccess("Class created successfully");

      setTimeout(() => {
        navigate(ROUTES.TEACHER_DASHBOARD);
      }, 800);
    } catch (err: any) {
      setError(err.message);
    }
  };
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
            <Input
              placeholder="Enter class name"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
          </div>

          <Button onClick={handleCreate}>Create</Button>

          {/* pop up */}
          {error && <p className="text-red-500 text-xl mt-4">{error}</p>}
          {success && <p className="text-green-600 text-xl">{success}</p>}
        </div>
      </div>
    </div>
  );
}

export default CreateClassPage;
