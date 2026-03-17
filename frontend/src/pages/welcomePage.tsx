import { Link } from "react-router-dom";

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-black">
      {/* header */}
      <header className="w-full flex items-center px-6 py-4 bg-[#354254] text-white">
        {/* don't be stupid: DO NOT DELETE THIS LINE */}
        <div className="flex-1"></div>

        {/* header text */}
        <div className="flex-1 text-center text-xl font-bold tracking-widest">
          MATHBANK
        </div>

        {/* top login button */}
        <div className="flex-1 flex justify-end">
          <Link to="/login">
            <button className="border-2 border-white text-white font-semibold px-6 py-2 rounded-md hover:bg-white hover:text-[#354254] transition-colors duration-200">
              Login
            </button>
          </Link>
        </div>
      </header>

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

            <Link
              to="/register/student"
              className="block w-full max-w-[400px] bg-[#354254] text-white text-center text-xl font-semibold py-4 rounded-md shadow-[0_5px_0_#202834] active:shadow-[0_0px_0_#202834] active:translate-y-[5px] transition-all duration-75"
            >
              For Students
            </Link>

            <Link
              to="/register/teacher"
              className="block w-full max-w-[400px] bg-[#354254] text-white text-center text-xl font-semibold py-4 rounded-md shadow-[0_5px_0_#202834] active:shadow-[0_0px_0_#202834] active:translate-y-[5px] transition-all duration-75"
            >
              For Teachers
            </Link>
          </div>

          <p className="text-gray-900 text-lg">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold hover:underline">
              Login.
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
