import { BrowserRouter, Route, Routes } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/LoginPage";
import { ROUTES } from "./router/routes";
import StudentRegisterPage from "./pages/StudentRegisterPage";
import TeacherRegisterPage from "./pages/TeacherRegisterPage";
import StudentDashboardPage from "./pages/StudentDashboardPage";
import TeacherDashboardPage from "./pages/TeacherDashboardPage";
import CreateClassPage from "./pages/CreateClassPage";
import JoinClassPage from "./pages/JoinClassPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<WelcomePage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route
          path={ROUTES.REGISTER_STUDENT}
          element={<StudentRegisterPage />}
        />

        <Route
          path={ROUTES.REGISTER_TEACHER}
          element={<TeacherRegisterPage />}
        />

        <Route
          path={ROUTES.STUDENT_DASHBOARD}
          element={<StudentDashboardPage />}
        />

        <Route
          path={ROUTES.TEACHER_DASHBOARD}
          element={<TeacherDashboardPage />}
        />

        <Route path={ROUTES.CREATE_CLASS} element={<CreateClassPage />} />
        <Route path={ROUTES.JOIN_CLASS} element={<JoinClassPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
