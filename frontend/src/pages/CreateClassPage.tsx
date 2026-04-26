import Header from "../components/Header";
import Button from "../components/Button";
import Input from "../components/Input";
import { ROUTES } from "../router/routes";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createClass } from "../api/classes";
import { useMessage } from "../hooks/useMessage";
import MessageSlot from "../components/MessageSlot";
import Panel from "../components/Panel";

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
        <h1 className="text-3xl font-bold text-brand-primary">Create Class</h1>

        <p className="mt-2 mb-6">Enter class name</p>

        {/* Form box */}
        <Panel className="w-[700px]">
          {/* Label */}
          <p className="mb-2 font-semibold text-brand-primary">Class Name</p>
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

          <MessageSlot message={message} />

          <Button onClick={handleCreate}>Create</Button>
        </Panel>
      </div>
    </div>
  );
}

export default CreateClassPage;
