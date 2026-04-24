import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Input from "../components/Input";
import { ROUTES } from "../router/routes";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setError("");
      const user = await login(identifier, password, remember);

      if (user.role === "STUDENT") {
        navigate(ROUTES.STUDENT_DASHBOARD);
      } else {
        navigate(ROUTES.TEACHER_DASHBOARD);
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-black">
      {/* header */}
      <Header
        title="MATHBANK"
        leftText="Back"
        leftAction={() => navigate(ROUTES.HOME)}
      />

      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md text-center px-6">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight">
            MATHBANK LEARNING PLATFORM
          </h1>

          <p className="text-md md:text-lg text-gray-800 mb-8">
            Login to your account
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <Input
              type="text"
              placeholder="Username or email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label className="flex items-center gap-2 text-left text-sm text-gray-700">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember Me
            </label>

            <div className="mt-8"></div>

            <Button type="submit" variant="primary" full>
              Log In
            </Button>
          </form>

          {/* pop up error */}
          {error && <p className="text-red-500 mt-4">{error}</p>}

          <p className="text-gray-900 text-lg mt-6">
            Don't have an account?{" "}
            <Link to={ROUTES.HOME} className="font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
