import Header from "../components/Header";
import Button from "../components/Button";
import Input from "../components/Input";
import { ROUTES } from "../router/routes";
import { useNavigate } from "react-router-dom";
import { joinClass } from "../api/auth";
import { useState } from "react";

function JoinClassPage() {
  const [classCode, setClassCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleJoin = async () => {
    try {
      setError("");
      setSuccess("");

      await joinClass(classCode);

      setSuccess("Joined successfully");

      setTimeout(() => {
        navigate(ROUTES.STUDENT_DASHBOARD);
      }, 800);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        leftText="Back"
        leftAction={() => navigate(ROUTES.STUDENT_DASHBOARD)}
      />

      <div className="flex flex-col items-center mt-10">
        {/* Title */}
        <h1 className="text-3xl font-bold text-[#354254]">Join Class</h1>

        <p className="mt-2 mb-6">Enter class code</p>

        {/* Form box */}
        <div className="w-[700px] border border-[#354254] rounded p-6">
          {/* Label */}
          <p className="mb-2 font-semibold text-[#354254]">Class Code</p>

          <div className="mb-4">
            <Input
              placeholder="Enter class code"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
            />
          </div>

          {/* pop up */}
          {error && <p className="text-red-500 text-xl mt-4">{error}</p>}
          {success && <p className="text-green-600 text-xl">{success}</p>}

          <div className="mt-6"></div>

          <Button onClick={handleJoin}>Join</Button>
        </div>
      </div>
    </div>
  );
}

export default JoinClassPage;
