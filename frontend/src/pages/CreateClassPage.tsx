import Header from "../components/Header";
import Button from "../components/Button";
import Input from "../components/Input";
import { ROUTES } from "../router/routes";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createClass } from "../api/auth";
import Alert from "../components/Alert";
import { useMessage } from "../hooks/useMessage";

function CreateClassPage() {
  const [className, setClassName] = useState("");
  const {
    message,
    fieldErrors,
    clearAllMessages,
    clearFieldError,
    showApiError,
    showFieldError,
    showSuccess,
  } = useMessage();

  const navigate = useNavigate();

  const handleCreate = async () => {
    clearAllMessages();

    if (!className.trim()) {
      showFieldError("class_name", "Class name is required.");
      return;
    }

    try {
      await createClass(className);

      showSuccess("Class created successfully.");

      setTimeout(() => {
        navigate(ROUTES.TEACHER_DASHBOARD);
      }, 800);
    } catch (err: any) {
      showApiError(err, "Create class failed.");
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
              error={fieldErrors.class_name}
              onChange={(e) => {
                setClassName(e.target.value);
                clearFieldError("class_name");
              }}
            />
          </div>

          <Button onClick={handleCreate}>Create</Button>

          <div className="mt-4">
            {message && <Alert type={message.type} message={message.text} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateClassPage;
