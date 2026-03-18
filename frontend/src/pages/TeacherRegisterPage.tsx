import Header from "../components/Header";
import Input from "../components/Input";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../router/routes";
import { useState } from "react";
import { registerUser } from "../api/auth";

export default function TeacherRegisterPage() {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [teacherCode, setTeacherCode] = useState("");

  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isValidEmail = (email: string) => {
    const pattern = /^[^@]+@[^@]+\.[^@]+$/;
    return pattern.test(email);
  };

  const handleRegister = async () => {
    if (!isValidEmail(email)) {
      setError("Invalid email format");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
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

      setSuccess("Account created successfully");

      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header leftText="Back" leftAction={() => navigate(ROUTES.HOME)} />

      <div className="flex flex-col items-center justify-center mt-16 gap-6">
        <h1 className="text-3xl font-bold text-[#354254]">
          Teacher Registration
        </h1>

        {/* Input fields */}
        <div className="w-full max-w-[400px]  text-center flex flex-col gap-4">
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Input
            placeholder="Teacher Access Code"
            value={teacherCode}
            onChange={(e) => setTeacherCode(e.target.value)}
          />

          {/* pop up */}
          {error && <p className="text-red-500 text-xl mt-4">{error}</p>}

          {success && <p className="text-green-600 text-xl">{success}</p>}

          <div className="mt-6"></div>

          <Button type="submit" variant="primary" full onClick={handleRegister}>
            Register
          </Button>
        </div>
      </div>
    </div>
  );
}
