import { BrowserRouter, Route, Routes } from "react-router-dom";
// import StudentRegPage from "./pages/studentRegisterPage";
import { ROUTES } from "./router/routes";
import WelcomePage from "./pages/welcomePage";
import LoginPage from "./pages/loginPage";
import TeacherRegPage from "./pages/teacherRegisterPage";

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
        <Route path={ROUTES.REGISTER_TEACHER} element={<TeacherRegPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
