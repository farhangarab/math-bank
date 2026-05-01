import Header from "../components/Header";
import Input from "../components/Input";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../router/routes";
import { useState } from "react";
import { registerUser } from "../api/auth";
import { useMessage } from "../hooks/useMessage";
import { firstInvalid } from "../utils/validation";
import MessageSlot from "../components/MessageSlot";
import Tooltip from "../components/ui/Tooltip";

export default function TeacherRegisterPage() {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [teacherCode, setTeacherCode] = useState("");

  const navigate = useNavigate();

  const {
    message,
    fieldErrors,
    clearAllMessages,
    clearFieldError,
    showApiError,
    showFieldError,
    showSuccess,
  } = useMessage();

  const isValidEmail = (email: string) => {
    const pattern = /^[^@]+@[^@]+\.[^@]+$/;
    return pattern.test(email);
  };

  const handleRegister = async () => {
    clearAllMessages();

    const invalid = firstInvalid([
      {
        field: "full_name",
        message: "Full name is required.",
        isValid: fullName.trim() !== "",
      },
      {
        field: "username",
        message: "Username is required.",
        isValid: username.trim() !== "",
      },
      {
        field: "email",
        message: "Email is required.",
        isValid: email.trim() !== "",
      },
      {
        field: "email",
        message: "Email format is invalid.",
        isValid: !email.trim() || isValidEmail(email),
      },
      {
        field: "password",
        message: "Password is required.",
        isValid: password !== "",
      },
      {
        field: "password",
        message: "Password must be at least 8 characters.",
        isValid: !password || password.length >= 8,
      },
      {
        field: "confirm_password",
        message: "Confirm password is required.",
        isValid: confirmPassword !== "",
      },
      {
        field: "confirm_password",
        message: "Passwords do not match.",
        isValid: !confirmPassword || password === confirmPassword,
      },
      {
        field: "teacher_code",
        message: "Teacher access code is required.",
        isValid: teacherCode.trim() !== "",
      },
    ]);

    if (invalid) {
      showFieldError(invalid.field, invalid.message);
      return;
    }

    try {
      await registerUser(
        username,
        fullName,
        email,
        password,
        "TEACHER",
        teacherCode,
      );

      showSuccess("Account created successfully.");

      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 1500);
    } catch (err: any) {
      showApiError(err, "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header leftText="Back" leftAction={() => navigate(ROUTES.HOME)} />

      <div className="flex flex-col items-center justify-center mt-16 gap-6">
        <h1 className="text-3xl font-bold text-brand-primary">
          Teacher Registration
        </h1>

        {/* Input fields */}
        <div className="w-full max-w-[400px]  text-center flex flex-col gap-4">
          <Input
            placeholder="Full Name"
            value={fullName}
            error={fieldErrors.full_name}
            onChange={(e) => {
              setFullName(e.target.value);
              clearFieldError("full_name");
            }}
          />

          <Input
            placeholder="Username"
            value={username}
            error={fieldErrors.username}
            onChange={(e) => {
              setUsername(e.target.value);
              clearFieldError("username");
            }}
          />

          <Input
            placeholder="Email"
            value={email}
            error={fieldErrors.email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearFieldError("email");
            }}
          />

          <Input
            placeholder="Password"
            type="password"
            value={password}
            error={fieldErrors.password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearFieldError("password");
            }}
          />

          <Input
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            error={fieldErrors.confirm_password}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              clearFieldError("confirm_password");
            }}
          />

          <Tooltip
            text="Ask your school or admin for this code."
            className="w-full"
          >
            <Input
              placeholder="Teacher Access Code"
              value={teacherCode}
              error={fieldErrors.teacher_code}
              onChange={(e) => {
                setTeacherCode(e.target.value);
                clearFieldError("teacher_code");
              }}
            />
          </Tooltip>

          <MessageSlot message={message} />

          <Button type="submit" variant="primary" full onClick={handleRegister}>
            Register
          </Button>

          <p className="text-brand-primary">
            Already have an account?{" "}
            <Link to={ROUTES.LOGIN} className="font-semibold hover:underline">
              Login.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
