export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",

  REGISTER_STUDENT: "/register/student",
  REGISTER_TEACHER: "/register/teacher",

  STUDENT_DASHBOARD: "/dashboard/student",
  TEACHER_DASHBOARD: "/dashboard/teacher",

  CREATE_CLASS: "/teacher/create-class",
  JOIN_CLASS: "/student/join-class",
  STUDENT_LIST: "/teacher/classes/:classId/students",

  CLASS_DETAILS: "class/:id",

  CREATE_ASSIGNMENT: "/class/:id/create-assignment",

  ASSIGNMENT_QUESTIONS: "/assignment/:id/questions",

  STUDENT_ASSIGNMENT_PAGE: "/attempt/:attemptId",

  TEACHER_SUBMISSIONS_PAGE: "/assignment/:id/submissions"
};
