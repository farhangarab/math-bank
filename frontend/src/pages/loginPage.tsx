import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/header";
import Input from "../components/input";
import { loginUser } from "../api/auth";
import { ROUTES } from "../router/routes";
import Button from "../components/button";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const data = await loginUser(username, password);

      console.log("LOGIN OK", data);

      navigate(ROUTES.DASHBOARD);
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
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="mt-8"></div>

            <Button
              type="submit"
              variant="primary"
              full
              onClick={() => navigate(ROUTES.LOGIN)}
            >
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
