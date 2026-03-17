import { BrowserRouter, Route, Routes } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/loginPage";
import StudentRegPage from "./pages/studentRegisterPage";
import TeacherRegPage from "./pages/teacherRegisterPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>

        <Route path="/register/student" element={<StudentRegPage />}></Route>
        <Route path="/register/teacher" element={<TeacherRegPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
