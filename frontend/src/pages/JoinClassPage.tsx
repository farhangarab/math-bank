import Header from "../components/Header";
import Button from "../components/Button";
import Input from "../components/Input";
import { ROUTES } from "../router/routes";
import { useNavigate } from "react-router-dom";
import { joinClass } from "../api/classes";
import { useState } from "react";
import { useMessage } from "../hooks/useMessage";
import MessageSlot from "../components/MessageSlot";
import Panel from "../components/Panel";
import Tooltip from "../components/ui/Tooltip";

function JoinClassPage() {
  const [classCode, setClassCode] = useState("");
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

  const handleJoin = async () => {
    clearAllMessages();

    if (!classCode.trim()) {
      showFieldError("class_code", "Class code is required.");
      return;
    }

    try {
      await joinClass(classCode);

      showSuccess("Class joined successfully.");

      setTimeout(() => {
        navigate(ROUTES.STUDENT_DASHBOARD);
      }, 800);
    } catch (err: any) {
      showApiError(err, "Join class failed.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        leftText="Back"
        leftAction={() => navigate(ROUTES.STUDENT_DASHBOARD)}
      />

      <div className="mx-auto mt-10 flex w-full max-w-[760px] flex-col items-center px-4 sm:px-6">
        {/* Title */}
        <h1 className="text-center text-3xl font-bold text-brand-primary">Join Class</h1>

        <p className="mt-2 mb-6">Enter class code</p>

        {/* Form box */}
        <Panel className="w-full">
          {/* Label */}
          <p className="mb-2 font-semibold text-brand-primary">Class Code</p>

          <div className="mb-4">
            <Tooltip
              text="Your teacher gives you this code."
              className="w-full"
            >
              <Input
                placeholder="Enter class code"
                value={classCode}
                error={fieldErrors.class_code}
                onChange={(e) => {
                  setClassCode(e.target.value);
                  clearFieldError("class_code");
                }}
              />
            </Tooltip>
          </div>

          <MessageSlot message={message} />

          <Button onClick={handleJoin}>Join</Button>
        </Panel>
      </div>
    </div>
  );
}

export default JoinClassPage;
