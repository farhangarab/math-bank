import Header from "../components/Header";
import Button from "../components/Button";
import Input from "../components/Input";
import { ROUTES } from "../router/routes";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { createClass, getClassById, updateClass } from "../api/classes";
import { useMessage } from "../hooks/useMessage";
import MessageSlot from "../components/MessageSlot";
import Panel from "../components/Panel";

function CreateClassPage() {
  const { classId } = useParams();
  const editClassId = classId ? Number(classId) : null;
  const isEditMode = editClassId !== null;
  const [className, setClassName] = useState("");
  const [originalClassName, setOriginalClassName] = useState("");
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
  const pageTitle = isEditMode ? "Update Class" : "Create Class";
  const helperText = isEditMode ? "Edit class name" : "Enter class name";
  const buttonText = isEditMode ? "Update" : "Create Class";
  const hasClassChanges =
    !isEditMode || className.trim() !== originalClassName.trim();
  const isUpdateDisabled = isEditMode && !hasClassChanges;

  useEffect(() => {
    async function loadClassForEdit() {
      if (!editClassId) return;

      try {
        clearAllMessages();
        const classInfo = await getClassById(editClassId);
        setClassName(classInfo.class_name);
        setOriginalClassName(classInfo.class_name);
      } catch (err) {
        showApiError(err, "Failed to load class.");
      }
    }

    loadClassForEdit();
  }, [editClassId]);

  const handleSubmit = async () => {
    clearAllMessages();

    if (!className.trim()) {
      showFieldError("class_name", "Class name is required.");
      return;
    }

    try {
      if (isEditMode && editClassId) {
        await updateClass(editClassId, className.trim());
        showSuccess("Class updated successfully.");
      } else {
        await createClass(className.trim());
        showSuccess("Class created successfully.");
      }

      setTimeout(() => {
        navigate(ROUTES.TEACHER_DASHBOARD);
      }, 800);
    } catch (err: any) {
      showApiError(err, isEditMode ? "Update class failed." : "Create class failed.");
    }
  };
  return (
    <div className="min-h-screen bg-white">
      <Header
        leftText="Back"
        leftAction={() => navigate(ROUTES.TEACHER_DASHBOARD)}
      />

      <div className="mx-auto mt-10 flex w-full max-w-[760px] flex-col items-center px-4 sm:px-6">
        {/* Title */}
        <h1 className="text-center text-3xl font-bold text-brand-primary">
          {pageTitle}
        </h1>

        <p className="mt-2 mb-6">{helperText}</p>

        {/* Form box */}
        <Panel className="w-full">
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

          <span
            title={
              isUpdateDisabled ? "Make a change before updating." : undefined
            }
          >
            <Button onClick={handleSubmit} disabled={isUpdateDisabled}>
              {buttonText}
            </Button>
          </span>
        </Panel>
      </div>
    </div>
  );
}

export default CreateClassPage;
