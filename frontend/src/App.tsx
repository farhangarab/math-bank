import { BrowserRouter, Route, Routes } from "react-router-dom";
import WelcomePage from "./pages/shared/WelcomePage";
import LoginPage from "./pages/auth/LoginPage";
import { ROUTES } from "./router/routes";
import StudentRegisterPage from "./pages/auth/StudentRegisterPage";
import TeacherRegisterPage from "./pages/auth/TeacherRegisterPage";
import StudentDashboardPage from "./pages/student/StudentDashboardPage";
import TeacherDashboardPage from "./pages/teacher/TeacherDashboardPage";
import CreateClassPage from "./pages/teacher/CreateClassPage";
import JoinClassPage from "./pages/student/JoinClassPage";
import ClassDetailsPage from "./pages/shared/ClassDetailsPage";
import CreateAssignmentPage from "./pages/teacher/CreateAssignmentPage";
import QuestionPage from "./pages/teacher/QuestionPage";
import StudentAssignmentPage from "./pages/student/StudentAssignmentPage";
import TeacherSubmissionsPage from "./pages/teacher/TeacherSubmissionsPage";
import StudentListPage from "./pages/teacher/StudentListPage";
import ProtectedRoute from "./components/layout/ProtectedRoute";

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

        <Route element={<ProtectedRoute roles={["STUDENT"]} />}>
          <Route
            path={ROUTES.STUDENT_DASHBOARD}
            element={<StudentDashboardPage />}
          />
          <Route path={ROUTES.JOIN_CLASS} element={<JoinClassPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={["TEACHER"]} />}>
          <Route
            path={ROUTES.TEACHER_DASHBOARD}
            element={<TeacherDashboardPage />}
          />
          <Route path={ROUTES.CREATE_CLASS} element={<CreateClassPage />} />
          <Route path={ROUTES.EDIT_CLASS} element={<CreateClassPage />} />
          <Route
            path={ROUTES.STUDENT_LIST}
            element={<StudentListPage />}
          />
          <Route
            path={ROUTES.CREATE_ASSIGNMENT}
            element={<CreateAssignmentPage />}
          />
          <Route
            path={ROUTES.EDIT_ASSIGNMENT}
            element={<CreateAssignmentPage />}
          />
          <Route path={ROUTES.ASSIGNMENT_QUESTIONS} element={<QuestionPage />} />
          <Route
            path={ROUTES.TEACHER_SUBMISSIONS_PAGE}
            element={<TeacherSubmissionsPage />}
          />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.CLASS_DETAILS} element={<ClassDetailsPage />} />
          <Route
            path={ROUTES.STUDENT_ASSIGNMENT_PAGE}
            element={<StudentAssignmentPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
