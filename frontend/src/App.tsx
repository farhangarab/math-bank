import { BrowserRouter, Route, Routes } from "react-router-dom";
import WelcomePage from "./pages/temp22";
import LoginPage from "./pages/temp11";
// import StudentRegPage from "./pages/studentRegisterPage";
import { ROUTES } from "./router/routes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<WelcomePage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route
          path={ROUTES.REGISTER_STUDENT}
          // element={<StudentRegisterPage />}
        />
        <Route
          path={ROUTES.REGISTER_TEACHER}
          // element={<TeacherRegPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
