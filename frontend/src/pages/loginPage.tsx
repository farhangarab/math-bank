import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed!");
        return;
      }

      console.log("LOGIN OK", data);

      navigate("/dashboard");
    } catch (error) {
      setError("Server Error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-black">
      {/* header */}
      <header className="w-full flex items-center px-6 py-4 bg-[#354254] text-white">
        {/* top back button */}
        <div className="flex-1 flex justify-start">
          <Link to="/">
            <button className="border-2 border-white text-white font-semibold px-6 py-2 rounded-md hover:bg-white hover:text-[#354254] transition-colors duration-200">
              Back
            </button>
          </Link>
        </div>

        {/* header text */}
        <div className="flex-1 text-center text-xl font-bold tracking-widest">
          MATHBANK
        </div>
        <div className="flex-1"></div>
      </header>

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
            <input
              type="username"
              placeholder="Username"
              className="w-full border-2 border-[#354254] rounded-md px-4 py-3 text-lg"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border-2 border-[#354254] rounded-md px-4 py-3 text-lg"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              className="w-full bg-[#354254] text-white text-xl font-semibold py-3 mt-8 rounded-md shadow-[0_5px_0_#202834] active:translate-y-[5px]"
            >
              Log In
            </button>
          </form>

          {/* pop up error */}
          {error && <p className="text-red-500 mt-4">{error}</p>}

          <p className="text-gray-900 text-lg mt-6">
            Don't have an account?{" "}
            <Link to="/" className="font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
