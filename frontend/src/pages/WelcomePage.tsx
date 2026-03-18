import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { ROUTES } from "../router/routes";
import Button from "../components/Button";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-black">
      {/* header */}
      <Header
        title="MATHBANK"
        rightText="Login"
        rightAction={() => navigate(ROUTES.LOGIN)}
      />

      {/* body of the page */}
      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-3xl text-center px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">
            MATHBANK LEARNING PLATFORM
          </h1>
          <p className="text-lg md:text-xl text-gray-800 mb-12">
            Welcome to MathBank: Your Digital Math Learning Hub
          </p>

          {/* Registration Button Group */}
          <div className="flex flex-col items-center gap-4 mb-12 w-full">
            <p className="text-gray-600 font-semibold mb-2">
              Select your account type to register:
            </p>

            <Button
              variant="primary"
              full
              onClick={() => navigate(ROUTES.REGISTER_STUDENT)}
            >
              For Students
            </Button>

            <Button
              variant="primary"
              full
              onClick={() => navigate(ROUTES.REGISTER_TEACHER)}
            >
              For Teachers
            </Button>
          </div>

          <p className="text-gray-900 text-lg">
            Already have an account?{" "}
            <Link to={ROUTES.LOGIN} className="font-semibold hover:underline">
              Login.
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
